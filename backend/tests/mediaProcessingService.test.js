const proxyquire = require('proxyquire');
const sinon = require('sinon');
const assert = require('assert');
const { EventEmitter } = require('events');

describe('mediaProcessingService', () => {
  it('generateImageVariants returns empty when sharp not available', async () => {
    const mediaService = proxyquire('../services/mediaProcessingService', { 'sharp': null });
    const out = await mediaService.generateImageVariants('asset-1', '/tmp/nonexistent.jpg', '/tmp');
    assert.deepStrictEqual(out, []);
  });

  it('processAudio resolves with metadata and conversion when ffprobe/ffmpeg succeed (mocked)', async () => {
    // mock child_process.spawn to simulate ffprobe then ffmpeg
    const fakeSpawn = function (cmd, args) {
      const emitter = new EventEmitter();
      emitter.stdout = new EventEmitter();
      emitter.stderr = new EventEmitter();
      // if ffprobe call (args contain -show_format)
      if (args && args.indexOf('-show_format') !== -1) {
        // simulate stdout data and close
        process.nextTick(() => {
          const probeJson = JSON.stringify({ format: { duration: '3.5', bit_rate: '64000', format_name: 'mp3' }, streams: [{ codec_type: 'audio', codec_name: 'mp3', sample_rate: '44100', channels: 2 }] });
          emitter.stdout.emit('data', Buffer.from(probeJson));
          emitter.emit('close', 0);
        });
        return emitter;
      }
      // ffmpeg conversion call
      process.nextTick(() => emitter.emit('close', 0));
      return emitter;
    };

    const mediaService = proxyquire('../services/mediaProcessingService', { child_process: { spawn: fakeSpawn } });
    const result = await mediaService.processAudio('/fake/in.mp3', '/fake/out.mp3');
    assert.strictEqual(result.path, '/fake/out.mp3');
    assert.ok(result.metadata.duration >= 3);
    assert.strictEqual(result.metadata.format, 'mp3');
  });
});
