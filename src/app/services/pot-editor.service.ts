import { Injectable, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { CustomPot } from '../models/custom-pot.model';
import { isPlatformBrowser } from '@angular/common';
import {
  GLTFLoader,
  GLTF
} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { HttpClient } from '@angular/common/http';


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

  private currentModelFile: File | null = null;

  constructor(private ngZone: NgZone, @Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient) {}

  /**
   * Initializes the Three.js scene with camera, lights, OrbitControls,
   * and creates a default group for the pot model.
   * Also loads the default pot model ("pot.glb") and starts the render loop.
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
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);

        this.camera = new THREE.PerspectiveCamera(
          75,
          canvas.clientWidth / canvas.clientHeight,
          0.1,
          5000
        );
        this.camera.position.set(0, 2, 200);

        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.update();

        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 10, 7);
        this.scene.add(dirLight);


        this.potModelGroup = new THREE.Group();
        this.scene.add(this.potModelGroup);

        observer.next(true);
        observer.complete();

        this.loadModel('assets/models/pot.glb').subscribe({
          next: () => {
            this.controls.target.set(0, 0, 0);
            this.controls.update();
            observer.next(true);
            observer.complete();
          },
          error: (err) => {
            console.error('[PotEditorService] Error loading default pot model:', err);
            observer.error(new Error('Failed to load default 3D model'));
          }
        });
        
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
/**
 * Uniform-scales `model` so its largest dimension equals `desiredSize`
 * and re-centres it on the origin.  If the GLB has zero size
 * (e.g. empty root node) the model is left untouched.
 */
private standardizeModelSize(
  model: THREE.Object3D,
  desiredSize: number
): void {
  const box  = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  box.getSize(size);

  const maxDim = Math.max(size.x, size.y, size.z);
  if (maxDim === 0) {
    console.warn('[PotEditor] Model has zero dimension – no scaling applied');
    return;
  }

  const scale = desiredSize / maxDim;
  model.scale.setScalar(scale);

  const center = new THREE.Vector3();
  box.getCenter(center);
  model.position.sub(center);
}


  /**
 * Loads a GLB file into the scene. Works with:
 * • local assets (e.g. "assets/models/pot.glb")
 * • remote URLs returned by the back-end (e.g. S3 links)
 *
 * CORS note – if the bucket sends the proper headers we stream it
 * directly through GLTFLoader; otherwise we fetch the file first and
 * feed the ArrayBuffer into `loader.parse`.
 */
loadModel(modelPath: string): Observable<boolean> {
  return new Observable<boolean>((observer) => {
    try {
      /* ── 1. clear previous object ─────────────────────────── */
      if (this.potModelGroup) this.potModelGroup.clear();

      /* ── 2. configure GLTFLoader ──────────────────────────── */
      const loader = new GLTFLoader();
      loader.setCrossOrigin('anonymous'); // allow remote hosts

      /* helper that centres, scales and adds the model */
      const addToScene = (gltf: GLTF): void => {
        const model = gltf.scene;

        /* centre model at origin */
        const box = new THREE.Box3().setFromObject(model);
        const centre = new THREE.Vector3();
        box.getCenter(centre);
        model.position.sub(centre);

        /* uniform scale so the largest dimension = 100 units   */
        this.standardizeModelSize(model, 150);

        /* simple blue material for every mesh (placeholder) */
        model.traverse((obj: THREE.Object3D) => {
          if ((obj as THREE.Mesh).isMesh) {
            (obj as THREE.Mesh).material = new THREE.MeshPhysicalMaterial({
              color: 0x0077ff,
              metalness: 0,
              roughness: 0.5,
            });
          }
        });

        /* add + notify */
        this.potModelGroup.add(model);
        observer.next(true);
        observer.complete();
      };

      /* ── 3. decide load strategy ─────────────────────────── */
      const isRemote = modelPath.startsWith('http');

      if (isRemote) {
        /* Fetch file first (avoids some restrictive CORS setups) */
        fetch(modelPath, { mode: 'cors' })
          .then((res) => {
            if (!res.ok) throw new Error(res.statusText);
            return res.arrayBuffer();
          })
          .then((ab) =>
            loader.parse(
              ab,
              '',           // no path prefix
              (gltf) => addToScene(gltf),
              (err) => {
                console.error('[PotEditor] parse error:', err);
                observer.error(new Error('Failed to parse remote GLB'));
              },
            ),
          )
          .catch((err) => {
            console.error('[PotEditor] fetch error:', err);
            observer.error(new Error('Failed to fetch remote GLB'));
          });
      } else {
        /* Local asset – let GLTFLoader stream it */
        loader.load(
          modelPath,
          (gltf) => addToScene(gltf),
          undefined, // progress
          (err) => {
            console.error('[PotEditor] GLTFLoader error:', err);
            observer.error(new Error('Failed to load model'));
          },
        );
      }
    } catch (err) {
      console.error('[PotEditor] loadModel fatal:', err);
      observer.error(new Error('Error loading model'));
    }
  });
}


/**
 * Loads a GLB model from a File object (user upload), centers it, scales it uniformly,
 * and replaces the current model.
 *
 * @param file The user-uploaded file.
 * @returns Observable that emits true if the model loads successfully.
 */
loadModelFromFile(file: File): Observable<boolean> {
  this.currentModelFile = file;
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
          const box = new THREE.Box3().setFromObject(model);
          const center = new THREE.Vector3();
          box.getCenter(center);
          model.position.sub(center);

          this.standardizeModelSize(model, 100);

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

          // Clear previously loaded models before adding the new one.
          this.potModelGroup.clear();
          this.potModelGroup.add(model);
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
   * Exports the currently displayed (updated) pot model as a GLB Blob.
   * This exported file reflects any changes made to the model (e.g., color updates).
   * @returns Observable that emits a Blob representing the exported model.
   */
  exportCurrentModel(): Observable<Blob> {
    return new Observable(observer => {
      try {
        const exporter = new GLTFExporter();
        const options: any = { binary: true };
        exporter.parse(
          this.potModelGroup,
          (result: ArrayBuffer | object) => {
            let blob: Blob;
            if (result instanceof ArrayBuffer) {
              blob = new Blob([result], { type: 'model/gltf-binary' });
            } else {
              const output = JSON.stringify(result, null, 2);
              blob = new Blob([output], { type: 'application/json' });
            }
            observer.next(blob);
            observer.complete();
          },
          options
        );
      } catch (error: any) {
        observer.error(new Error('Error exporting current model: ' + error));
      }
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
        observer.next(price);
        observer.complete();
      } catch (error) {
        console.error('[PotEditorService] Error calculating price:', error);
        observer.error(new Error('Error calculating price'));
      }
    });
  }
}
