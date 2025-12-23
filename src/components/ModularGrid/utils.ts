const hues = [200, 210, 220, 260, 280, 330, 160];

export const generateColor = (): string => {
  const hue = hues[Math.floor(Math.random() * hues.length)];
  return `hsla(${hue}, 70%, 85%, 1)`;
};

export const generateId = (): string => Math.random().toString(36).slice(2, 11);
