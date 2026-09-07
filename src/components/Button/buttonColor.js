export function normalizeColor(value) {
  if (typeof value !== 'string') return null;
  const hex = value.trim();
  if (/^#[\da-f]{6}$/i.test(hex)) return hex.toLowerCase();
  if (/^#[\da-f]{3}$/i.test(hex)) return '#' + [...hex.slice(1)].map(c => c + c).join('').toLowerCase();
  return null;
}

const mix = (rgb, target, amount) => rgb.map(channel => Math.round(channel + (target - channel) * amount));
const hex = rgb => '#' + rgb.map(channel => channel.toString(16).padStart(2, '0')).join('');
export function luminance(rgb) {
  const linear = rgb.map(channel => { const s = channel / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

export function buttonColorStyle(value) {
  const color = normalizeColor(value);
  if (!color) return undefined;
  const rgb = color.slice(1).match(/../g).map(channel => parseInt(channel, 16));
  const lightText = luminance(rgb) < 0.179;
  let ink = rgb;
  // Darken the same hue until it reads clearly on white and pale tinted surfaces.
  while (luminance(ink) > 0.12) ink = mix(ink, 0, 0.1);
  return {
    '--custom-face': color,
    '--custom-text': lightText ? '#ffffff' : '#000000',
    '--custom-edge': hex(mix(rgb, 0, 0.48)),
    '--custom-hover': hex(mix(rgb, lightText ? 0 : 255, 0.12)),
    '--custom-ink': hex(ink),
    '--custom-tint': hex(mix(rgb, 255, 0.92)),
  };
}
