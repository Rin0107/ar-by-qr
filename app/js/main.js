import ARHandler from './ar-handler.js';
import '../css/style.css';

document.addEventListener('DOMContentLoaded', () => {
  // 要素の取得
  const startupScreen = document.getElementById('startup-screen');
  const arScreen = document.getElementById('ar-screen');
  const startButton = document.getElementById('start-button');
  const loadingIndicator = document.getElementById('loading');
  const errorMessage = document.getElementById('error-message');
  const scanningOverlay = document.getElementById('scanning-overlay');

  // ARハンドラーのインスタンス化
  const arHandler = new ARHandler({
    container: document.getElementById('ar-container'),
    imageFile: 'assets/images/display.png',
    markerFile: 'assets/markers/marker.png',
    onMarkerFound: () => {
      // マーカー認識時の処理
      scanningOverlay.classList.add('hidden');
    },
    onMarkerLost: () => {
      // マーカーロスト時の処理
      scanningOverlay.classList.remove('hidden');
    },
    onError: (error) => {
      // エラー発生時の処理
      showError(`エラーが発生しました: ${error.message}`);
      arScreen.classList.add('hidden');
      startupScreen.classList.remove('hidden');
    }
  });

  // 開始ボタンのイベントリスナー
  startButton.addEventListener('click', async () => {
    try {
      // ローディング表示
      startButton.disabled = true;
      loadingIndicator.classList.remove('hidden');
      errorMessage.classList.add('hidden');

      // AR初期化
      await arHandler.initialize();

      // 画面切り替え
      startupScreen.classList.add('hidden');
      arScreen.classList.remove('hidden');

      // AR開始
      await arHandler.start();
    } catch (error) {
      showError(`ARの起動に失敗しました: ${error.message}`);
      console.log('Error occurred:', error.message);
      startButton.disabled = false;
      loadingIndicator.classList.add('hidden');
    }
  });

  // エラーメッセージ表示関数
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    loadingIndicator.classList.add('hidden');
  }

  // ブラウザ対応チェック
  if (!ARHandler.isSupported()) {
    showError('お使いのブラウザはARに対応していません。iOS SafariまたはAndroid Chromeでアクセスしてください。');
    startButton.disabled = true;
  }

  // 画面回転対応
  window.addEventListener('resize', () => {
    if (arHandler && arHandler.isInitialized()) {
      arHandler.resize();
    }
  });
});
