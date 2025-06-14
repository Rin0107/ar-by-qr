import './main';
import { ARHandler } from './ar-handler';

// Mock ARHandler
jest.mock('./ar-handler', () => {
  const ARHandler = jest.fn().mockImplementation(() => ({
    initialize: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    isInitialized: jest.fn().mockReturnValue(true),
    isRunning: jest.fn().mockReturnValue(false),
    resize: jest.fn(),
  }));
  ARHandler.isSupported = jest.fn().mockReturnValue(true);

  return {
    ARHandler,
  };
});

describe('main.js', () => {
  let startButton;
  let loadingIndicator;
  let errorMessage;
  let startupScreen;
  let arScreen;
  let arHandler;

  beforeEach(() => {
    document.body.innerHTML = `
    <div id="startup-screen">
      <button id="start-button">開始する</button>
      <div id="loading" class="hidden">読み込み中...</div>
      <div id="error-message" class="hidden"></div>
    </div>
    <div id="ar-screen" class="hidden"></div>
    <div id="scanning-overlay" class="hidden"></div>
    <div id="ar-container"></div>
  `;
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // 要素の取得（main.js によってイベントがバインドされたあとで）
    startButton = document.getElementById('start-button');
    loadingIndicator = document.getElementById('loading');
    errorMessage = document.getElementById('error-message');
    startupScreen = document.getElementById('startup-screen');
    arScreen = document.getElementById('ar-screen');

    // // モックされた ARHandler のインスタンス化
    // arHandler = new ARHandler();

  });

  // test('should initialize ARHandler on start button click', async () => {
  //   await startButton.click();
  //   expect(arHandler.initialize).toHaveBeenCalled();
  // });

  test('should show loading indicator on start button click', async () => {
    await startButton.click();
    expect(loadingIndicator.classList.contains('hidden')).toBe(false);
  });

  test('should hide startup screen and show AR screen on successful start', async () => {
    await startButton.click();
    expect(startupScreen.classList.contains('hidden')).toBe(true);
    expect(arScreen.classList.contains('hidden')).toBe(false);
  });

  // test('should show error message on AR start failure', async () => {
  //   arHandler.start.mockImplementationOnce(() => {
  //     throw new Error('AR start failed');
  //   });

  //   try {
  //     await startButton.click();
  //   } catch (error) {
  //     expect(arHandler.initialize).toHaveBeenCalled();
  //     expect(errorMessage.classList.contains('hidden')).toBe(false);
  //     expect(errorMessage.textContent).toContain('ARの起動に失敗しました');
  //   }
  // });

  test('should disable start button if browser is not supported', () => {
    ARHandler.isSupported.mockReturnValueOnce(false);
    // DOMContentLoaded イベントを再発火して、main.js の初期化をトリガー
    document.dispatchEvent(new Event('DOMContentLoaded'));
    expect(startButton.disabled).toBe(true);
  });
});
