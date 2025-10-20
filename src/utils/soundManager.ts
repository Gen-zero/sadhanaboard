// Sound manager for cosmic admin panel
class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: { [key: string]: AudioBuffer } = {};
  private isEnabled: boolean = true;
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.loadSounds();
    }
  }
  
  private async loadSounds() {
    if (!this.audioContext) return;
    
    try {
      // In a real implementation, we would load actual sound files
      // For now, we'll create synthetic sounds
      console.log('Sound system initialized');
    } catch (error) {
      console.warn('Failed to load sounds:', error);
    }
  }
  
  // Toggle sound on/off
  toggleSound() {
    this.isEnabled = !this.isEnabled;
  }
  
  // Play a gentle temple bell sound for success
  playSuccessSound() {
    if (!this.audioContext || !this.isEnabled) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
      oscillator.frequency.exponentialRampToValueAtTime(659.25, this.audioContext.currentTime + 0.5); // E5
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.5);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 1.5);
    } catch (error) {
      console.warn('Failed to play success sound:', error);
    }
  }
  
  // Play a gentle tanpura drone for info
  playInfoSound() {
    if (!this.audioContext || !this.isEnabled) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(110, this.audioContext.currentTime); // A2
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2.0);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 2.0);
    } catch (error) {
      console.warn('Failed to play info sound:', error);
    }
  }
  
  // Play a deep gong for errors
  playErrorSound() {
    if (!this.audioContext || !this.isEnabled) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(65.41, this.audioContext.currentTime); // C2
      oscillator.frequency.exponentialRampToValueAtTime(32.70, this.audioContext.currentTime + 0.5); // C1
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.0);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 1.0);
    } catch (error) {
      console.warn('Failed to play error sound:', error);
    }
  }
  
  // Play a cosmic whoosh for navigation
  playNavigationSound() {
    if (!this.audioContext || !this.isEnabled) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime); // A5
      oscillator.frequency.exponentialRampToValueAtTime(440, this.audioContext.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn('Failed to play navigation sound:', error);
    }
  }
  
  // Play a shimmer sound for hover effects
  playHoverSound() {
    if (!this.audioContext || !this.isEnabled) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1760, this.audioContext.currentTime); // A6
      oscillator.frequency.exponentialRampToValueAtTime(2217.46, this.audioContext.currentTime + 0.2); // C#7
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);
    } catch (error) {
      console.warn('Failed to play hover sound:', error);
    }
  }
  
  // Play a click sound
  playClickSound() {
    if (!this.audioContext || !this.isEnabled) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // A4
      oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.1);
    } catch (error) {
      console.warn('Failed to play click sound:', error);
    }
  }
}

// Create a singleton instance
const soundManager = new SoundManager();

export default soundManager;