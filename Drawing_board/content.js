// 检查画板是否已经存在，防止重复创建
if (document.querySelector('.drawing-board-container')) {
  document.querySelector('.drawing-board-container').remove();
}

// 创建画板容器
const boardContainer = document.createElement('div');
boardContainer.className = 'drawing-board-container';

// 创建画板
const canvas = document.createElement('canvas');
canvas.className = 'drawing-board';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
boardContainer.appendChild(canvas);
document.body.appendChild(boardContainer);

// 创建控制面板
const controls = document.createElement('div');
controls.className = 'drawing-controls';

// 创建控制面板的标题栏
const controlsHeader = document.createElement('div');
controlsHeader.className = 'controls-header';

// 添加标题
const controlsTitle = document.createElement('div');
controlsTitle.className = 'controls-title';
controlsTitle.textContent = '画板工具';
controlsHeader.appendChild(controlsTitle);

// 添加最小化按钮
const minimizeBtn = document.createElement('button');
minimizeBtn.className = 'minimize-btn';
minimizeBtn.innerHTML = '&#8722;'; // 减号符号
minimizeBtn.title = '缩小面板';
controlsHeader.appendChild(minimizeBtn);

// 将标题栏添加到控制面板
controls.appendChild(controlsHeader);

// 创建控制面板的内容区域
const controlsContent = document.createElement('div');
controlsContent.className = 'controls-content';
controls.appendChild(controlsContent);

// 颜色选择器
const colorPicker = document.createElement('div');
colorPicker.className = 'color-picker';
const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
colors.forEach((color, index) => {
  const colorOption = document.createElement('div');
  colorOption.className = 'color-option' + (index === 0 ? ' active' : '');
  colorOption.style.backgroundColor = color;
  colorOption.dataset.color = color;
  colorPicker.appendChild(colorOption);
});
controlsContent.appendChild(colorPicker);

// 添加绘画模式选择器
const modeSelector = document.createElement('div');
modeSelector.className = 'mode-selector';

// 画笔模式
const penMode = document.createElement('button');
penMode.className = 'mode-btn pen-mode active';
penMode.textContent = '画笔';
penMode.dataset.mode = 'pen';
modeSelector.appendChild(penMode);

// 橡皮擦模式
const eraserMode = document.createElement('button');
eraserMode.className = 'mode-btn eraser-mode';
eraserMode.textContent = '橡皮擦';
eraserMode.dataset.mode = 'eraser';
modeSelector.appendChild(eraserMode);

controlsContent.appendChild(modeSelector);

// 笔触大小滑块
const sizeLabel = document.createElement('label');
sizeLabel.textContent = '笔触大小: ';
controlsContent.appendChild(sizeLabel);

const sizeSlider = document.createElement('input');
sizeSlider.type = 'range';
sizeSlider.min = '1';
sizeSlider.max = '20';
sizeSlider.value = '5';
sizeSlider.className = 'size-slider';
controlsContent.appendChild(sizeSlider);

// 绘制功能实现
let isDrawing = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mouseout', endDrawing);

