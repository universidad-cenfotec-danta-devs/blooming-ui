import { Component, Input, OnInit } from '@angular/core';
import { DrPlantService } from '../../services/dr-plant.service';
import { PlantService } from '../../services/plant.service';
import { WateringPlanService } from '../../services/wateringPlant.service';
import { ToastrService } from 'ngx-toastr';
import { SHARED_IMPORTS } from '../../shared/shared.module';
import { Plant } from '../../interfaces/plant.interface';

@Component({
  selector: 'app-dr-planta-chat',
  templateUrl: './dr-plant-chat.component.html',
  styleUrls: ['./dr-plant-chat.component.css'],
  imports: [SHARED_IMPORTS]
})
export class DrPlantaChatComponent implements OnInit {
  /**
   * Input property from the parent component.
   */
  @Input() plantId: number | null = null;

  plantOptions: Plant[] = [];
  selectedPlantId!: number;
  messages: { text: string; sender: 'user' | 'bot' }[] = [];
  userMessage: string = '';
  isLoading = false;
  wateringPlanId: number | null = null;

  constructor(
    private drPlantService: DrPlantService,
    private plantService: PlantService,
    private wateringPlanService: WateringPlanService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.plantService.getPlantsByUser().subscribe({
      next: (plants: Plant[]) => {
        this.plantOptions = plants;
        if (plants.length > 0) {
          this.selectedPlantId = this.plantId !== null ? this.plantId : plants[0].id!;
        }
      },
      error: (err) => {
        console.error('Error fetching plants:', err);
      }
    });
  }

  sendMessage(): void {
    if (!this.userMessage.trim() || !this.selectedPlantId) return;
    this.messages.push({ text: this.userMessage, sender: 'user' });
    this.isLoading = true;
    this.drPlantService.askPlantQuestion(this.selectedPlantId, this.userMessage).subscribe({
      next: (response: any) => {
        const answer = response.data;
        this.messages.push({ text: answer, sender: 'bot' });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('askPlantQuestion error:', err);
        this.isLoading = false;
      }
    });
    this.userMessage = '';
  }

  /**
   * Calls the WateringPlanService to generate a watering plan for the selected plant.
   * On success, it stores the watering plan id.
   */
  generateWateringPlan(): void {
    if (!this.selectedPlantId) return;
    this.wateringPlanService.generateByUser(this.selectedPlantId).subscribe({
      next: (plan) => {
        this.wateringPlanId = plan.id;
        this.toastr.success('Watering plan generated successfully!');
      },
      error: (err) => {
        console.error('Error generating watering plan:', err);
        this.toastr.error('Error generating watering plan.');
      }
    });
  }

  /**
   * Downloads the PDF of the generated watering plan using its id.
   */
  downloadWateringPlanPDF(): void {
    if (!this.wateringPlanId) {
      this.toastr.error('No watering plan available. Please generate one first.');
      return;
    }
    this.wateringPlanService.generatePDF(this.wateringPlanId).subscribe({
      next: (blob: Blob) => {
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = `watering_plan_${this.wateringPlanId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.toastr.success('PDF downloaded successfully!');
      },
      error: (err) => {
        console.error('Error generating PDF:', err);
        this.toastr.error('Error generating PDF.');
      }
    });
  }
}
