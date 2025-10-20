const path = require('path');
const fs = require('fs');
let sharp;
try {
  sharp = require('sharp');
} catch (err) {
  // sharp is a native dependency and may fail to install on some environments.
  // Fall back to null and make image functions no-ops so the server can start.
  console.warn('Optional dependency `sharp` is not available — image processing will be disabled.');
  sharp = null;
}
const { spawn } = require('child_process');

const mediaProcessingService = {
  async generateImageVariants(assetId, srcPath, outDir) {
    // srcPath: local path to source image
    // outDir: folder to write variants
    try {
      if (!sharp) {
        // No-op fallback: return an empty variant list so callers can continue.
        console.warn('generateImageVariants called but `sharp` is not available — returning empty variants.');
        return [];
      }

      const variants = [];
      const sizes = [{ name: 'thumb', width: 320 }, { name: 'small', width: 640 }, { name: 'large', width: 1200 }];
      for (const s of sizes) {
        const outFile = path.join(outDir, `${assetId}-${s.name}.jpg`);
        await sharp(srcPath).resize(s.width).jpeg({ quality: 75 }).toFile(outFile);
        const stat = fs.statSync(outFile);
        variants.push({ variant_type: s.name, file_path: outFile, file_size: stat.size });
      }
      return variants;
    } catch (e) {
      console.error('generateImageVariants error', e);
      throw e;
    }
  },

  async extractVideoThumbnail(srcPath, outPath, atSecond = 1) {
    // Placeholder: use ffmpeg via child_process or fluent-ffmpeg
    // For now, return a promise that rejects if ffmpeg not available
    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', ['-ss', String(atSecond), '-i', srcPath, '-frames:v', '1', '-q:v', '2', outPath]);
      ffmpeg.on('close', (code) => {
        if (code === 0) return resolve(outPath);
        reject(new Error(`ffmpeg exited ${code}`));
      });
      ffmpeg.on('error', (err) => reject(err));
    });
  },

  async processAudio(srcPath, outPath) {
    // Implement audio conversion and metadata extraction using ffprobe/ffmpeg
    const { spawn } = require('child_process');
    return new Promise((resolve, reject) => {
      // run ffprobe to get metadata
      const ffprobe = spawn('ffprobe', ['-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', srcPath]);
      let metadataOutput = '';
      ffprobe.stdout.on('data', (d) => metadataOutput += d.toString());
      ffprobe.stderr.on('data', () => {});
      ffprobe.on('error', (err) => reject(new Error(`ffprobe spawn error: ${err.message}`)));
      ffprobe.on('close', (code) => {
        if (code !== 0) return reject(new Error('ffmpeg/ffprobe not available'));
        let metadata = {};
        try {
          const probe = JSON.parse(metadataOutput || '{}');
          const audioStream = (probe.streams || []).find(s => s.codec_type === 'audio') || {};
          metadata = {
            duration: parseFloat(probe.format && probe.format.duration) || 0,
            codec: audioStream.codec_name || 'unknown',
            sampleRate: parseInt(audioStream.sample_rate || 0) || 0,
            channels: parseInt(audioStream.channels || 0) || 0,
            bitrate: parseInt(probe.format && probe.format.bit_rate) || 0,
            format: probe.format && probe.format.format_name || 'unknown'
          };
        } catch (e) {
          metadata = {};
        }

        // If conversion requested (outPath different), run ffmpeg
        if (outPath && outPath !== srcPath) {
          const format = (path.extname(outPath) || '').replace('.', '') || 'mp3';
          const bitrate = '128k';
          const sampleRate = 44100;
          const codec = format === 'mp3' ? 'libmp3lame' : 'aac';
          const args = ['-i', srcPath, '-acodec', codec, '-b:a', bitrate, '-ar', String(sampleRate), '-y', outPath];
          const ffmpeg = spawn('ffmpeg', args);
          ffmpeg.on('error', (err) => reject(new Error(`ffmpeg spawn error: ${err.message}`)));
          ffmpeg.on('close', (c) => {
            if (c === 0) return resolve({ path: outPath, metadata });
            return reject(new Error(`ffmpeg conversion failed with code ${c}`));
          });
        } else {
          return resolve({ path: srcPath, metadata });
        }
      });
    });
  },

  // TODO: queue integration, virus scanning, cloud storage adapters, error handling

  async normalizeAudio(srcPath, outPath, targetLevel = -16) {
    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', ['-i', srcPath, '-af', `loudnorm=I=${targetLevel}:TP=-1.5:LRA=11`, '-ar', '44100', '-y', outPath]);
      ffmpeg.on('error', (err) => reject(new Error(`normalization spawn error: ${err.message}`)));
      ffmpeg.on('close', (code) => {
        if (code === 0) return resolve(outPath);
        return reject(new Error(`Audio normalization failed with code ${code}`));
      });
    });
  }
};

module.exports = mediaProcessingService;
