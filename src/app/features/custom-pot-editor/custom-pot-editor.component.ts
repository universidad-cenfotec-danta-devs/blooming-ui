import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PotEditorService } from '../../services/pot-editor.service';
import { PotService } from '../../services/pot.service';
import { CustomPot } from '../../models/custom-pot.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ModalComponent } from '../../shared/components/modal/modal.component'; // Adjust import path as needed
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-custom-pot-editor',
  templateUrl: './custom-pot-editor.component.html',
  styleUrls: ['./custom-pot-editor.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ModalComponent, TranslateModule]
})
export class CustomPotEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('editorCanvas') editorCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Confirmation modal (if needed for other confirmations)
  @ViewChild('confirmModal') confirmModal!: ModalComponent;
  // Modal used to ask the user for a custom pot name (assumes it contains an input field)
  @ViewChild('nameModal') nameModal!: ModalComponent;

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

  // Default pot models available locally
  modelList: string[] = ['pot.glb', 'pot2.glb', 'pot3.glb'];
  selectedModel: string = this.modelList[0];

  // Stores the selected 3D file for upload (if the user chooses a file manually)
  selectedFile: File | null = null;

  // Stores the custom pot name entered by the user via the modal
  customPotName: string = '';

  constructor(
    private fb: FormBuilder,
    private potEditorService: PotEditorService,
    private potService: PotService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService
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
        this.potEditorService.update3DModel(pot);
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
    this.potEditorService.load3DEditor(this.editorCanvas.nativeElement).subscribe({
      next: () => {
        this.loadingEditor = false;
        this.cd.detectChanges();
        this.potEditorService.update3DModel(this.potForm.value);
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
      this.potEditorService.calculatePrice(pot).subscribe({
        next: (price) => {
          this.price = price;
          console.log('[PotEditorService] Price calculated:', price);
        },
        error: (err) => {
          console.error('Error calculating price:', err);
          this.price = undefined;
          this.toastr.error('Error calculating price.');
        }
      });
    }
  }

  /**
   * Called when the user clicks "Confirm Creation".
   * Opens a modal to ask for the custom pot name.
   */
  onSubmit(): void {
    if (this.potForm.invalid) {
      this.toastr.error('Please complete all required fields.');
      return;
    }
    // Calculate the price before asking for the name
    this.calculatePrice();
    // Open the modal to input a custom pot name
    this.openNameModal();
  }

  /**
   * Opens the modal used to input a custom pot name.
   * This modal should have an input field bound to `customPotName`.
   */
  openNameModal(): void {
    this.nameModal.openModal();
  }

  /**
   * Handles the confirmation from the custom pot name modal.
   * Uses the entered pot name to upload the pot and update the model list.
   * If no file is selected via file input, attempts to retrieve the currently loaded model file from the 3D editor.
   */handleNameModalConfirm(): void {
  if (!this.customPotName || this.customPotName.trim() === '') {
    this.toastr.error('Please enter a valid pot name.');
    return;
  }

  // Construct the PotRequest object using form values and the entered pot name
  const potRequest = {
    name: this.customPotName,
    description: `Material: ${this.potForm.value.material}, Size: ${this.potForm.value.size}, Color: ${this.potForm.value.color}`,
    price: this.price || 0
  };

  // Instead of checking for a manually selected file, export the current model
  this.potEditorService.exportCurrentModel().subscribe({
    next: (blob: Blob) => {
      // Create a File object from the exported Blob
      const updatedFile = new File([blob], 'customPot.glb', { type: 'model/gltf-binary' });
      // Upload using the updatedFile
      this.potService.uploadPot(potRequest, updatedFile).subscribe({
        next: (uploadedPot) => {
          console.log('Pot uploaded successfully:', uploadedPot);
          this.toastr.success('Pot uploaded successfully!');
          // Update the list of user's pots (combining default models with user models)
          this.potService.getPots(0, 10).subscribe({
            next: (userPots) => {
              const defaultPots = ['pot.glb', 'pot2.glb', 'pot3.glb'];
              const userPotModels = userPots.map(pot => pot.imageUrl);
              const combinedList = Array.from(new Set([...defaultPots, ...userPotModels]));
              this.modelList = combinedList;
              console.log('Updated model list:', this.modelList);
            },
            error: (err) => {
              console.error('Error fetching user pots:', err);
              this.toastr.error('Error updating model list.');
            }
          });
        },
        error: (err) => {
          console.error('Error uploading pot:', err);
          this.toastr.error('Error uploading pot. Please try again.');
        }
      });
    },
    error: (err) => {
      console.error('Error exporting updated model:', err);
      this.toastr.error('Failed to export updated model.');
    }
  });
}

  /**
   * Handles the cancellation from the custom pot name modal.
   */
  handleNameModalCancel(): void {
    console.log('Pot name input cancelled by user.');
    this.toastr.info('Pot creation cancelled.');
  }

  /**
   * Triggered when the user selects a file to upload.
   * Loads the 3D model from the file.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;  // Save the selected file for upload
      console.log('[CustomPotEditorComponent] File selected:', file.name);
      this.potEditorService.loadModelFromFile(file).subscribe({
        next: () => {
          console.log('[CustomPotEditorComponent] Model loaded from file successfully');
        },
        error: (err: any) => {
          console.error('[CustomPotEditorComponent] Error loading model from file:', err);
          this.editorLoadError = 'Error loading model from file: ' + err.message;
          this.toastr.error('Error loading model from file.');
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
    this.potEditorService.loadModel(modelPath).subscribe({
      next: () => {
        console.log('[CustomPotEditorComponent] Model loaded successfully from list');
      },
      error: (err) => {
        console.error('[CustomPotEditorComponent] Error loading model from list:', err);
        this.editorLoadError = 'Error loading model: ' + err.message;
        this.toastr.error('Error loading model from list.');
      }
    });
  }
}
