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
  { id: 'aurora', name: '🌌 Aurora Borealis', color: '#00FFA1' },
  { id: 'ripple', name: '💧 Ripple Effect', color: '#36D1DC' },
  { id: 'sine', name: '〰️ Sine Wave', color: '#667eea' },
  { id: 'spiral', name: '🌀 Spiral Flow', color: '#f093fb' },
  { id: 'kaleidoscope', name: '🔮 Kaleidoscope', color: '#fad0c4' },
  { id: 'ocean', name: '🌊 Ocean Depths', color: '#209cff' },
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

export const COLOR_PALETTES = [
  { id: 0, name: '🏞️ Landscape', description: 'Earth tones and natural greens', colors: ['#000000', '#4FD501', '#7ED32F', '#0125C0'] },
  { id: 1, name: '🌊 Ocean', description: 'Deep blues and ocean waves', colors: ['#010607', '#01636F', '#90D1FF', '#004952'] },
  { id: 2, name: '🌅 Sunset', description: 'Warm sunset colors', colors: ['#780000', '#FF6800', '#640067', '#200020'] },
  { id: 3, name: '🍂 Autumn', description: 'Fall leaves and warm browns', colors: ['#1A0101', '#430401', '#760E01', '#899834'] },
  { id: 4, name: '🔥 Fire', description: 'Hot flames and embers', colors: ['#000000', '#CC0000', '#FF6600', '#FFFF00'] },
  { id: 5, name: '❄️ Ice', description: 'Cool blues and whites', colors: ['#000033', '#0099CC', '#99FFFF', '#FFFFFF'] },
  { id: 6, name: '💫 Neon', description: 'Bright electric colors', colors: ['#FF00FF', '#FF0000', '#00FF00', '#00FFFF'] },
];