class ARHandler {
  constructor(config) {
    this.config = config;
    this.initialized = false;
    this.running = false;
  }

  static isSupported() {
    const userAgent = navigator.userAgent;
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);

    return 'mediaDevices' in navigator &&
      'getUserMedia' in navigator.mediaDevices &&
      (isSafari || isChrome);
  }

  async initialize() {
    this.initialized = true;
  }

  async start() {
    if (!this.initialized) {
      throw new Error('ARが初期化されていません。initialize()を先に呼び出してください。');
    }
    this.running = true;
  }

  stop() {
    this.running = false;
  }

  resize() {
    // Implement resize logic
  }

  fadeIn(material, duration) {
    // Implement fadeIn logic
  }

  isInitialized() {
    return this.initialized;
  }

  isRunning() {
    return this.running;
  }
}

export default ARHandler;
