import { Component } from '@angular/core';
import { DrPlantService } from '../../services/dr-plant.service';
import { SHARED_IMPORTS } from '../../shared/shared.module';

/**
 * DrPlantaChatComponent - Displays a chat interface with Dr. Planta.
 * 
 * Features:
 * - Sends the user's message to DrPlantService.
 * - Receives a single mock response from the service.
 * - Shows user and bot messages in a scrollable chat container.
 */
@Component({
  selector: 'app-dr-planta-chat',
  templateUrl: './dr-plant-chat.component.html',
  styleUrls: ['./dr-plant-chat.component.css'],
  imports:[SHARED_IMPORTS]
})
export class DrPlantaChatComponent {
  messages: { text: string; sender: 'user' | 'bot' }[] = [];
  userMessage: string = '';
  isLoading = false;

  constructor(private drPlantService: DrPlantService) {}

  /**
   * Triggered when user clicks "Send" or presses Enter.
   */
  sendMessage(): void {
    if (!this.userMessage.trim()) return;

    // Add the user's message to the chat
    this.messages.push({ text: this.userMessage, sender: 'user' });

    // Show a loading indicator (optional)
    this.isLoading = true;

    // Call DrPlantService to get a mock or real response
    this.drPlantService.chatWithPlant(this.userMessage).subscribe({
      next: (response: string) => {
        // Add bot response to the chat
        this.messages.push({ text: response, sender: 'bot' });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('chatWithPlant error:', err);
        this.isLoading = false;
      }
    });

    // Clear the input field
    this.userMessage = '';
  }
}
