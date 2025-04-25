import {Injectable, signal} from '@angular/core';
import {environment} from '../../enviroments/enviroment.development';
import {Observable} from 'rxjs';
import {IEvaluation} from '../interfaces/evaluation.index';
import {BaseService} from './base-service';
import {ISearch} from '../interfaces/search.interfaces';
import {IResponse} from '../interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class EvaluationService extends BaseService<IEvaluation> {

  private BACKEND_URL = `${environment.apiUrl2}/api/evaluations`;
  protected override source: string = `${this.BACKEND_URL}`
  private evaluationsSignal = signal<IEvaluation[]>([]);


  get evaluations() {
    return this.evaluationsSignal;
  }

  public search: ISearch = {
    page: 1,
    size: 5
  }
  public totalItems: any = [];

  getAllPaginatedByType(id: number, endpoint: string) {
    this.paginatedWithCustomSource({
      page: this.search.page,
      size: this.search.size,
      status: true
    }, id, endpoint).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ?? 0}, (_, i) => i + 1);
        this.evaluationsSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }

  deactivateEvaluation(id: string | undefined) {
    return this.deactivate(id);
  }

  activateEvaluation(evaluationId: number) {
    return this.activate(evaluationId);
  }

  getEvaluationsByUser() {
    return this.getByUser();
  }

  getEvaluationById(id: number): Observable<IResponse<IEvaluation[]>> {
    return this.getById(id);
  }

  getAllPaginatedForPot(potId: number) {
    return this.getAllPaginatedByType(potId, "pot");
  }

  getAllPaginatedForNursery(nurseryId: number) {
    return this.getAllPaginatedByType(nurseryId, "nursery");
  }


  saveEvaluation(evaluation: IEvaluation, objType: string) {
    let sourceType = '';

    if (objType === 'pot') {
      sourceType = 'forPot';
    } else if (objType === 'nursery') {
      sourceType = 'forNursery';
    }

    this.addCustomSource(sourceType, evaluation).subscribe({
      next: (response: any) => {
        console.log("evaluation save as: " + response);
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }

  saveNurseryEvaluation(evaluation: IEvaluation) {
    this.addCustomSource('forNursery', evaluation).subscribe({
      next: (response: any) => {
        //  this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        console.log("evaluation save as: " + response);
      },
      error: (err: any) => {
        //  this.alertService.displayAlert('error', 'An error occurred while adding the user', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }


}
