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
  @Input() disease!: Disease;
  @Output() buttonClick = new EventEmitter<void>();

  onButtonClick(): void {
    this.buttonClick.emit();
  }
}
