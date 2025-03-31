import {Injectable} from '@angular/core';
import {environment} from '../../enviroments/enviroment.development';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FloraByZoneService {

  private BACKEND_URL = `${environment.apiUrl2}/api/openAI`;

  constructor(private http: HttpClient) {
  }

  getFloraByCanton(canton: string): Observable<string> {
    const url = `${this.BACKEND_URL}/byLocation/${canton}`;

    return this.http.get<{ message: string; data: string }>(url).pipe(
      map(response => response.data)
    );
  }

}
