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
  /**
   * Input property from the parent component.
   * This may be null if not provided.
   */
  @Input() plantId: number | null = null;

  /**
   * Array holding the plants fetched for the current user.
   */
  plantOptions: Plant[] = [];

  /**
   * The plant ID selected for the chat.
   * This is guaranteed to be a number.
   */
  selectedPlantId!: number;

  /**
   * Array to store chat messages between the user and the bot.
   */
  messages: { text: string; sender: 'user' | 'bot' }[] = [];

  /**
   * The current message entered by the user.
   */
  userMessage: string = '';

  /**
   * Indicates whether the chat is waiting for a response.
   */
  isLoading = false;

  constructor(
    private drPlantService: DrPlantService,
    private plantService: PlantService
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Fetches the list of plants associated with the current user.
   * If a plantId is provided by the parent, it uses that value;
   * otherwise, it defaults to the first plant's idAccessToken.
   */
  ngOnInit(): void {
    this.plantService.getPlantsByUser().subscribe({
      next: (plants: Plant[]) => {
        this.plantOptions = plants;
        if (plants.length > 0) {
          // Use the provided plantId if it's not null; otherwise, use the first plant's idAccessToken.
          if (this.plantId !== null) {
            this.selectedPlantId = this.plantId;
          } else {
            this.selectedPlantId = plants[0].idAccessToken!;
          }
        }
      },
      error: (err) => {
        console.error('Error fetching plants:', err);
      }
    });
  }

  /**
   * Sends the user's message to the backend and adds both user and bot responses to the chat.
   */
  sendMessage(): void {
    if (!this.userMessage.trim() || !this.selectedPlantId) return;

    // Add user's message to chat
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

    // Clear the user's input message
    this.userMessage = '';
  }
}
