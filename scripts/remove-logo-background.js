import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function processLogo() {
  const dir = path.join(process.cwd(), 'src', 'pictures');
  
  // Look for uploaded logo file
  const files = fs.readdirSync(dir);
  const logoFile = files.find(f => f.toLowerCase().includes('billy') || f.toLowerCase().includes('logo'));
  
  if (!logoFile) {
    console.error('No logo file found in src/pictures/');
    return;
  }

  const inputPath = path.join(dir, logoFile);
  const outputPath = path.join(dir, 'dubgan-logo.png');

  console.log(`Processing image: ${inputPath}`);

  // Load image with raw RGBA pixel data
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`Image dimensions: ${width}x${height}, channels: ${channels}`);

  // Sample corner pixel colors to detect white / near-white background
  const corners = [
    0, // top-left
    (width - 1) * channels, // top-right
    (height - 1) * width * channels, // bottom-left
    ((height - 1) * width + (width - 1)) * channels // bottom-right
  ];

  console.log('Sample corner pixels (RGBA):');
  corners.forEach(idx => {
    console.log(`[${data[idx]}, ${data[idx+1]}, ${data[idx+2]}, ${data[idx+3]}]`);
  });

  // Flood fill algorithm to remove outer white/near-white background
  // Keeping internal light colors intact!
  const isWhiteBackground = (r, g, b) => {
    // Check if pixel is white or near-white (luminance or high RGB)
    return r >= 232 && g >= 232 && b >= 232;
  };

  const visited = new Uint8Array(width * height);
  const isOuterBg = new Uint8Array(width * height);
  const queue = [];

  // Seed flood fill with all border pixels if they match background color
  for (let x = 0; x < width; x++) {
    // top row
    let idxTop = x;
    let pTop = idxTop * 4;
    if (isWhiteBackground(data[pTop], data[pTop+1], data[pTop+2])) {
      queue.push(idxTop);
      visited[idxTop] = 1;
      isOuterBg[idxTop] = 1;
    }
    // bottom row
    let idxBot = (height - 1) * width + x;
    let pBot = idxBot * 4;
    if (isWhiteBackground(data[pBot], data[pBot+1], data[pBot+2])) {
      queue.push(idxBot);
      visited[idxBot] = 1;
      isOuterBg[idxBot] = 1;
    }
  }

  for (let y = 0; y < height; y++) {
    // left column
    let idxLeft = y * width;
    let pLeft = idxLeft * 4;
    if (!visited[idxLeft] && isWhiteBackground(data[pLeft], data[pLeft+1], data[pLeft+2])) {
      queue.push(idxLeft);
      visited[idxLeft] = 1;
      isOuterBg[idxLeft] = 1;
    }
    // right column
    let idxRight = y * width + (width - 1);
    let pRight = idxRight * 4;
    if (!visited[idxRight] && isWhiteBackground(data[pRight], data[pRight+1], data[pRight+2])) {
      queue.push(idxRight);
      visited[idxRight] = 1;
      isOuterBg[idxRight] = 1;
    }
  }

  // BFS Flood Fill
  let head = 0;
  while (head < queue.length) {
    const current = queue[head++];
    const cx = current % width;
    const cy = Math.floor(current / width);

    // Neighbors (4-directional)
    const neighbors = [
      cx > 0 ? current - 1 : -1,
      cx < width - 1 ? current + 1 : -1,
      cy > 0 ? current - width : -1,
      cy < height - 1 ? current + width : -1,
    ];

    for (const n of neighbors) {
      if (n >= 0 && !visited[n]) {
        visited[n] = 1;
        const np = n * 4;
        if (isWhiteBackground(data[np], data[np+1], data[np+2])) {
          isOuterBg[n] = 1;
          queue.push(n);
        }
      }
    }
  }

  // Apply transparency to outer background pixels
  let minX = width, minY = height, maxX = 0, maxY = 0;
  let transparentPixelsCount = 0;

  for (let i = 0; i < width * height; i++) {
    const p = i * 4;
    if (isOuterBg[i]) {
      data[p + 3] = 0; // Alpha = 0 (Transparent)
      transparentPixelsCount++;
    } else {
      // Bounding box calculation
      const x = i % width;
      const y = Math.floor(i / width);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  console.log(`Made ${transparentPixelsCount} pixels transparent.`);
  console.log(`Non-transparent bounding box: X [${minX}, ${maxX}], Y [${minY}, ${maxY}]`);

  // Add 4px padding around bounding box
  const padding = 4;
  const cropX = Math.max(0, minX - padding);
  const cropY = Math.max(0, minY - padding);
  const cropW = Math.min(width - cropX, (maxX - minX + 1) + padding * 2);
  const cropH = Math.min(height - cropY, (maxY - minY + 1) + padding * 2);

  console.log(`Cropping to [left: ${cropX}, top: ${cropY}, width: ${cropW}, height: ${cropH}]`);

  // Create sharp image from modified raw buffer and crop
  await sharp(data, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
    .extract({
      left: cropX,
      top: cropY,
      width: cropW,
      height: cropH
    })
    .png()
    .toFile(outputPath);

  console.log(`Successfully saved transparent cropped logo to ${outputPath}`);
}

processLogo().catch(err => {
  console.error('Error processing logo background:', err);
});
