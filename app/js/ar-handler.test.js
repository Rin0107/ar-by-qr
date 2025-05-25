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

const config = {
  container: document.createElement('div'),
  imageFile: 'assets/images/display.png',
  markerFile: 'assets/markers/marker.png',
  onMarkerFound: jest.fn(),
  onMarkerLost: jest.fn(),
  onError: jest.fn(),
};

let arHandler = new ARHandler(config);

jest.mock('three', () => {
  const originalThree = jest.requireActual('three');
  return {
    ...originalThree,
    TextureLoader: jest.fn().mockImplementation(() => ({
      loadAsync: jest.fn().mockResolvedValue({
        image: {
          width: 1024,
          height: 1024,
          src: 'mock-image-src',
        },
      }),
    })),
  };
});


test('should correctly handle user agent support', () => {
  function mockUserAgent(userAgent) {
    const userAgentProp = {
      get: () => userAgent,
      configurable: true,
    };
    Object.defineProperty(window.navigator, 'userAgent', userAgentProp);
  }

  const originalUserAgent = window.navigator.userAgent;
  mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  expect(ARHandler.isSupported()).toBe(true);

  // Restore original userAgent
  mockUserAgent(originalUserAgent);
  expect(ARHandler.isSupported()).toBe(false);
});

test('should initialize correctly', async () => {
  await arHandler.initialize();
  expect(arHandler.isInitialized()).toBe(true);
  expect(arHandler.mindarThree).toBeDefined();
  expect(arHandler.imageMesh).toBeDefined();
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
  const mockCamera = { aspect: 0, updateProjectionMatrix: jest.fn() };
  const mockRenderer = { setSize: jest.fn() };
  arHandler.config.camera = mockCamera;
  arHandler.config.renderer = mockRenderer;

  arHandler.resize();

  expect(mockCamera.aspect).toBe(window.innerWidth / window.innerHeight);
  expect(mockCamera.updateProjectionMatrix).toHaveBeenCalled();
  expect(mockRenderer.setSize).toHaveBeenCalledWith(window.innerWidth, window.innerHeight);
});

test('should handle fade-in animation', (done) => {
  const material = { opacity: 0 };
  arHandler.fadeIn(material, 500);

  setTimeout(() => {
    expect(material.opacity).toBeCloseTo(1, 1);
    done();
  }, 600);
});

test('should handle errors', async () => {
  const error = new Error('Test error');
  arHandler.config.onError(error);
  expect(config.onError).toHaveBeenCalledWith(error);
});
