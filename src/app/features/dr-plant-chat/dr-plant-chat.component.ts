import { Component, Input, OnInit } from '@angular/core';
import { DrPlantService } from '../../services/dr-plant.service';
import { PlantService } from '../../services/plant.service';
import { WateringPlanService } from '../../services/wateringPlant.service';
import { ToastrService } from 'ngx-toastr';
import { SHARED_IMPORTS } from '../../shared/shared.module';
import { Plant } from '../../interfaces/plant.interface';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  senderName: string;
}

@Component({
  selector: 'app-dr-planta-chat',
  templateUrl: './dr-plant-chat.component.html',
  styleUrls: ['./dr-plant-chat.component.css'],
  imports: [SHARED_IMPORTS]
})
export class DrPlantaChatComponent implements OnInit {
  @Input() plantId: number | null = null;

  plantOptions: Plant[] = [];
  selectedPlantId!: number;
  messages: ChatMessage[] = [];
  userMessage = '';
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
          this.selectedPlantId = this.plantId ?? plants[0].id!;
        }
      },
      error: (err) => {
        console.error('Error fetching plants:', err);
      }
    });
  }

  sendMessage(): void {
    const text = this.userMessage.trim();
    if (!text || !this.selectedPlantId) return;

    // push user message with timestamp and senderName
    this.messages.push({
      text,
      sender: 'user',
      timestamp: new Date(),
      senderName: 'You'
    });

    this.isLoading = true;
    this.drPlantService
      .askPlantQuestion(this.selectedPlantId, text)
      .subscribe({
        next: (response: any) => {
          const answer = response.data;
          // push bot reply with timestamp and senderName
          this.messages.push({
            text: answer,
            sender: 'bot',
            timestamp: new Date(),
            senderName: 'Dr. Plant'
          });
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
