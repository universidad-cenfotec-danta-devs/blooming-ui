// dr-plant-identify.component.ts

import { Component, ViewChild } from '@angular/core';
import { DrPlantService, PlantActionType } from '../../services/dr-plant.service';
import { SHARED_IMPORTS } from '../../shared/shared.module';
import { DrPlantaChatComponent } from '../dr-plant-chat/dr-plant-chat.component';
import { InfoCardComponent } from '../../shared/components/info-card/info-card.component';
import { PlantService } from '../../services/plant.service';
import { PlantResponse } from '../../interfaces/plantResponse.interface';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-dr-planta-identify',
  standalone: true,
  imports: [
    SHARED_IMPORTS,
    DrPlantaChatComponent,
    InfoCardComponent,
    ModalComponent
  ],
  templateUrl: './dr-plant-identify.component.html',
  styleUrls: ['./dr-plant-identify.component.css'],
})
export class DrPlantComponent {
  /** Loading state */
  isLoading = false;

  /** Preview URL of the selected image */
  uploadedImages: { identify?: string } = {};

  /** Original File for upload */
  uploadedFiles: { identify?: File } = {};

  /** List of identified plants */
  plantDataList: PlantResponse[] = [];

  /** Current tab: identify or chat */
  selectedAction: 'identify' | 'drplant' | null = null;

  /** Error message for UI */
  errorMessage = '';

  /** Plant chosen for confirmation */
  selectedPlantToConfirm: PlantResponse | null = null;

  /** ID of the saved plant, used to seed the chat component */
  chatPlantId: number | null = null;

  @ViewChild('confirmModal') confirmModal!: ModalComponent;

  constructor(
    private drPlantService: DrPlantService,
    private plantService: PlantService,
    private toastr: ToastrService
  ) {}

  /**
   * Switch tabs between Identify and Chat.
   */
  setSelectedAction(action: 'identify' | 'drplant'): void {
    this.selectedAction = action;
    this.errorMessage = '';
  }

  /**
   * Handle file input, validate image, show preview, and call identify API.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'The selected file is not a valid image (jpg, png, etc.).';
      this.toastr.error(this.errorMessage, 'Error');
      return;
    }

    this.errorMessage = '';
    this.uploadedImages.identify = URL.createObjectURL(file);
    this.uploadedFiles.identify = file;

    this.identifyPlant(file);
  }

  /**
   * Calls the identifyPlant endpoint and maps the response to PlantResponse[].
   * Takes the top‑2 by probability.
   */
  // inside your component…

  private identifyPlant(file: File): void {
    this.isLoading = true;
    const form = new FormData();
    form.append('img', file);

    // now subscribe using the (next, error) overload and cast resp to any
    this.drPlantService
      .identifyPlant(form, PlantActionType.Identify)
      .subscribe(
        (resp: any) => {
          // resp.data is your original array
          const raw = resp.data as any[];

          const plants: PlantResponse[] = raw.map((p: any) => ({
            tokenPlant: p.idAccessToken,
            plantId: p.plantId,
            name: p.name,
            description: p.description || '',
            probabilityPercentage: p.probabilityPercentage || '0%',
            imageUrl: p.imageUrl,
            imageUrlSmall: p.imageUrlSmall,
            similarityPercentage: p.similarityPercentage,
          }));

          this.plantDataList = plants
            .sort((a, b) => {
              const pa = parseInt(a.probabilityPercentage.replace('%', ''), 10);
              const pb = parseInt(b.probabilityPercentage.replace('%', ''), 10);
              return pb - pa;
            })
            .slice(0, 2);

          this.isLoading = false;
        },
        (err) => {
          console.error('Identify error:', err);
          this.errorMessage = 'An error occurred while identifying the plant.';
          this.toastr.error(this.errorMessage, 'Error');
          this.isLoading = false;
        }
      );
  }


  /**
   * When the user clicks “Confirm” on a result card:
   * open the modal to save it.
   */
  confirmPlant(plant: PlantResponse | null | undefined): void {
    if (!plant || !plant.tokenPlant || !plant.name) {
      this.errorMessage = 'Missing plant token or name.';
      this.toastr.error(this.errorMessage, 'Error');
      return;
    }
    this.selectedPlantToConfirm = plant;
    this.confirmModal.openModal();
  }

  /**
   * After confirming, save the plant via PlantService, then switch to chat.
   */
  handleModalConfirm(): void {
    if (!this.selectedPlantToConfirm) return;
    const file = this.uploadedFiles.identify!;
    this.plantService
      .savePlantByUser(
        this.selectedPlantToConfirm.tokenPlant,
        this.selectedPlantToConfirm.name,
        file
      )
      .subscribe(
        // next:
        (resp: any) => {
          const id = resp?.data?.id;
          if (!id) {
            this.toastr.error('API response missing plant ID.', 'Error');
            return;
          }
          this.selectedPlantToConfirm!.plantId = id;
          this.chatPlantId = id;
          this.toastr.success('Plant saved successfully!', 'Success');
          this.setSelectedAction('drplant');
        },
        // error:
        (err) => {
          console.error('Save error:', err);
          this.toastr.error('Error saving plant information.', 'Error');
        }
      );
  }
  

  /** Close the confirm modal without action */
  handleModalCancel(): void {
    this.confirmModal.closeModal();
  }
}
