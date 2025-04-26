import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Disease } from '../../../models/disease.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-disease-card',
  standalone: true,
  imports: [CommonModule,TranslateModule],
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
