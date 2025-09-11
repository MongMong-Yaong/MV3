const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 970,
    icon: path.join(__dirname, 'src', 'icon.ico'),
    minWidth: 666,
    minHeight: 750,
    show: false, // 처음엔 안 보여줌 → 깜빡임 방지
    backgroundColor: '#172128', // 배경 색 (rgb 23,33,40)
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.setBounds({ width: 1000, height: 970 });
  win.setMenu(null); // 메뉴바 제거

  // HTML 파일 경로 지정 (빌드 후에도 동작)
  win.loadFile(path.join(__dirname, 'index.html'));

  // 콘텐츠 준비된 후 창 표시
  win.once('ready-to-show', () => {
    win.show();
  });
}

// 앱 준비되면 창 생성
app.whenReady().then(createWindow);

// 모든 창 닫혔을 때 동작
app.on('window-all-closed', () => {
  // macOS는 윈도우 닫아도 앱이 종료되지 않음
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// macOS 전용: Dock에서 클릭 시 새 창 생성
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
