export enum BeadType {
  TULSI = 'TULSI',
  RUDRAKSHA = 'RUDRAKSHA',
  SPHATIK = 'SPHATIK',
  HALDI = 'HALDI',
  CHANDAN = 'CHANDAN',
  KAMAL_GATTA = 'KAMAL_GATTA',
  RED_SANDALWOOD = 'RED_SANDALWOOD'
}

export interface BeadConfig {
  type: BeadType;
  name: string;
  description: string;
  color: string;
  textColor: string;
  shadowColor: string;
  textureClass: string; // Tailwind class or custom css for texture
}

export interface Settings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  vibrationDuration: number;
  targetCount: number; // Usually 108
}