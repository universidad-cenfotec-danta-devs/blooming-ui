import { Injectable, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CustomPot } from '../models/custom-pot.model';
import { isPlatformBrowser } from '@angular/common';

/**
 * Real-world dimensions for pot sizes (reference only).
 */
const SIZE_DIMENSIONS: Record<string, string> = {
  'Extra Small': '10×10×10 cm',
  'Small':       '20×20×20 cm',
  'Medium':      '30×30×30 cm',
  'Large':       '40×40×40 cm',
  'X-Large':     '50×50×50 cm'
};

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
   * Initializes the Three.js scene with camera, lights, OrbitControls,
   * and creates a default fallback cube. After a 1-second delay, it automatically
   * loads the default pot model ("pot.glb") to replace the cube.
   * This code runs only in the browser.
   * @param canvas The HTMLCanvasElement for rendering.
   * @returns Observable that emits true if the scene is initialized.
   */
  load3DEditor(canvas: HTMLCanvasElement): Observable<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('Not running in browser: Skipping Three.js initialization.');
      return of(false);
    }
    
    return new Observable(observer => {
      try {
        console.log('[PotEditorService] Initializing 3D scene');
        // Create scene with white background.
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);

        // Set up camera.
        this.camera = new THREE.PerspectiveCamera(
          75,
          canvas.clientWidth / canvas.clientHeight,
          0.1,
          5000
        );
        this.camera.position.set(0, 2, 200);
        console.log('[PotEditorService] Camera position:', this.camera.position);

        // Set up renderer.
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        // Set up OrbitControls.
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        console.log('[PotEditorService] Controls target set to:', this.controls.target);

        // Add AmbientLight and DirectionalLight.
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
        console.log('[PotEditorService] Ambient light added');

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 10, 7);
        this.scene.add(dirLight);

        // (Optional) Load HDR environment map.
        const rgbeLoader = new RGBELoader();
        rgbeLoader.load('assets/hdr/background.hdr', (hdrEquirect) => {
          hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
          this.scene.environment = hdrEquirect;
          console.log('[PotEditorService] Environment map loaded');
        });

        // Create a group to hold the pot model.
        this.potModelGroup = new THREE.Group();
        this.scene.add(this.potModelGroup);

        // Signal that the scene is ready.
        observer.next(true);
        observer.complete();

        // Load the default pot model ("pot.glb") after initialization.
        this.loadModel('assets/models/pot.glb').subscribe({
          next: () => {
            this.controls.target.set(0, 0, 0);
            this.controls.update();
            console.log('[PotEditorService] Default pot model loaded successfully');
            observer.next(true);
            observer.complete();
          },
          error: (err) => {
            console.error('[PotEditorService] Error loading default pot model:', err);
            observer.error(new Error('Failed to load default 3D model'));
          }
        });
        
        // Run the render loop outside Angular's zone.
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
   * Standardizes the size of a loaded model.
   * Calculates the bounding box of the model, determines the maximum dimension,
   * computes a uniform scale factor so that the model's maximum dimension equals desiredSize,
   * applies that scale, and centers the model.
   * @param model The loaded THREE.Object3D model.
   * @param desiredSize The target maximum dimension (in scene units) for the model.
   */
  private standardizeModelSize(model: THREE.Object3D, desiredSize: number): void {
    // Calculate the bounding box of the model.
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDimension = Math.max(size.x, size.y, size.z);

    // Calculate the uniform scale factor.
    const scaleFactor = desiredSize / maxDimension;
    model.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Optionally center the model by subtracting the center from its position.
    const center = new THREE.Vector3();
    box.getCenter(center);
    model.position.sub(center);

    console.log('[PotEditorService] Model standardized with scale factor:', scaleFactor);
  }

  /**
   * Loads a GLB model from a given path, centers it, and scales it uniformly to the desired size.
   * @param modelPath The path to the GLB file.
   * @returns Observable that emits true if the model loads successfully.
   */
  loadModel(modelPath: string): Observable<boolean> {
    return new Observable(observer => {
      try {
        console.log(`[PotEditorService] Loading model from: ${modelPath}`);
        // Clear previous models.
        while (this.potModelGroup.children.length > 0) {
          this.potModelGroup.remove(this.potModelGroup.children[0]);
        }
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(
          modelPath,
          (gltf) => {
            const model = gltf.scene;
            console.log('[PotEditorService] Model loaded raw:', model);

            // Center the model.
            const box = new THREE.Box3().setFromObject(model);
            const center = new THREE.Vector3();
            box.getCenter(center);
            console.log('[PotEditorService] Model center before adjustment:', center);
            model.position.sub(center);

            // Instead of a fixed scale, standardize the model's size.
            // For example, we want the largest dimension to be 100 units.
            this.standardizeModelSize(model, 100);

            // Apply default material to all meshes.
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
   * Loads a GLB model from a File object (user upload), centers it, scales it uniformly,
   * and replaces the current model.
   * @param file The user-uploaded file.
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

            // Center the model.
            const box = new THREE.Box3().setFromObject(model);
            const center = new THREE.Vector3();
            box.getCenter(center);
            model.position.sub(center);

            // Standardize the model size (e.g., maximum dimension = 100 units).
            this.standardizeModelSize(model, 100);

            // Apply default material to each mesh.
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

            // Clear any previous models and add the new one.
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
   * Updates the 3D model's material properties (color, metalness, roughness)
   * based on the custom pot configuration.
   * The "size" field is used only for real-world reference.
   * @param pot The custom pot configuration.
   */
  update3DModel(pot: CustomPot): void {
    if (!this.potModelGroup) return;
    if (pot.size && SIZE_DIMENSIONS[pot.size]) {
      console.log(`[PotEditorService] Real-world size selected: ${pot.size} => ${SIZE_DIMENSIONS[pot.size]}`);
    }
    this.potModelGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => this.applyMaterialChanges(m as THREE.MeshPhysicalMaterial, pot));
        } else {
          this.applyMaterialChanges(mesh.material as THREE.MeshPhysicalMaterial, pot);
        }
      }
    });
    console.log('[PotEditorService] 3D model updated with configuration (material/color). Real-world size is for reference only.');
  }

  /**
   * Applies material changes to a mesh based on the custom pot configuration.
   * @param material The mesh's physical material.
   * @param pot The custom pot configuration.
   */
  private applyMaterialChanges(material: THREE.MeshPhysicalMaterial, pot: CustomPot): void {
    material.color.set(pot.color || '#0077ff');
    material.metalness = 0.0;
    material.roughness = 0.5;
    switch (pot.material) {
      case 'Metal':
        material.metalness = 0.8;
        material.roughness = 0.2;
        break;
      case 'Wood':
        material.metalness = 0.0;
        material.roughness = 0.7;
        break;
      case 'Ceramic':
        material.metalness = 0.0;
        material.roughness = 0.3;
        break;
      case 'Plastic':
      default:
        material.metalness = 0.0;
        material.roughness = 0.4;
        break;
    }
    material.needsUpdate = true;
  }

  /**
   * Calculates the price for the custom pot based on its material.
   * The real-world size is provided only as a reference.
   * @param pot The custom pot configuration.
   * @returns Observable<number> with the calculated price.
   */
  calculatePrice(pot: CustomPot): Observable<number> {
    return new Observable(observer => {
      try {
        const basePrice = 20;
        let materialFactor = 5;
        switch (pot.material) {
          case 'Ceramic':
            materialFactor = 10;
            break;
          case 'Metal':
            materialFactor = 15;
            break;
          case 'Wood':
            materialFactor = 8;
            break;
        }
        const price = basePrice + materialFactor;
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
