const { createCanvas, Image } = require('canvas');

export const cropImage = async (image) => {
  const smallestDimension = Math.min(image.width, image.height);
  const startX = (image.width - smallestDimension) / 2;
  const startY = (image.height - smallestDimension) / 2;

  const canvas = createCanvas(smallestDimension, smallestDimension);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    startX,
    startY,
    smallestDimension,
    smallestDimension,
    0,
    0,
    smallestDimension,
    smallestDimension
  );

  // Return the result as a data URL
  return canvas.toDataURL();
}