import {Component, inject, OnInit} from '@angular/core';

import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {ModalService} from '../../services/modal.service';
import {EvaluationService} from '../../services/evaluation.service';
import {IEvaluation} from '../../interfaces/evaluation.index';
import {EvaluationListComponent} from '../../features/evaluations/evaluation-list/evaluation-list.component';
import {LoaderComponent} from '../../features/loader/loader.component';
import {SHARED_IMPORTS} from '../../shared/shared.module';
import {PaginationComponent} from '../../features/pagination/pagination.component';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {EvaluationFormComponent} from '../../features/evaluations/evaluation-form/evaluation-form.component';

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [
    EvaluationListComponent,
    LoaderComponent,
    SHARED_IMPORTS,
    PaginationComponent,
    EvaluationFormComponent
  ],
  templateUrl: './evaluation.component.html',
  styleUrl: './evaluation.component.scss'
})
export class EvaluationComponent implements OnInit {
  public evaluationService: EvaluationService = inject(EvaluationService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  public modalService: ModalService = inject(ModalService);
  public authService: AuthService = inject(AuthService);
  public fb: FormBuilder = inject(FormBuilder);
  public showForm = false;
  private objId: string = '';
  private objType: string = '';

  evaluationForm = this.fb.group({
    comment: [''],
    rating: ['', Validators.required],
    anonymous: [false]
  })

  constructor() {
    this.evaluationService.search.page = 1;
  }

  ngOnInit(): void {
    this.objType = this.route.snapshot.params['objType'];
    this.objId = this.route.snapshot.params['objId'];
    this.evaluationService.getAllPaginatedByType(Number(this.objId), this.objType);
  }

  public deactivate(evaluation: IEvaluation) {
    this.evaluationService.deactivateEvaluation(evaluation.id).subscribe({
      next: () => {
        this.evaluationService.getAllPaginatedByType(Number(this.objId), this.objType);
      },
      error: (err) => {
        console.error('Error al desactivar evaluación', err);
      }
    });
  }

  getObjId() {
    return Number(this.objId);
  }

  getObjType() {
    return this.objType;
  }

  save(item: IEvaluation) {
    this.evaluationService.saveEvaluation(item, this.getObjType());
    this.modalService.closeAll();
  }

}
