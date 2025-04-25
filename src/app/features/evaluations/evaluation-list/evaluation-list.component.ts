import {Component, Input, Output, EventEmitter} from '@angular/core';
import {IEvaluation} from '../../../interfaces/evaluation.index';
import {TranslatePipe} from '@ngx-translate/core';
import {DatePipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-evaluation-list',
  standalone: true,
  templateUrl: './evaluation-list.component.html',
  imports: [
    TranslatePipe,
    DatePipe,
    NgIf
  ],
  styleUrl: './evaluation-list.component.scss'
})
export class EvaluationListComponent {
  @Input() evaluations: IEvaluation[] = [];
  @Output() callDeactivateMethod: EventEmitter<IEvaluation> = new EventEmitter<IEvaluation>();
  @Input() isDesignerOrNurseryAdmin!: boolean;
}
