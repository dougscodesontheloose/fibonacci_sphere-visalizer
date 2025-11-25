export interface SphereConfig {
  points: number;
  radius: number;
  pointSize: number;
  rotationSpeed: number;
  showLines: boolean;
  colorScheme: 'golden' | 'rainbow' | 'cyber';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const DEFAULT_CONFIG: SphereConfig = {
  points: 1000,
  radius: 15,
  pointSize: 0.15,
  rotationSpeed: 0.2,
  showLines: false,
  colorScheme: 'golden',
};
