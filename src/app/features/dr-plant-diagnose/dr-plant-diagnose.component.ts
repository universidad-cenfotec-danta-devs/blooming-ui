import { Component } from '@angular/core';
import { DrPlantService, PlantActionType } from '../../services/dr-plant.service';
import { Disease } from '../../models/disease.model';
import { SHARED_IMPORTS } from '../../shared/shared.module';
import { CardCarouselComponent } from '../../shared/components/card-carousel/card-carousel';

@Component({
  selector: 'app-diagnose-plant',
  standalone: true,
  imports: [SHARED_IMPORTS, CardCarouselComponent],
  templateUrl: './dr-plant-diagnose.component.html',
  styleUrls: ['./dr-plant-diagnose.component.css']
})
export class DiagnosePlantComponent {
  /** Whether a diagnosis API call is in progress */
  isLoading = false;

  /** Local URL of the uploaded image for preview */
  uploadedImage = '';

  /** The original File object picked by the user */
  uploadedFile!: File;

  /** Suggestions of diseases returned by the API */
  diseaseDataList: Disease[] = [];

  /** Error message to display on invalid file or API error */
  errorMessage = '';

  constructor(private drPlantService: DrPlantService) {}

  /**
   * Handles the file input change event.
   * - Validates that the file is an image
   * - Generates a local preview URL
   * - Triggers the diagnosis API call
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      this.errorMessage = 'The selected file is not a valid image (jpg, png, etc.).';
      return;
    }

    this.errorMessage = '';
    this.uploadedImage = URL.createObjectURL(file);
    this.uploadedFile = file;
    this.diagnosePlant(file);
  }

  /**
   * Sends the image to the backend for disease diagnosis.
   * Expects the response shape:
   *   { message: string, data: Array<{ diseaseSuggestions?: Disease[] }>, meta: any }
   * Flattens all diseaseSuggestions, sorts by probability desc, and stores in `diseaseDataList`.
   */
  private diagnosePlant(file: File): void {
    this.isLoading = true;
    const form = new FormData();
    form.append('img', file);

    this.drPlantService
      .identifyPlant(form, PlantActionType.Diagnosis)
      .subscribe(
        (resp: any) => {
          // resp.data is the array we want to iterate
          const payload = Array.isArray(resp.data) ? resp.data : [];
          const flat: Disease[] = [];
          for (const entry of payload) {
            if (Array.isArray(entry.diseaseSuggestions)) {
              flat.push(...entry.diseaseSuggestions);
            }
          }
          this.diseaseDataList = flat.sort((a, b) => b.probability - a.probability);
          this.isLoading = false;
        },
        err => {
          console.error('Diagnosis error:', err);
          this.errorMessage = 'Error diagnosing plant.';
          this.isLoading = false;
        }
      );
  }
}
