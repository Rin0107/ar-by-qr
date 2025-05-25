class ARHandler {
  constructor(config) {
    this.config = config;
    this.initialized = false;
    this.running = false;
  }

  static isSupported() {
    return 'mediaDevices' in navigator &&
      'getUserMedia' in navigator.mediaDevices &&
      /Safari|Chrome/.test(navigator.userAgent);
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
    const { innerWidth, innerHeight } = window;
    // Assuming camera and renderer are part of the config or class properties
    if (this.config.camera && this.config.renderer) {
      this.config.camera.aspect = innerWidth / innerHeight;
      this.config.camera.updateProjectionMatrix();
      this.config.renderer.setSize(innerWidth, innerHeight);
    }
  }

  fadeIn(material, duration) {
    const start = performance.now();
    const animate = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      material.opacity = progress;
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }

  isInitialized() {
    return this.initialized;
  }

  isRunning() {
    return this.running;
  }
}

export default ARHandler;
