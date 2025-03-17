import { Component, Input, OnInit } from '@angular/core';
import { DrPlantService } from '../../services/dr-plant.service';
import { PlantService } from '../../services/plant.service';
import { SHARED_IMPORTS } from '../../shared/shared.module';
import { Plant } from '../../interfaces/plant.interface';

@Component({
  selector: 'app-dr-planta-chat',
  templateUrl: './dr-plant-chat.component.html',
  styleUrls: ['./dr-plant-chat.component.css'],
  imports: [SHARED_IMPORTS]
})
export class DrPlantaChatComponent implements OnInit {
  // Add this Input property to allow binding from the parent.
  @Input() plantId: number | null = null;

  plantOptions: Plant[] = [];
  selectedPlantId!: number;
  messages: { text: string; sender: 'user' | 'bot' }[] = [];
  userMessage: string = '';
  isLoading = false;

  constructor(
    private drPlantService: DrPlantService,
    private plantService: PlantService
  ) {}

  ngOnInit(): void {
    this.plantService.getPlantsByUser().subscribe({
      next: (plants: Plant[]) => {
        this.plantOptions = plants;
        if (plants.length > 0) {
          // If plantId is provided by parent, use it; otherwise default to first.
          this.selectedPlantId = this.plantId || plants[0].id;
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
      next: (response: string) => {
        this.messages.push({ text: response, sender: 'bot' });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('askPlantQuestion error:', err);
        this.isLoading = false;
      }
    });

    this.userMessage = '';
  }
}
