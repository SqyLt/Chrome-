// 用于跟踪每个标签页的画板状态
let tabDrawingBoardStatus = {};

// 初始化时在控制台输出状态
console.log('画板扩展已加载，初始状态:', tabDrawingBoardStatus);

// 添加错误处理函数
function handleError(error) {
  console.error('画板扩展出错:', error);
}

// 监听扩展图标点击事件
chrome.action.onClicked.addListener((tab) => {
  try {
    console.log('扩展图标被点击，标签页ID:', tab.id);
    console.log('当前所有标签页状态:', JSON.stringify(tabDrawingBoardStatus));
    console.log('当前标签页状态:', tabDrawingBoardStatus[tab.id]);
    
    // 检查当前标签页的画板状态
    if (tabDrawingBoardStatus[tab.id] === 'closed' || !tabDrawingBoardStatus[tab.id]) {
      console.log('准备注入画板代码到标签页:', tab.id);
      
      // 先重置状态，防止重复注入
      delete tabDrawingBoardStatus[tab.id];
      
      // 在当前活动标签页注入html2canvas库和画板代码
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['html2canvas.min.js', 'content.js']
      }).then(() => {
        console.log('脚本注入成功到标签页:', tab.id);
        // 更新画板状态为打开
        tabDrawingBoardStatus[tab.id] = 'open';
        console.log('标签页状态已更新为:', tabDrawingBoardStatus[tab.id]);
      }).catch(error => {
        handleError(error);
        console.error('注入脚本时出错:', error);
      });
      
      // 注入样式
      chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['content.css']
      }).then(() => {
        console.log('样式注入成功到标签页:', tab.id);
      }).catch(error => {
        handleError(error);
        console.error('注入样式时出错:', error);
      });
    } else {
      console.log('画板已经打开，尝试强制重新注入。标签页ID:', tab.id, '状态:', tabDrawingBoardStatus[tab.id]);
      
      // 强制重新注入，解决可能的状态不一致问题
      console.log('强制重新注入以解决可能的状态不一致问题');
      
      // 将状态重置为关闭
      tabDrawingBoardStatus[tab.id] = 'closed';
      
      // 直接执行注入代码，而不是添加新的事件监听器
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['html2canvas.min.js', 'content.js']
      }).then(() => {
        console.log('强制重新注入脚本成功到标签页:', tab.id);
        // 更新画板状态为打开
        tabDrawingBoardStatus[tab.id] = 'open';
        console.log('标签页状态已更新为:', tabDrawingBoardStatus[tab.id]);
      }).catch(error => {
        handleError(error);
        console.error('强制重新注入脚本时出错:', error);
      });
      
      // 注入样式
      chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['content.css']
      }).then(() => {
        console.log('强制重新注入样式成功到标签页:', tab.id);
      }).catch(error => {
        handleError(error);
        console.error('强制重新注入样式时出错:', error);
      });
    }
  } catch (error) {
    handleError(error);
    console.error('处理扩展图标点击时出错:', error);
  }
});

// 监听来自content.js的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('收到消息:', message, '来自标签页:', sender.tab ? sender.tab.id : 'unknown');
  
  if (message.action === 'boardClosed' && sender.tab) {
    console.log('画板关闭消息已确认，更新标签页状态:', sender.tab.id);
    // 更新画板状态为关闭
    tabDrawingBoardStatus[sender.tab.id] = 'closed';
    console.log('标签页状态已更新为:', tabDrawingBoardStatus[sender.tab.id]);
    sendResponse({status: 'received'});
  } else {
    console.log('收到未知消息或消息格式不正确');
    sendResponse({status: 'error', message: '消息格式不正确'});
  }
  
  return true; // 保持消息通道开放以便异步响应
});

// 当标签页关闭时清理状态
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabDrawingBoardStatus[tabId]) {
    delete tabDrawingBoardStatus[tabId];
  }
});