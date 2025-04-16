import { Component, ViewChild } from '@angular/core';
import { DrPlantService, PlantActionType } from '../../services/dr-plant.service'; // <-- Import the enum here
import { SHARED_IMPORTS } from '../../shared/shared.module';
import { DrPlantaChatComponent } from '../dr-plant-chat/dr-plant-chat.component';
import { PlantService } from '../../services/plant.service';
import { PlantResponse } from '../../interfaces/plantResponse.interface';
import { Disease } from '../../models/disease.model';
import { CardCarouselComponent } from '../../shared/components/card-carousel/card-carousel';
import { InfoCardComponent } from '../../shared/components/info-card/info-card.component';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-dr-planta',
  imports: [SHARED_IMPORTS, DrPlantaChatComponent, CardCarouselComponent, InfoCardComponent, ModalComponent],
  templateUrl: './dr-plant.component.html',
  styleUrls: ['./dr-plant.component.css'],
  standalone: true
})
export class DrPlantComponent {
  isLoading = false;
  uploadedImages: { [key in 'identify' | 'diagnosis']?: string } = {};
  uploadedFiles: { [key in 'identify' | 'diagnosis']?: File } = {};
  chatPlantId: number | null = null;
  plantDataList: PlantResponse[] = [];
  diseaseDataList: Disease[] = [];
  selectedAction: 'identify' | 'diagnosis' | 'drplant' | null = null;
  errorMessage = '';
  selectedPlantToConfirm: PlantResponse | null = null;

  @ViewChild('confirmModal') confirmModal!: ModalComponent;

  constructor(
    private drPlantService: DrPlantService,
    private plantService: PlantService,
    private toastr: ToastrService
  ) {}

  setSelectedAction(action: 'identify' | 'diagnosis' | 'drplant'): void {
    this.selectedAction = action;
    this.errorMessage = '';
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) return;
    const imageFile = fileInput.files[0];

    if (!imageFile.type.startsWith('image/')) {
      this.errorMessage = 'The selected file is not a valid image (e.g., .jpg, .png).';
      this.toastr.error(this.errorMessage, 'Error');
      return;
    }

    this.errorMessage = '';
    const localUrl = URL.createObjectURL(imageFile);

    if (this.selectedAction === 'identify' || this.selectedAction === 'diagnosis') {
      this.uploadedImages[this.selectedAction] = localUrl;
      this.uploadedFiles[this.selectedAction] = imageFile;

      this.identifyOrDiagnose(imageFile);
    }
  }

  /**
   * Sends the image to the backend using DrPlantService for identification or diagnosis.
   * Converts the string action value to the corresponding enum value.
   */
  private identifyOrDiagnose(imageFile: File): void {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('img', imageFile);

    // Convert the string to the corresponding enum value
    if (this.selectedAction === 'identify' || this.selectedAction === 'diagnosis') {
      const actionType: PlantActionType = this.selectedAction === 'identify'
        ? PlantActionType.Identify
        : PlantActionType.Diagnosis;

      this.drPlantService.identifyPlant(formData, actionType)
        .subscribe({
          next: (response: any) => {
            if (this.selectedAction === 'identify') {
              const plants: PlantResponse[] = response.data.map((plant: any) => ({
                tokenPlant: plant.idAccessToken,
                plantId: plant.plantId,
                name: plant.name,
                description: plant.description || '',
                probabilityPercentage: plant.probabilityPercentage || '0%',
                imageUrl: plant.imageUrl,
                imageUrlSmall: plant.imageUrlSmall,
                similarityPercentage: plant.similarityPercentage
              }));
              const sortedPlants = plants.sort((a, b) => {
                const probA = parseInt((a.probabilityPercentage || '0%').replace('%', ''));
                const probB = parseInt((b.probabilityPercentage || '0%').replace('%', ''));
                return probB - probA;
              });
              this.plantDataList = sortedPlants.slice(0, 2);
            } else if (this.selectedAction === 'diagnosis') {
              let diseases: any[] = [];
              response.data.forEach((item: any) => {
                if (item.diseaseSuggestions) {
                  diseases = diseases.concat(item.diseaseSuggestions);
                }
              });
              diseases.sort((a, b) => b.probability - a.probability);
              this.diseaseDataList = diseases;
            }
            this.isLoading = false;
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = 'An error occurred while processing your request.';
            this.toastr.error(this.errorMessage, 'Error');
            this.isLoading = false;
          }
        });
    }
  }
  /**
   * Called when the user clicks Confirm on a plant card.
   * Instead of immediately saving the plant, this method stores the selected plant and opens the confirmation modal.
   */
  confirmPlant(plant: PlantResponse | null | undefined): void {

    if (!plant || !plant.tokenPlant || !plant.name) {
      this.errorMessage = 'Missing plant token or name.';
      console.error('Error: Missing plant data:', plant);
      this.toastr.error(this.errorMessage, 'Error');
      return;
    }

    this.selectedPlantToConfirm = plant;

    this.confirmModal.openModal();
  }

  /**
   * Handles the modal confirm event.
   * This method is called when the user confirms the action in the modal.
   */
  handleModalConfirm(): void {
    if (!this.selectedPlantToConfirm) {
      this.errorMessage = 'No plant selected for confirmation.';
      this.toastr.error(this.errorMessage, 'Error');
      return;
    }

    if (this.selectedAction !== 'identify' && this.selectedAction !== 'diagnosis') {
      this.errorMessage = 'No image file available for upload in this tab.';
      this.toastr.error(this.errorMessage, 'Error');
      return;
    }

    const file = this.uploadedFiles[this.selectedAction];
    if (!file) {
      this.errorMessage = 'No image file available for upload.';
      this.toastr.error(this.errorMessage, 'Error');
      return;
    }

    this.plantService.savePlantByUser(this.selectedPlantToConfirm.tokenPlant, this.selectedPlantToConfirm.name, file)
      .subscribe({
        next: (resp: any) => {
          if (!resp?.data?.id) {
            this.errorMessage = 'API response is missing plant ID.';
            console.error(this.errorMessage, resp);
            this.toastr.error(this.errorMessage, 'Error');
            return;
          }

          if (this.selectedPlantToConfirm) {
            this.selectedPlantToConfirm.plantId = resp.data.id;
          }
          this.chatPlantId = resp.data.id;

          this.toastr.success('Plant saved successfully!', 'Success');
          this.goToChat();
        },
        error: (err) => {
          console.error('Error saving plant:', err);
          this.errorMessage = 'Error saving plant information.';
          this.toastr.error(this.errorMessage, 'Error');
        }
      });
  }

  /**
   * Handles the modal cancel event.
   * This method is called when the user cancels the action in the modal.
   */
  handleModalCancel(): void {
    this.selectedPlantToConfirm = null;
    this.toastr.info('Action cancelled.', 'Info');
  }

  /**
   * Called when the user clicks Confirm on a disease card.
   * In this simplified flow, it simply switches to chat mode.
   */
  confirmDisease(disease: Disease): void {
    this.goToChat();
  }

  /**
   * Switches to chat mode.
   */
  goToChat(): void {
    this.setSelectedAction('drplant');
  }
}
