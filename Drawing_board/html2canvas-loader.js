// html2canvas库加载器
// 注意：在Chrome扩展中，不能从外部加载脚本
// 需要将html2canvas.min.js作为扩展的一部分
// 并在manifest.json中正确配置

(() => {
  // 检查是否已经加载
  if (typeof window.html2canvas === 'undefined') {
    console.log('html2canvas库未加载');
    // 在Chrome扩展中，我们需要在manifest.json中配置web_accessible_resources
    // 并使用chrome.runtime.getURL获取本地资源URL
    // 这里我们假设html2canvas.min.js已经作为扩展的一部分
    console.log('请确保在manifest.json中正确配置html2canvas.min.js');
  } else {
    console.log('html2canvas库已加载');
  }
})();