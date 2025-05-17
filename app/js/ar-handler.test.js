import ARHandler from './ar-handler';

// Mock dependencies
jest.mock('mind-ar', () => ({
  MindARThree: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    addAnchor: jest.fn().mockReturnValue({
      group: { add: jest.fn() },
      onTargetFound: jest.fn(),
      onTargetLost: jest.fn(),
    }),
  })),
}));

beforeAll(() => {
  Object.defineProperty(navigator, 'mediaDevices', {
    value: {
      getUserMedia: jest.fn().mockResolvedValue(true),
    },
    configurable: true,
  });
});

let arHandler;
const config = {
  container: document.createElement('div'),
  imageFile: 'assets/images/display.png',
  markerFile: 'assets/markers/marker.png',
  onMarkerFound: jest.fn(),
  onMarkerLost: jest.fn(),
  onError: jest.fn(),
};

beforeEach(() => {
  arHandler = new ARHandler(config);
});

test('should instantiate correctly', () => {
  expect(arHandler).toBeInstanceOf(ARHandler);
});

test('should check browser support', () => {
  const originalUserAgent = navigator.userAgent;
  console.log('Original userAgent:', originalUserAgent);
  const mockUserAgent = (userAgent) => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: userAgent,
      configurable: true,
    });
  };

  mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  expect(ARHandler.isSupported()).toBe(true);

  // Restore original userAgent
  mockUserAgent(originalUserAgent);
  expect(ARHandler.isSupported()).toBe(false);
});

test('should initialize correctly', async () => {
  await arHandler.initialize();
  expect(arHandler.isInitialized()).toBe(true);
});

test('should start AR session', async () => {
  await arHandler.initialize();
  await arHandler.start();
  expect(arHandler.isRunning()).toBe(true);
});

test('should stop AR session', () => {
  arHandler.stop();
  expect(arHandler.isRunning()).toBe(false);
});

test('should handle resize', () => {
  arHandler.resize();
  // Add assertions for resize behavior
});

test('should handle fade-in animation', () => {
  const material = { opacity: 0 };
  arHandler.fadeIn(material, 500);
  // Add assertions for fade-in behavior
});

test('should handle errors', async () => {
  const error = new Error('Test error');
  arHandler.config.onError(error);
  expect(config.onError).toHaveBeenCalledWith(error);
});
