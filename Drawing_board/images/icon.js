// 这个脚本可以在浏览器控制台中执行，生成并下载PNG图标

function createIcon(size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // 背景
  ctx.fillStyle = '#4285f4';
  ctx.fillRect(0, 0, size, size);
  
  // 画板
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillRect(size * 0.15, size * 0.15, size * 0.7, size * 0.7);
  
  // 画笔
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(size * 0.3, size * 0.3);
  ctx.lineTo(size * 0.6, size * 0.6);
  ctx.lineTo(size * 0.3, size * 0.6);
  ctx.closePath();
  ctx.fill();
  
  // 边框
  ctx.strokeStyle = '#3367d6';
  ctx.lineWidth = size * 0.05;
  ctx.strokeRect(0, 0, size, size);
  
  return canvas.toDataURL('image/png');
}

function downloadIcon(size) {
  const dataURL = createIcon(size);
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = `icon${size}.png`;
  a.click();
}

// 生成并下载所有尺寸的图标
function generateAllIcons() {
  downloadIcon(16);
  downloadIcon(48);
  downloadIcon(128);
}

// 注意：这个函数需要在浏览器环境中执行
// 在控制台中执行 generateAllIcons() 将会下载所有图标 