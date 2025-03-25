import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { PotEditorService } from '../../services/pot-editor.service';
import { CustomPot } from '../../models/custom-pot.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-custom-pot-editor',
  templateUrl: './custom-pot-editor.component.html',
  styleUrls: ['./custom-pot-editor.component.css'],
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
})
export class CustomPotEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('editorCanvas') editorCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  potForm!: FormGroup;
  price?: number;
  loadingEditor = false;
  editorLoadError: string | null = null;
  isBrowser: boolean;

  // Wizard steps for the form
  steps = ['Material', 'Size', 'Color', 'Forma'];
  private _currentStepIndex = 0;
  get currentStepIndex(): number {
    return this._currentStepIndex;
  }
  get currentStep(): string {
    return this.steps[this._currentStepIndex];
  }

  // Hardcoded list of available models as fallback.
  // (Alternatively, load these from a JSON file using HttpClient.)
  modelList: string[] = ['pot.glb', 'pot2.glb', 'pot3.glb'];
  selectedModel: string = this.modelList[0];

  constructor(
    private fb: FormBuilder,
    private potService: PotEditorService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cd: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.potForm = this.fb.group({
      material: ['', Validators.required],
      size: [10, [Validators.required, Validators.min(1)]],
      color: ['', Validators.required],
      forma: ['', Validators.required],
    });

    // Update 3D model in real time when form values change.
    this.potForm.valueChanges.subscribe((pot: CustomPot) => {
      if (this.isBrowser) {
        this.potService.update3DModel(pot);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.loadEditor3D();
    }
  }

  loadEditor3D(): void {
    this.loadingEditor = true;
    this.editorLoadError = null;
    this.potService.load3DEditor(this.editorCanvas.nativeElement).subscribe({
      next: () => {
        this.loadingEditor = false;
        this.cd.detectChanges();
        // Update the model using current form values.
        this.potService.update3DModel(this.potForm.value);
      },
      error: (err) => {
        setTimeout(() => {
          this.editorLoadError = 'Error loading 3D editor: ' + err.message;
          this.loadingEditor = false;
          this.cd.detectChanges();
        }, 0);
      }
    });
  }

  nextStep(): void {
    if (this._currentStepIndex < this.steps.length - 1) {
      this._currentStepIndex++;
    }
  }

  prevStep(): void {
    if (this._currentStepIndex > 0) {
      this._currentStepIndex--;
    }
  }

  calculatePrice(): void {
    if (this.potForm.valid) {
      const pot: CustomPot = this.potForm.value;
      this.potService.calculatePrice(pot).subscribe({
        next: (price) => (this.price = price),
        error: (err) => {
          console.error('Error calculating price:', err);
          this.price = undefined;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.potForm.invalid) {
      alert('Please complete all required fields.');
      return;
    }
    this.calculatePrice();
    console.log('Custom pot configuration:', this.potForm.value);
    console.log('Calculated price:', this.price);
    // Additional processing can be added here.
  }

  /**
   * Triggered when the user selects a file.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('[CustomPotEditorComponent] File selected:', file.name);
      this.potService.loadModelFromFile(file).subscribe({
        next: () => {
          console.log('[CustomPotEditorComponent] Model loaded from file successfully');
        },
        error: (err: any) => {
          console.error('[CustomPotEditorComponent] Error loading model from file:', err);
          this.editorLoadError = 'Error loading model from file: ' + err.message;
        }
      });
    }
  }

  /**
   * Loads a model from the hardcoded model list.
   */
  loadSelectedModel(): void {
    if (!this.isBrowser) return;
    const modelPath = 'assets/models/' + this.selectedModel;
    console.log('[CustomPotEditorComponent] Loading model:', modelPath);
    this.potService.loadModel(modelPath).subscribe({
      next: () => {
        console.log('[CustomPotEditorComponent] Model loaded successfully from list');
      },
      error: (err) => {
        console.error('[CustomPotEditorComponent] Error loading model from list:', err);
        this.editorLoadError = 'Error loading model: ' + err.message;
      }
    });
  }
}
