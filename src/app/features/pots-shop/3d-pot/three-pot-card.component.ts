/*------------------------------------------------------------------
  Component : ThreePotCardComponent
  Shows one pot as an interactive GLB preview and exposes two actions:
   – Add to Cart  (EventEmitter)
   – Evaluate     (navigates to /home/evaluation/pot/<id>)
 ------------------------------------------------------------------*/
 import {
    AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter,
    Inject, Input, NgZone, OnDestroy, Output, PLATFORM_ID, ViewChild
  } from '@angular/core';
  import { CommonModule, isPlatformBrowser } from '@angular/common';
  
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { HttpClient } from '@angular/common/http';
  import { Router } from '@angular/router';
  import { SHARED_IMPORTS } from '../../../shared/shared.module';
  
  @Component({
    selector: 'three-pot-card',
    standalone: true,
    imports: [SHARED_IMPORTS, CommonModule],
    template: `
      <div class="group">
        <!-- 3-D preview -->
        <div class="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <canvas #canvas class="w-full h-full"></canvas>
        </div>
  
        <!-- Meta -->
        <h3 class="mt-3 text-sm text-gray-700">{{ name }}</h3>
        <p class="text-xs text-gray-400">{{ designerName }}</p>
        <p class="mt-1 text-lg font-medium text-gray-900">{{ price | currency }}</p>
  
        <!-- Actions -->
        <button class="primary-btn mt-2 w-full py-1" (click)="add.emit()">
          {{ 'CART.ADD' | translate }}
        </button>
  
        <button
          class="secondary-btn mt-2 w-full py-1"
          (click)="goToEvaluation()"
        >
          {{ 'EVALUATION.BUTTON_MESSAGE' | translate }}
        </button>
      </div>
    `,
    styles: [':host { display:block; }']
  })
  export class ThreePotCardComponent implements AfterViewInit, OnDestroy {
    /* ---------- Inputs ---------- */
    @Input({ required: true }) fileUrl!: string;
    @Input({ required: true }) potId!: number;
    @Input() name = 'Pot';
    @Input() price = 0;
    @Input() designerName = 'Designer';
  
    /* ---------- Outputs --------- */
    @Output() add = new EventEmitter<void>();
  
    /* ---------- View ref -------- */
    @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
    /* ---------- Three objects --- */
    private scene?: THREE.Scene;
    private renderer?: THREE.WebGLRenderer;
    private camera?: THREE.PerspectiveCamera;
    private controls?: OrbitControls;
    private potGroup = new THREE.Group();
  
    constructor(
      private ngZone: NgZone,
      private http: HttpClient,
      private router: Router,
      @Inject(PLATFORM_ID) private platformId: object,
      private cd: ChangeDetectorRef
    ) {}
  
    /* ============================ lifecycle ======================== */
    ngAfterViewInit(): void {
      if (!isPlatformBrowser(this.platformId)) return;
      this.initThree();
      this.loadModel(this.fileUrl);
    }
  
    ngOnDestroy(): void {
      this.renderer?.dispose();
      this.scene?.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          const mats = (Array.isArray((o as THREE.Mesh).material)
            ? (o as THREE.Mesh).material
            : [(o as THREE.Mesh).material]) as THREE.Material[];
          mats.forEach((m) => m.dispose());
          (o as THREE.Mesh).geometry.dispose();
        }
      });
    }
  
    /* ============================ navigation ======================= */
    /** Navigate to evaluation wizard for this pot. */
    goToEvaluation(): void {
      this.router.navigate(['/home/evaluation', 'pot', this.potId]);
    }
  
    /* ============================ Three-JS init ==================== */
    private initThree(): void {
      const canvas = this.canvasRef.nativeElement;
      this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
  
      this.scene = new THREE.Scene();
  
      const aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 100);
      this.camera.position.set(0, 0, 3);
  
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enablePan = false;
      this.controls.enableZoom = false;
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 2;
  
      this.scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));
      const dir = new THREE.DirectionalLight(0xffffff, 0.8);
      dir.position.set(1, 1, 1);
      this.scene.add(dir);
  
      this.scene.add(this.potGroup);
  
      this.ngZone.runOutsideAngular(() => {
        const render = () => {
          requestAnimationFrame(render);
          this.controls!.update();
          this.renderer!.render(this.scene!, this.camera!);
        };
        render();
      });
    }
  
    /* ============================ Model loading ==================== */
    private loadModel(url: string): void {
      const loader = new GLTFLoader();
      loader.setCrossOrigin('anonymous');
  
      this.http.get(url, { responseType: 'arraybuffer' }).subscribe({
        next: (buffer) =>
          loader.parse(buffer, '', (gltf: GLTF) => {
            this.potGroup.clear();
            const model = gltf.scene;
  
            /* Center + scale */
            const box = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            box.getSize(size);
            const max = Math.max(size.x, size.y, size.z) || 1;
            model.scale.setScalar(1.5 / max);
            box.setFromObject(model).getCenter(size);
            model.position.sub(size);
  
            this.potGroup.add(model);
            this.cd.detectChanges();
          }),
        error: (e) => console.error('[ThreePotCard] download error:', e)
      });
    }
  }
  