import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Disease } from '../../../models/disease.model';

@Component({
  selector: 'app-disease-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './disease.component.html',
  styleUrls: ['./disease.component.css']
})
export class DiseaseCardComponent {
  // Input property to receive the disease object.
  @Input() disease!: Disease;
  // Output event emitter for when the confirm button is clicked.
  @Output() buttonClick = new EventEmitter<void>();

  // Method to emit the click event.
  onButtonClick(): void {
    this.buttonClick.emit();
  }
}
