import { Component, ViewChild } from '@angular/core';
import { DrPlantService } from '../../services/dr-plant.service';
import { SHARED_IMPORTS } from '../../shared/shared.module';
import { DrPlantaChatComponent } from '../dr-plant-chat/dr-plant-chat.component';
import { PlantService } from '../../services/plant.service';
import { PlantResponse } from '../../interfaces/plantResponse.interface';
import { Disease } from '../../models/disease.model';
import { CardCarouselComponent } from '../../shared/components/card-carousel/card-carousel';
import { InfoCardComponent } from '../../shared/components/info-card/info-card.component';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from '../../shared/components/modal/modal.component'; // Asegúrate de tener la ruta correcta

@Component({
  selector: 'app-dr-planta',
  imports: [SHARED_IMPORTS, DrPlantaChatComponent, CardCarouselComponent, InfoCardComponent, ModalComponent],
  templateUrl: './dr-plant.component.html',
  styleUrls: ['./dr-plant.component.css'],
  standalone: true
})
export class DrPlantComponent {
  // Loading indicator
  isLoading = false;

  // Stores the local preview URL for each tab (identify and diagnosis)
  uploadedImages: { [key in 'identify' | 'diagnosis']?: string } = {};

  // Stores the actual File object uploaded by the user for each tab
  uploadedFiles: { [key in 'identify' | 'diagnosis']?: File } = {};

  // The plant/disease ID for chat
  chatPlantId: number | null = null;

  /**
   * For identify mode: list of plant responses.
   */
  plantDataList: PlantResponse[] = [];

  /**
   * For diagnosis mode: list of disease suggestions.
   */
  diseaseDataList: Disease[] = [];

  /**
   * Current action/tab:
   * - 'identify': Identify a plant
   * - 'diagnosis': Diagnose a plant
   * - 'drplant': Chat with Dr. Plant
   */
  selectedAction: 'identify' | 'diagnosis' | 'drplant' | null = null;

  /**
   * Holds any error messages to be displayed.
   */
  errorMessage = '';

  /**
   * Variable to hold the plant selected for confirmation.
   */
  selectedPlantToConfirm: PlantResponse | null = null;

  // Referencia al componente modal para abrirlo desde el TS.
  @ViewChild('confirmModal') confirmModal!: ModalComponent;

  constructor(
    private drPlantService: DrPlantService,
    private plantService: PlantService,
    private toastr: ToastrService
  ) {}

  /**
   * Sets the selected action (tab) and resets error messages.
   */
  setSelectedAction(action: 'identify' | 'diagnosis' | 'drplant'): void {
    this.selectedAction = action;
    this.errorMessage = '';
  }

  /**
   * Handles file selection, validates the file, stores a preview URL,
   * and saves the File object for later use in confirmPlant().
   */
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) return;

    const imageFile = fileInput.files[0];

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      this.errorMessage = 'The selected file is not a valid image (e.g., .jpg, .png).';
      this.toastr.error(this.errorMessage, 'Error');
      return;
    }

    this.errorMessage = '';
    const localUrl = URL.createObjectURL(imageFile);

    if (this.selectedAction === 'identify' || this.selectedAction === 'diagnosis') {
      // Store the preview URL and the file for later use
      this.uploadedImages[this.selectedAction] = localUrl;
      this.uploadedFiles[this.selectedAction] = imageFile;

      // Immediately call identifyOrDiagnose
      this.identifyOrDiagnose(imageFile);
    }
  }

  /**
   * Sends the image to the backend using DrPlantService for identification or diagnosis.
   */
  private identifyOrDiagnose(imageFile: File): void {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('img', imageFile);

    this.drPlantService.identifyPlant(formData, this.selectedAction as 'identify' | 'diagnosis')
      .subscribe({
        next: (response: any) => {
          console.log('Backend response:', response);

          if (this.selectedAction === 'identify') {
            const plants: PlantResponse[] = response.data.map((plant: any) => ({
              tokenPlant: plant.idAccessToken,
              plantId: plant.plantId, // May be undefined from API; we adapt later
              name: plant.name,
              description: plant.description || '',
              probabilityPercentage: plant.probabilityPercentage || '0%',
              imageUrl: plant.imageUrl,
              imageUrlSmall: plant.imageUrlSmall,
              similarityPercentage: plant.similarityPercentage
            }));

            // Sort plants by probability
            const sortedPlants = plants.sort((a, b) => {
              const probA = parseInt((a.probabilityPercentage || '0%').replace('%', ''));
              const probB = parseInt((b.probabilityPercentage || '0%').replace('%', ''));
              return probB - probA;
            });

            // Keep top 2 results
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
            console.log(this.diseaseDataList);
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

  /**
   * Called when the user clicks Confirm on a plant card.
   * Instead of immediately saving the plant, this method stores the selected plant and opens the confirmation modal.
   */
  confirmPlant(plant: PlantResponse | null | undefined): void {
    console.log('Plant selected:', plant);

    if (!plant || !plant.tokenPlant || !plant.name) {
      this.errorMessage = 'Missing plant token or name.';
      console.error('Error: Missing plant data:', plant);
      this.toastr.error(this.errorMessage, 'Error');
      return;
    }

    // Store the plant to be confirmed.
    this.selectedPlantToConfirm = plant;

    // Open the confirmation modal.
    // (Ensure in your template you have a reference variable "#confirmModal" on the modal component.)
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

    // Retrieve the file previously uploaded for the current action.
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

    // Call the service to save the plant using the stored file.
    this.plantService.savePlantByUser(this.selectedPlantToConfirm.tokenPlant, this.selectedPlantToConfirm.name, file)
      .subscribe({
        next: (resp: any) => {
          console.log("Backend response:", resp);
          // Check that the backend returns a plant ID in resp.data.id
          if (!resp?.data?.id) {
            this.errorMessage = 'API response is missing plant ID.';
            console.error(this.errorMessage, resp);
            this.toastr.error(this.errorMessage, 'Error');
            return;
          }
          // Map the numeric ID to our plant object and update chatPlantId
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
