import { Component } from '@angular/core';
import { DrPlantService } from '../../services/dr-plant.service';
import { SHARED_IMPORTS } from '../../shared/shared.module';
import { DrPlantaChatComponent } from '../dr-plant-chat/dr-plant-chat.component';
import { PlantService } from '../../services/plant.service';
import { PlantResponse } from '../../interfaces/plantResponse.interface';
import { Disease } from '../../models/disease.model';
import { CardCarouselComponent } from '../../shared/components/card-carousel/card-carousel';
import { InfoCardComponent } from '../../shared/components/info-card/info-card.component';

@Component({
  selector: 'app-dr-planta',
  // Ensure you import all standalone components used in the template
  imports: [SHARED_IMPORTS, DrPlantaChatComponent, CardCarouselComponent, InfoCardComponent],
  templateUrl: './dr-plant.component.html',
  styleUrls: ['./dr-plant.component.css'],
  standalone: true
})
export class DrPlantComponent {
  // Loading indicator
  isLoading = false;
  // Stores the uploaded image URL for each tab (identify and diagnosis)
  uploadedImages: { [key in 'identify' | 'diagnosis']?: string } = {};
  // Stores the plant/disease id for chat (set after confirmation)
  chatPlantId: string | null = null;

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

  constructor(
    private drPlantService: DrPlantService,
    private plantService: PlantService
  ) {}

  /**
   * Sets the selected action (tab) and resets error messages.
   * We no longer clear plant/disease data so that if a user returns
   * to a tab, the previous results remain.
   *
   * @param action The selected action ('identify', 'diagnosis', or 'drplant').
   */
  setSelectedAction(action: 'identify' | 'diagnosis' | 'drplant'): void {
    this.selectedAction = action;
    this.errorMessage = '';
  }

  /**
   * Handles file selection, validates the file, and stores a local preview URL.
   * Then calls the backend to process the image.
   *
   * @param event The file input change event.
   */
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) return;

    const imageFile = fileInput.files[0];

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      this.errorMessage = 'The selected file is not a valid image (e.g., .jpg, .png).';
      return;
    }

    this.errorMessage = '';
    const localUrl = URL.createObjectURL(imageFile);
    if (this.selectedAction === 'identify' || this.selectedAction === 'diagnosis') {
      this.uploadedImages[this.selectedAction] = localUrl;
      this.identifyOrDiagnose(imageFile);
    }
  }

  /**
   * Sends the image to the backend using DrPlantService.
   * Maps the API response to either PlantResponse (identify mode) or Disease (diagnosis mode).
   *
   * @param imageFile The image file to process.
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
            console.log(response);
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
          this.isLoading = false;
        }
      });
  }

  /**
   * Called when the user clicks Confirm on a plant card.
   * Sends the plant token and name to the backend to save the plant.
   *
   * @param plant The PlantResponse selected.
   */
  confirmPlant(plant: PlantResponse): void {
    if (!plant.tokenPlant || !plant.name) {
      this.errorMessage = 'Missing plant token or name.';
      return;
    }
    this.plantService.savePlantByUser(plant.tokenPlant, plant.name)
      .subscribe({
        next: (savedPlant) => {
          alert('Plant saved successfully!');
          this.chatPlantId = savedPlant.tokenPlant;
          this.goToChat();
        },
        error: (err) => {
          console.error('Error saving plant:', err);
          this.errorMessage = 'Error saving plant information.';
        }
      });
  }

  /**
   * Called when the user clicks Confirm on a disease card.
   * In this simplified flow, it only opens chat using the disease id.
   *
   * @param disease The Disease selected.
   */
  confirmDisease(disease: Disease): void {
    this.chatPlantId = disease.id;
    this.goToChat();
  }

  /**
   * Switches to chat mode. In diagnosis mode, uses the first disease's id.
   */
  goToChat(): void {
    if (this.selectedAction === 'diagnosis' && this.diseaseDataList.length > 0) {
      this.chatPlantId = this.diseaseDataList[0].id;
    }
    this.setSelectedAction('drplant');
  }
}
