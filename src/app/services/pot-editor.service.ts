import { Injectable, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CustomPot } from '../models/custom-pot.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PotEditorService {
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private potModelGroup!: THREE.Group;

  constructor(private ngZone: NgZone, @Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Initializes the Three.js scene with camera, lights, controls and loads the default GLB model.
   * This code will run only in the browser.
   * @param canvas The HTMLCanvasElement used for rendering.
   * @returns An Observable that emits true if the scene is initialized.
   */
  load3DEditor(canvas: HTMLCanvasElement): Observable<boolean> {
    // Ensure we run only in the browser.
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('Not running in browser: Skipping Three.js initialization.');
      return of(false);
    }

    return new Observable(observer => {
      try {
        console.log('[PotEditorService] Initializing 3D scene');
        // Create scene with white background
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);

        // Set up camera: Adjust far plane and position for very large models.
        this.camera = new THREE.PerspectiveCamera(
          75,
          canvas.clientWidth / canvas.clientHeight,
          0.1,
          5000
        );
        // Position the camera far away for large models.
        this.camera.position.set(0, 2, 200);
        console.log('[PotEditorService] Camera position:', this.camera.position);

        // Set up renderer
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        // Set up OrbitControls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        console.log('[PotEditorService] Controls target set to:', this.controls.target);

        // Add AmbientLight and DirectionalLight
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
        console.log('[PotEditorService] Ambient light added');

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 10, 7);
        this.scene.add(dirLight);

        // Load HDR environment map for realistic reflections
        const rgbeLoader = new RGBELoader();
        rgbeLoader.load('assets/hdr/royal_esplanade_1k.hdr', (hdrEquirect) => {
          hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
          this.scene.environment = hdrEquirect;
          console.log('[PotEditorService] Environment map loaded');
        });

        // Create group to hold the pot model
        this.potModelGroup = new THREE.Group();
        this.scene.add(this.potModelGroup);

        // Load the default model
        this.loadModel('assets/models/pot.glb').subscribe({
          next: () => {
            this.controls.target.set(0, 0, 0);
            this.controls.update();
            console.log('[PotEditorService] Default model loaded successfully');
            observer.next(true);
            observer.complete();
          },
          error: (err) => {
            console.error('[PotEditorService] Error loading default model:', err);
            observer.error(new Error('Failed to load 3D model'));
          }
        });

        // Run the render loop outside Angular zone to avoid affecting Angular's stability
        this.ngZone.runOutsideAngular(() => {
          const animate = () => {
            requestAnimationFrame(animate);
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
          };
          animate();
        });
      } catch (error) {
        console.error('[PotEditorService] Error initializing 3D editor:', error);
        observer.error(new Error('Failed to load 3D editor'));
      }
    });
  }

  /**
   * Loads a GLB model from the given path, centers it, scales it VERY LARGE, and adds it to the potModelGroup.
   * @param modelPath The path to the GLB file.
   * @returns Observable that emits true if the model loads successfully.
   */
  loadModel(modelPath: string): Observable<boolean> {
    return new Observable(observer => {
      try {
        console.log(`[PotEditorService] Loading model from: ${modelPath}`);
        while (this.potModelGroup.children.length > 0) {
          this.potModelGroup.remove(this.potModelGroup.children[0]);
        }
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(
          modelPath,
          (gltf) => {
            const model = gltf.scene;
            console.log('[PotEditorService] Model loaded raw:', model);

            // Center the model using its bounding box.
            const box = new THREE.Box3().setFromObject(model);
            const center = new THREE.Vector3();
            box.getCenter(center);
            console.log('[PotEditorService] Model center before adjustment:', center);
            model.position.sub(center);
            console.log('[PotEditorService] Model position after centering:', model.position);

            // Scale the model VERY LARGE for visibility.
            model.scale.set(100, 100, 100);
            console.log('[PotEditorService] Model scaled to:', model.scale);

            const boxAfter = new THREE.Box3().setFromObject(model);
            console.log('[PotEditorService] Model bounding box after adjustment:', boxAfter);

            // Apply a default MeshPhysicalMaterial for realistic rendering.
            model.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.material = new THREE.MeshPhysicalMaterial({
                  color: 0x0077ff,
                  metalness: 0.0,
                  roughness: 0.5
                });
              }
            });

            this.potModelGroup.add(model);
            console.log('[PotEditorService] Model loaded and added to group');
            observer.next(true);
            observer.complete();
          },
          (xhr) => {
            if (xhr.total) {
              const percent = (xhr.loaded / xhr.total * 100).toFixed(2);
              console.log(`[PotEditorService] Model loading: ${percent}% loaded`);
            } else {
              console.log('[PotEditorService] Model loading progress:', xhr.loaded);
            }
          },
          (error) => {
            console.error('[PotEditorService] GLTFLoader error:', error);
            observer.error(new Error('Failed to load 3D model'));
          }
        );
      } catch (error) {
        console.error('[PotEditorService] Error in loadModel:', error);
        observer.error(new Error('Error loading model'));
      }
    });
  }

  /**
   * Loads a GLB model from a File object.
   * @param file The GLB file.
   * @returns Observable that emits true if the model loads successfully.
   */
  loadModelFromFile(file: File): Observable<boolean> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target?.result;
        if (!arrayBuffer) {
          observer.error(new Error('File read error'));
          return;
        }
        const gltfLoader = new GLTFLoader();
        gltfLoader.parse(
          arrayBuffer as ArrayBuffer,
          '',
          (gltf) => {
            const model = gltf.scene;
            console.log('[PotEditorService] Model loaded from file:', model);

            const box = new THREE.Box3().setFromObject(model);
            const center = new THREE.Vector3();
            box.getCenter(center);
            model.position.sub(center);

            model.scale.set(100, 100, 100);

            model.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.material = new THREE.MeshPhysicalMaterial({
                  color: 0x0077ff,
                  metalness: 0.0,
                  roughness: 0.5
                });
              }
            });

            while (this.potModelGroup.children.length > 0) {
              this.potModelGroup.remove(this.potModelGroup.children[0]);
            }
            this.potModelGroup.add(model);
            console.log('[PotEditorService] Model loaded from file and added to group');
            observer.next(true);
            observer.complete();
          },
          (error) => {
            console.error('[PotEditorService] Error parsing GLB model from file:', error);
            observer.error(new Error('Failed to parse GLB model'));
          }
        );
      };
      reader.onerror = (error) => {
        console.error('[PotEditorService] FileReader error:', error);
        observer.error(new Error('FileReader error'));
      };
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Updates the 3D model based on the custom pot configuration.
   * @param pot The custom pot configuration.
   */
  update3DModel(pot: CustomPot): void {
    if (!this.potModelGroup) return;
    const scaleFactor = (pot.size || 10) / 10;
    this.potModelGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);

    this.potModelGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => {
            (m as THREE.MeshPhysicalMaterial).color.set(pot.color || '#0077ff');
            (m as THREE.MeshPhysicalMaterial).needsUpdate = true;
          });
        } else {
          (mesh.material as THREE.MeshPhysicalMaterial).color.set(pot.color || '#0077ff');
          (mesh.material as THREE.MeshPhysicalMaterial).needsUpdate = true;
        }
      }
    });
    console.log('[PotEditorService] 3D model updated with configuration:', pot);
  }

  /**
   * Calculates the price for the custom pot based on its configuration.
   * @param pot The custom pot configuration.
   * @returns Observable<number> emitting the calculated price.
   */
  calculatePrice(pot: CustomPot): Observable<number> {
    return new Observable(observer => {
      try {
        const basePrice = 20;
        const materialFactor = pot.material === 'Ceramic' ? 10 :
                               pot.material === 'Metal' ? 15 :
                               pot.material === 'Wood' ? 8 : 5;
        const sizeFactor = (pot.size || 10) * 0.5;
        const formaFactor = (pot.forma === 'Square') ? 5 : 0;
        const price = basePrice + materialFactor + sizeFactor + formaFactor;
        console.log('[PotEditorService] Price calculated:', price);
        observer.next(price);
        observer.complete();
      } catch (error) {
        console.error('[PotEditorService] Error calculating price:', error);
        observer.error(new Error('Error calculating price'));
      }
    });
  }
}
