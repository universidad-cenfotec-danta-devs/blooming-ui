import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PotEditorService } from '../../services/pot-editor.service';
import { CustomPot } from '../../models/custom-pot.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ModalComponent } from '../../shared/components/modal/modal.component'; // Adjust import path as needed
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-custom-pot-editor',
  templateUrl: './custom-pot-editor.component.html',
  styleUrls: ['./custom-pot-editor.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ModalComponent,TranslateModule]
})
export class CustomPotEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('editorCanvas') editorCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Reference to the modal component for confirmation
  @ViewChild('confirmModal') confirmModal!: ModalComponent;

  potForm!: FormGroup;
  price?: number;
  loadingEditor = false;
  editorLoadError: string | null = null;
  isBrowser: boolean;

  // Steps for the form (Material, Size, Color)
  steps = ['Material', 'Size', 'Color'];
  private _currentStepIndex = 0;

  get currentStepIndex(): number {
    return this._currentStepIndex;
  }
  get currentStep(): string {
    return this.steps[this._currentStepIndex];
  }

  // Hardcoded list of available models
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
    // Create form with material, size (min 6, max 100), and color
    this.potForm = this.fb.group({
      material: ['', Validators.required],
      size: [10, [Validators.required, Validators.min(6), Validators.max(100)]],
      color: ['', Validators.required]
    });

    // Update 3D model whenever form values change
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

  /**
   * Initializes the 3D editor and loads a default model.
   */
  loadEditor3D(): void {
    this.loadingEditor = true;
    this.editorLoadError = null;
    this.potService.load3DEditor(this.editorCanvas.nativeElement).subscribe({
      next: () => {
        this.loadingEditor = false;
        this.cd.detectChanges();
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

  /**
   * Sets the current step index when the user clicks on a step circle.
   */
  setCurrentStep(index: number): void {
    this._currentStepIndex = index;
  }

  /**
   * Calculates the price for the custom pot.
   */
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

  /**
   * Called when the user clicks "Confirm Creation".
   * Opens the confirmation modal instead of immediately logging.
   */
  onSubmit(): void {
    if (this.potForm.invalid) {
      alert('Please complete all required fields.');
      return;
    }
    this.calculatePrice();
    this.confirmModal.openModal();
  }

  /**
   * Handles the confirmation from the modal.
   * Logs the form data and price.
   */
  handleModalConfirm(): void {
    console.log('Custom pot configuration:', this.potForm.value);
    console.log('Calculated price:', this.price);
    // Additional processing can be added here.
  }

  /**
   * Handles the modal cancel event.
   */
  handleModalCancel(): void {
    console.log('Action cancelled by user.');
  }

  /**
   * Triggered when the user selects a file to upload.
   * Loads the 3D model from the file.
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
   * Loads the selected model from the dropdown automatically.
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
