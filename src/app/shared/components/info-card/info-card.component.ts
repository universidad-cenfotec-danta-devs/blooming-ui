import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.css']
})
export class InfoCardComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() buttonLabel: string = '';

  /**
   * This EventEmitter will notify the parent component
   * whenever the button is clicked inside the card.
   */
  @Output() buttonClick = new EventEmitter<void>();

  /**
   * Method triggered by the (click) event on the button,
   * which emits a "buttonClick" event up to the parent.
   */
  onButtonClick(): void {
    this.buttonClick.emit();
  }
}
