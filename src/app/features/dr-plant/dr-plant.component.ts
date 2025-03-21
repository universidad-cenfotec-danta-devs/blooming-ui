import { Component } from '@angular/core';
import { DrPlantService } from '../../services/dr-plant.service';
import { SHARED_IMPORTS } from '../../shared/shared.module';
import { DrPlantaChatComponent } from '../dr-plant-chat/dr-plant-chat.component';
import { PlantService } from '../../services/plant.service';
import { PlantResponse } from '../../interfaces/plantResponse.interface';

@Component({
  selector: 'app-dr-planta',
  imports: [SHARED_IMPORTS, DrPlantaChatComponent],
  templateUrl: './dr-plant.component.html',
  styleUrls: ['./dr-plant.component.css']
})
export class DrPlantComponent {
  isLoading = false;
  uploadedImageUrl: string | null = null;
  // Stores the plant id for chat (set after diagnosis)
  chatPlantId: number | null = null;

  /**
   * Stores the returned plant information or diagnosis.
   */
  plantDataList: PlantResponse[] = [];

  /**
   * selectedAction can be one of:
   *  - 'identify': Identify a plant
   *  - 'diagnosis': Diagnose a plant
   *  - 'drplant': Ask Dr. Plant (activates the chat)
   */
  selectedAction: 'identify' | 'diagnosis' | 'drplant' | null = null;

  /**
   * Used to display an error message if the file is invalid or if the request fails.
   */
  errorMessage = '';

  constructor(private drPlantService: DrPlantService , private plantService : PlantService) {}

  /**
   * Sets the selected action and resets previous data and errors.
   * When switching to non-chat modes, also clears the chatPlantId.
   */
  setSelectedAction(action: 'identify' | 'diagnosis' | 'drplant'): void {
    this.selectedAction = action;
    this.errorMessage = '';
    this.uploadedImageUrl = null;
    if (action !== 'drplant') {
      this.plantDataList = [];
      this.chatPlantId = null;
    }
  }

  /**
   * Triggered when the user selects an image file.
   * If the action is 'identify' or 'diagnosis', it sends the file to the backend.
   */
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) return;

    const imageFile = fileInput.files[0];

    // Basic validation: check if the file is an image.
    if (!imageFile.type.startsWith('image/')) {
      this.errorMessage = 'The selected file is not a valid image (e.g., .jpg, .png).';
      return;
    }

    // Clear any previous error.
    this.errorMessage = '';

    // Create a local URL to display the image immediately.
    this.uploadedImageUrl = URL.createObjectURL(imageFile);

    // If the user chose "Identify" or "Diagnosis", call the backend.
    if (this.selectedAction === 'identify' || this.selectedAction === 'diagnosis') {
      this.identifyOrDiagnose(imageFile);
    }
  }

  /**
   * Sends the image to the backend using DrPlantService.
   * The service is passed a parameter indicating whether the request is for "identify" or "diagnosis"
   * so it can use the correct endpoint.
   */
  private identifyOrDiagnose(imageFile: File): void {
    this.isLoading = true;

    // Create FormData and append the image.
    const formData = new FormData();
    formData.append('img', imageFile);

    // Call the service with the action type.
    this.drPlantService.identifyPlant(formData, this.selectedAction as 'identify' | 'diagnosis')
      .subscribe({
        next: (response) => {
          // Store the returned data.
          this.plantDataList = response;
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
 * Called when the user clicks the Confirm button in an InfoCard.
 * Sends the plant name and token to the backend and, on success,
 * displays a confirmation message and switches to chat mode with the saved plant id.
 */
confirmPlant(plant: PlantResponse): void {
  // Verify that the necessary data is available.
  if (!plant.tokenPlant || !plant.name) {
    this.errorMessage = 'Missing plant token or name.';
    return;
  }
  // Call the backend service to save the plant for the current user.
  this.plantService.savePlantByUser(plant.tokenPlant, plant.name)
    .subscribe({
      next: (savedPlant) => {
        // Show a confirmation message to the user.
        alert('Plant saved successfully!');
        // Set the chatPlantId to the saved plant's id.
        this.chatPlantId = savedPlant.id;
        // Redirect to chat mode by calling goToChat().
        this.goToChat();
      },
      error: (err) => {
        console.error('Error saving plant:', err);
        this.errorMessage = 'Error saving plant information.';
      }
    });
}


  /**
   * Activates the 'drplant' mode.
   * If the current action is 'diagnosis' and a plant was identified,
   * the first plant's id is stored for use in the chat.
   * This hides the file upload UI and shows the chat component.
   */
  goToChat(): void {
    if (this.selectedAction === 'diagnosis' && this.plantDataList.length > 0 && this.plantDataList[0].id) {
      this.chatPlantId = this.plantDataList[0].id;
    }
    this.setSelectedAction('drplant');
  }
}
