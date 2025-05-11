// game.js

let lockSequence = [];  // 随机锁的顺序
let userSequence = [];  // 用户输入的顺序
let lockButtons = [];   // 锁的按钮集合
let isGameActive = false; // 游戏是否进行中

// 获取元素
const startButton = document.getElementById('start-btn');
const lockContainer = document.getElementById('lock');
const statusText = document.getElementById('status');

// 生成5个锁的槽位
function createLock() {
  lockButtons = [];
  lockContainer.innerHTML = ''; // 清空容器

  for (let i = 0; i < 5; i++) {
    let button = document.createElement('button');
    button.classList.add('lock-button');
    button.dataset.slot = i; // 给每个按钮一个唯一的槽位数据
    button.addEventListener('click', handleSlotClick);
    lockContainer.appendChild(button);
    lockButtons.push(button);
  }
}

// 生成随机的解锁顺序
function generateRandomSequence() {
  lockSequence = [];
  for (let i = 0; i < 5; i++) {
    let randomSlot = Math.floor(Math.random() * 5);  // 随机生成0-4的数字
    while(lockSequence.includes(randomSlot)){
        randomSlot = Math.floor(Math.random() * 5); // 确保不重复
    }
    lockSequence.push(randomSlot);
  }
  console.log('随机顺序:', lockSequence); // 可以用来调试
}

// 游戏开始函数
function startGame() {
  isGameActive = true;
  userSequence = [];
  statusText.textContent = '开始解锁！';
  startButton.disabled = true;
  createLock();
  generateRandomSequence();
}

// 处理玩家点击槽位的逻辑
function handleSlotClick(event) {
  if (!isGameActive) return;

  const clickedSlot = parseInt(event.target.dataset.slot);
  userSequence.push(clickedSlot);
  event.target.classList.add('active');

  // 检查用户的顺序是否正确
  if (userSequence[userSequence.length - 1] !== lockSequence[userSequence.length - 1]) {
    // 如果点击错误，复位游戏
    statusText.textContent = '顺序错误，重新开始！';
    resetGame();
    return;
  }

  // 如果用户顺序完成
  if (userSequence.length === lockSequence.length) {
    statusText.textContent = '解锁成功！';
    goToSuccessPage();
    markCorrectSequence();
    isGameActive = false;
    startButton.disabled = false;
    let cmd = 'tellraw @a "1"';
    queryMinecraftCommand(cmd)
        window.cefQuery({
        request:"closeGUI",
        persistent:false
    })
  }
}

//调用 Minecraft指令
function queryMinecraftCommand(str) {
  window.cefQuery({
    "request": "command:" + str,
    "persistent": false
  });
}

// 标记正确的顺序
function markCorrectSequence() {
  lockSequence.forEach((slot, index) => {
    lockButtons[slot].classList.add('correct');
  });
}

// 重置游戏
function resetGame() {
  lockButtons.forEach(button => button.classList.remove('active'));
  //lockSequence = [];
  userSequence = [];
  //isGameActive = false;
  //startButton.disabled = false;
}

// 显示解锁成功后的自定义消息
function goToSuccessPage() {
  // 将自定义成功信息存储到 localStorage
  localStorage.setItem('successMessage', '宝贝真厉害！'); // 设置你想要显示的消息
  // 跳转到 success.html 页面
  window.location.href = 'success.html';
}

startButton.addEventListener('click', startGame);
