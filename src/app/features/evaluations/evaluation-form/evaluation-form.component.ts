import {CommonModule} from '@angular/common';
import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {IEvaluation} from '../../../interfaces/evaluation.index';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-evaluation-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TranslatePipe
  ],
  templateUrl: './evaluation-form.component.html',
  styleUrl: './evaluation-form.component.scss'
})
export class EvaluationFormComponent implements OnInit {
  public fb: FormBuilder = inject(FormBuilder);
  protected translate: TranslateService = inject(TranslateService);
  protected toastService: ToastrService = inject(ToastrService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  @Input() evaluationForm!: FormGroup;
  @Output() callSaveMethod: EventEmitter<IEvaluation> = new EventEmitter<IEvaluation>();
  @Output() goBack: EventEmitter<void> = new EventEmitter<void>();
  private objId: string = '';
  private objType: string = '';

  ngOnInit(): void {
    this.objType = this.route.snapshot.params['objType'];
    this.objId = this.route.snapshot.params['objId'];
  }

  callSave() {
    let item: IEvaluation = {
      rating: this.evaluationForm.controls['rating'].value,
      comment: this.evaluationForm.controls['comment'].value,
      objToEvaluateId: Number(this.objId),
      anonymous: this.evaluationForm.controls['anonymous'].value
    }
    this.callSaveMethod.emit(item);
    this.evaluationForm.reset();
    this.toastService.success(this.translate.instant('EVALUATION.BUTTON_MAKE_MSG_SUCCESS'));
  }

  onGoBack() {
    this.goBack.emit();
  }
}
