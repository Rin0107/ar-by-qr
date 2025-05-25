import { MindARThree } from 'mind-ar';
import * as THREE from 'three';

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
    console.log('ARHandlerの初期化を開始します。');
    try {
      // MindARの初期化
      this.mindarThree = MindARThree({
        container: this.config.container,
        imageTargetSrc: this.config.markerFile,
        uiLoading: "#loading-overlay",
        uiScanning: "#scanning-overlay",
        uiError: "#error-overlay",
      });
      console.log(this.mindarThree);


      // Three.jsのセットアップ
      const { renderer, scene, camera } = this.mindarThree;

      // 平面ジオメトリの作成（2D画像表示用）
      const geometry = new THREE.PlaneGeometry(1, 1);

      // テクスチャのロード
      const texture = await new THREE.TextureLoader().loadAsync(this.config.imageFile);
      console.log('途中経過', texture);

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0
      });

      // メッシュの作成
      this.imageMesh = new THREE.Mesh(geometry, material);

      // アンカーの設定
      const anchor = this.mindarThree.addAnchor(0);
      anchor.group.add(this.imageMesh);

      // マーカー検出イベント
      anchor.onTargetFound = () => {
        // フェードインアニメーション
        this.fadeIn(this.imageMesh.material, 500);
        if (this.config.onMarkerFound) this.config.onMarkerFound();
      };

      anchor.onTargetLost = () => {
        // 透明度リセット
        this.imageMesh.material.opacity = 0;
        if (this.config.onMarkerLost) this.config.onMarkerLost();
      };

      // リサイズハンドラ
      this.resize();

      this.initialized = true;
    } catch (error) {
      console.error('AR初期化エラー:', error);
      if (this.config.onError) this.config.onError(error);
      throw error;
    }
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
