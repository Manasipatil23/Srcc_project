import React from 'react';

// Deterministic pastel palette so the same name always gets the same color.
const COLORS = [
  '#0d9488', // teal
  '#7c3aed', // violet
  '#2563eb', // blue
  '#db2777', // pink
  '#ea580c', // orange
  '#16a34a', // green
  '#4f46e5', // indigo
  '#b45309', // amber
];

export const getInitials = (name = '') => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const colorFor = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return COLORS[Math.abs(hash) % COLORS.length];
};

/**
 * Shows the user's photo if they have one, otherwise a colored circle
 * with their initials (e.g. "Omkar Dinde" -> "OD").
 */
const Avatar = ({ name = '', src = '', size = 40, style = {}, ...rest }) => {
  const dimension = { width: `${size}px`, height: `${size}px` };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ ...dimension, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, ...style }}
        {...rest}
      />
    );
  }

  return (
    <div
      aria-label={name}
      style={{
        ...dimension,
        borderRadius: '50%',
        backgroundColor: colorFor(name),
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: `${Math.round(size * 0.4)}px`,
        letterSpacing: '0.5px',
        userSelect: 'none',
        flexShrink: 0,
        ...style
      }}
      {...rest}
    >
      {getInitials(name)}
    </div>
  );
};

/**
 * Opens a file picker, downscales the chosen photo to a square JPEG data URL
 * (keeps uploads small) and resolves with it. Resolves null if cancelled.
 */
export const pickProfilePhoto = ({ maxSize = 256 } = {}) =>
  new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) return resolve(null);

      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Could not read the selected file.'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('The selected file is not a valid image.'));
        img.onload = () => {
          const side = Math.min(img.width, img.height);
          const scale = Math.min(1, maxSize / side);
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = Math.round(side * scale);
          const ctx = canvas.getContext('2d');
          // Center-crop to a square before scaling down.
          ctx.drawImage(
            img,
            (img.width - side) / 2,
            (img.height - side) / 2,
            side,
            side,
            0,
            0,
            canvas.width,
            canvas.height
          );
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  });

export default Avatar;
