import { Component } from '@angular/core';
import { DrPlantService } from '../../services/dr-plant.service';
import { SHARED_IMPORTS } from '../../shared/shared.module';
import { DrPlantaChatComponent } from "../dr-plant-chat/dr-plant-chat.component";

@Component({
  selector: 'app-dr-planta',
  imports: [SHARED_IMPORTS, DrPlantaChatComponent],
  templateUrl: './dr-plant.component.html',
  styleUrls: ['./dr-plant.component.css']
})
export class DrPlantComponent {
  isLoading = false;

  /**
   * Stores the uploaded image URL to display on screen.
   */
  uploadedImageUrl: string | null = null;

  /**
   * List of identified plants. Each object has { name, description }.
   */
  plantDataList: { name: string; description: string }[] = [];

  constructor(private drPlantService: DrPlantService) {}

  /**
   * Triggered when the user selects a file from the input.
   * Creates a local URL to show the image, then calls the identification method.
   */
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) return;

    const imageFile = fileInput.files[0];

    // Create a local URL so we can display the uploaded image in the template
    this.uploadedImageUrl = URL.createObjectURL(imageFile);

    // Identify the plant (mock or real API)
    this.identifyPlant(imageFile);
  }

  /**
   * Simulates or calls the API to identify the plant.
   * In this example, we return two mock plants after a delay.
   */
  private identifyPlant(imageFile: File) {
    this.isLoading = true;

    // SIMULATED: returning two plants after 2 seconds
    setTimeout(() => {
      this.plantDataList = [
        {
          name: 'Nombre de planta 1',
          description: 'Descripción de la planta 1: cuidados, riego, luz, etc.'
        },
        {
          name: 'Nombre de planta 2',
          description: 'Descripción de la planta 2: cuidados, riego, luz, etc.'
        }
      ];
      this.isLoading = false;
    }, 2000);

    /**
     * REAL API EXAMPLE (if you want to integrate DrPlantService):
     * 
     * const formData = new FormData();
     * formData.append('image', imageFile);
     * 
     * this.drPlantService.identifyPlant(formData).subscribe(response => {
     *   // Suppose the API returns an array of identified plants
     *   this.plantDataList = response; 
     *   // Or if the API returns a single plant, push it into plantDataList
     *   // this.plantDataList = [response];
     *   this.isLoading = false;
     * });
     */
  }
}