function startDrawing(e) {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
  if (!isDrawing) return;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.strokeStyle = document.querySelector('.color-option.active').dataset.color;
  ctx.lineWidth = sizeSlider.value;
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function endDrawing() {
  isDrawing = false;
}

// 点击颜色选择
colorPicker.querySelectorAll('.color-option').forEach(option => {
  option.addEventListener('click', function() {
    colorPicker.querySelector('.active').classList.remove('active');
    this.classList.add('active');
  });
});

// 清除按钮
const clearBtn = document.createElement('button');
clearBtn.className = 'clear-btn';
clearBtn.textContent = '清除画板';
controlsContent.appendChild(clearBtn);

// 完成按钮
const completeBtn = document.createElement('button');
completeBtn.className = 'complete-btn';
completeBtn.textContent = '生成截图';
controlsContent.appendChild(completeBtn);

// 关闭按钮
const closeBtn = document.createElement('button');
closeBtn.className = 'close-btn';
closeBtn.textContent = '关闭画板';
controlsContent.appendChild(closeBtn);

// 将控制面板添加到容器
boardContainer.appendChild(controls);

// 将画板容器添加到文档
document.body.appendChild(boardContainer);

// 设置画布大小
const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 绘图上下文复用已声明的变量
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 5;
ctx.strokeStyle = '#000000';



// 绘图事件
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

// 添加触摸事件支持
canvas.addEventListener('touchstart', (e) => {
  // 阻止触摸时页面滚动
  e.preventDefault();
  
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const offsetX = touch.clientX - rect.left;
  const offsetY = touch.clientY - rect.top;
  
  isDrawing = true;
  [lastX, lastY] = [offsetX, offsetY];
});

canvas.addEventListener('touchmove', (e) => {
  // 阻止触摸时页面滚动
  e.preventDefault();
  
  if (!isDrawing) return;
  
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const offsetX = touch.clientX - rect.left;
  const offsetY = touch.clientY - rect.top;
  
  if (currentMode === 'pen') {
    // 画笔模式
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  } else if (currentMode === 'eraser') {
    // 橡皮擦模式
    const eraserSize = parseInt(sizeSlider.value) * 2; // 橡皮擦尺寸为笔触的两倍
    ctx.save();
    ctx.beginPath();
    ctx.arc(offsetX, offsetY, eraserSize, 0, Math.PI * 2, false);
    ctx.clip();
    ctx.clearRect(offsetX - eraserSize, offsetY - eraserSize, eraserSize * 2, eraserSize * 2);
    ctx.restore();
  }
  
  [lastX, lastY] = [offsetX, offsetY];
});

canvas.addEventListener('touchend', () => isDrawing = false);
canvas.addEventListener('touchcancel', () => isDrawing = false);

// 当前绘图模式
let currentMode = 'pen';

// 绘图函数
function draw(e) {
  if (!isDrawing) return;
  
  if (currentMode === 'pen') {
    // 画笔模式
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (currentMode === 'eraser') {
    // 橡皮擦模式 - 使用destination-out合成操作擦除
    const eraserSize = parseInt(sizeSlider.value) * 2; // 橡皮擦尺寸为笔触的两倍
    ctx.save();
    ctx.beginPath();
    ctx.arc(e.offsetX, e.offsetY, eraserSize, 0, Math.PI * 2, false);
    ctx.clip();
    ctx.clearRect(e.offsetX - eraserSize, e.offsetY - eraserSize, eraserSize * 2, eraserSize * 2);
    ctx.restore();
  }
  
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

// 颜色选择
colorPicker.addEventListener('click', (e) => {
  if (e.target.classList.contains('color-option')) {
    // 移除所有活动状态
    document.querySelectorAll('.color-option').forEach(option => {
      option.classList.remove('active');
    });
    // 设置当前选中状态
    e.target.classList.add('active');
    ctx.strokeStyle = e.target.dataset.color;
    
    // 如果在橡皮擦模式下选择颜色，自动切换到画笔模式
    if (currentMode === 'eraser') {
      currentMode = 'pen';
      document.querySelector('.eraser-mode').classList.remove('active');
      document.querySelector('.pen-mode').classList.add('active');
    }
  }
});

// 模式切换
modeSelector.addEventListener('click', (e) => {
  if (e.target.classList.contains('mode-btn')) {
    // 移除所有活动状态
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    // 设置当前选中状态
    e.target.classList.add('active');
    currentMode = e.target.dataset.mode;
    
    // 更新鼠标指针样式
    if (currentMode === 'eraser') {
      canvas.style.cursor = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'10\' fill=\'rgba(255,255,255,0.5)\' stroke=\'%23000\' stroke-width=\'1\' /%3E%3C/svg%3E") 12 12, auto';
    } else {
      canvas.style.cursor = 'crosshair';
    }
  }
});

// 笔触大小调整
sizeSlider.addEventListener('input', () => {
  ctx.lineWidth = sizeSlider.value;
});

// 清除画板
clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// 关闭画板
closeBtn.addEventListener('click', () => {
  console.log('关闭按钮被点击');
  
  // 发送消息给background.js，通知画板已关闭
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      console.log('尝试发送画板关闭消息');
      chrome.runtime.sendMessage({action: 'boardClosed'}, response => {
        console.log('画板关闭消息已发送，收到响应:', response);
        // 确保在收到响应后再移除画板
        boardContainer.remove();
        console.log('画板已移除');
      });
    } else {
      console.error('chrome.runtime.sendMessage 不可用');
      // 如果消息发送API不可用，仍然移除画板
      boardContainer.remove();
      console.log('画板已移除（无法发送消息）');
    }
  } catch (error) {
    console.error('发送消息时出错:', error);
    // 出错时仍然移除画板
    boardContainer.remove();
    console.log('画板已移除（发送消息出错）');
  }
});

// 最小化/展开面板
let isPanelMinimized = false;
minimizeBtn.addEventListener('click', () => {
  if (isPanelMinimized) {
    // 展开面板
    controlsContent.style.display = 'flex';
    minimizeBtn.innerHTML = '&#8722;'; // 减号符号
    minimizeBtn.title = '缩小面板';
    isPanelMinimized = false;
  } else {
    // 缩小面板
    controlsContent.style.display = 'none';
    minimizeBtn.innerHTML = '&#43;'; // 加号符号
    minimizeBtn.title = '展开面板';
    isPanelMinimized = true;
  }
});

// 生成截图
completeBtn.addEventListener('click', async () => {
  // 首先检查html2canvas是否可用
  if (typeof html2canvas === 'undefined') {
    alert('截图功能需要html2canvas库支持，但该库未加载。请刷新页面后重试。');
    return;
  }
  
  try {
    // 显示加载提示
    const loadingMsg = document.createElement('div');
    loadingMsg.style.position = 'fixed';
    loadingMsg.style.top = '50%';
    loadingMsg.style.left = '50%';
    loadingMsg.style.transform = 'translate(-50%, -50%)';
    loadingMsg.style.padding = '20px';
    loadingMsg.style.background = 'rgba(0, 0, 0, 0.7)';
    loadingMsg.style.color = 'white';
    loadingMsg.style.borderRadius = '5px';
    loadingMsg.style.zIndex = '10001';
    loadingMsg.id = 'drawing-board-loading-msg'; // 添加ID以便后续操作
    loadingMsg.textContent = '正在生成截图，请稍候...';
    document.body.appendChild(loadingMsg);
    
    // 首先隐藏控制面板以避免其出现在截图中
    controls.style.display = 'none';
    
    // 暂时存储画板内容
    const drawingCanvas = document.createElement('canvas');
    drawingCanvas.width = canvas.width;
    drawingCanvas.height = canvas.height;
    const drawingCtx = drawingCanvas.getContext('2d');
    drawingCtx.drawImage(canvas, 0, 0);
    
    // 暂时隐藏画板以便捕获原始网页
    canvas.style.display = 'none';
    
    // 等待一小段时间以确保UI已更新
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // 计算当前可见区域
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    
    console.log(`开始捕获可见区域: ${viewportWidth}x${viewportHeight}, 滚动位置: ${scrollX},${scrollY}`);
    
    // 暂时隐藏加载提示，避免其出现在截图中
    const loadingMsgElement = document.getElementById('drawing-board-loading-msg');
    if (loadingMsgElement) {
      loadingMsgElement.style.display = 'none';
    }
    
    // 只捕获当前可见区域
    const pageScreenshot = await html2canvas(document.documentElement, {
      useCORS: true,
      scale: window.devicePixelRatio,
      allowTaint: true,
      logging: true, // 启用日志以便调试
      backgroundColor: null,
      x: scrollX,
      y: scrollY,
      width: viewportWidth,
      height: viewportHeight,
      windowWidth: viewportWidth,
      windowHeight: viewportHeight
    });
    
    // 恢复显示加载提示
    if (loadingMsgElement) {
      loadingMsgElement.style.display = 'block';
    }
    console.log('可见区域捕获完成');
    
    // 重新显示画板
    canvas.style.display = 'block';
    
    // 创建最终图像
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = pageScreenshot.width;
    finalCanvas.height = pageScreenshot.height;
    const finalCtx = finalCanvas.getContext('2d');
    
    // 绘制网页截图作为背景
    finalCtx.drawImage(pageScreenshot, 0, 0);
    
    // 计算画板内容在可见区域内的部分
    const sourceX = scrollX;
    const sourceY = scrollY;
    const sourceWidth = viewportWidth;
    const sourceHeight = viewportHeight;
    
    // 绘制用户绘画内容（只绘制可见区域）
    finalCtx.drawImage(
      drawingCanvas, 
      sourceX, sourceY, sourceWidth, sourceHeight, // 源图像的剪切区域
      0, 0, finalCanvas.width, finalCanvas.height  // 目标画布的绘制区域
    );
    
    // 转换为图片并下载
    console.log('生成图片数据...');
    const dataURL = finalCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `网页画板截图_${new Date().getTime()}.png`;
    a.click();
    console.log('图片下载链接已创建');
    
    // 移除加载提示
    document.body.removeChild(loadingMsg);
    
    // 恢复控制面板显示
    controls.style.display = 'flex';
  } catch (error) {
    console.error('截图过程中出错:', error);
    alert(`截图生成失败: ${error.message}\n请检查控制台以获取更多信息。`);
    // 确保控制面板恢复显示
    controls.style.display = 'flex';
    // 移除可能存在的加载提示
    const loadingMsg = document.querySelector('div[style*="zIndex: 10001"]');
    if (loadingMsg) {
      document.body.removeChild(loadingMsg);
    }
  }
});

// 检查html2canvas是否已加载
if (typeof html2canvas === 'undefined') {
  console.error('html2canvas库未加载，无法生成截图');
  alert('截图功能需要html2canvas库支持，请确保扩展正确安装');
}