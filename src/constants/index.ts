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
  { id: 'chase', name: '🏃 Chase', color: '#FF8C42' },
  { id: 'fire', name: '🔥 Fire', color: '#FF4757' },
  { id: 'comet', name: '☄️ Comet', color: '#5F27CD' },
  { id: 'twinkle', name: '⭐ Twinkle', color: '#00D2D3' },
  { id: 'scanner', name: '👁️ Scanner', color: '#FF3838' },
  { id: 'pulse', name: '💓 Pulse Wave', color: '#FF6B9D' },
  { id: 'meteor', name: '🌌 Meteor Rain', color: '#A55EEA' },
  { id: 'theater', name: '🎭 Theater Chase', color: '#26C281' },
  { id: 'plasma', name: '🌊 Plasma Wave', color: '#4834D4' },
  { id: 'gradient', name: '🌈 Color Gradient', color: '#FF9F43' },
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