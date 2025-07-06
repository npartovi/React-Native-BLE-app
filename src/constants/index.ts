import { Animation, ColorOption } from '../types';

export const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
export const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

export const ANIMATIONS: Animation[] = [
  { id: 'rainbow', name: '🌈 Rainbow', color: '#FF6B6B' },
  { id: 'pride', name: '🌀 Rolling Rainbow Balls', color: '#FF1493' },
  { id: 'fade', name: '✨ Fade', color: '#4ECDC4' },
  { id: 'strobe', name: '⚡ Strobe', color: '#45B7D1' },
  { id: 'wave', name: '🌊 Wave', color: '#96CEB4' },
  { id: 'sparkle', name: '💫 Sparkle', color: '#FFEAA7' },
  { id: 'breathe', name: '💨 Breathe', color: '#DDA0DD' },
];

export const COLOR_OPTIONS: ColorOption[] = [
  { color: '#FF0000', name: 'Red' },
  { color: '#00FF00', name: 'Green' },
  { color: '#0000FF', name: 'Blue' },
  { color: '#FFFF00', name: 'Yellow' },
  { color: '#FF00FF', name: 'Magenta' },
  { color: '#00FFFF', name: 'Cyan' },
  { color: '#FFFFFF', name: 'White' },
  { color: '#FF8000', name: 'Orange' },
];

export const RAINBOW_ANIMATIONS = ['rainbow', 'pride'];