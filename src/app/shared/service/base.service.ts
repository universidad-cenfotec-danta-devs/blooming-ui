import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from '../../interfaces/auth.interfaces';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseService<T> {
  protected source!: string;
  protected http = inject(HttpClient);
  private baseURL = 'http://localhost:8080/';

  public find(id: string | number): Observable<IResponse<T>> {
    return this.http.get<IResponse<T>>(this.baseURL + this.source + '/' + id);
  }

  public findAll(): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(this.source);
  }

  public findAllWithParams(params: any = {}): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>('http://localhost:8080/' + `${this.source}`, {params: this.buildUrlParams(params)});
  }

  public findAllWithParamsAndCustomSource(customUrlSource: string, params: any = {}): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>('http://localhost:8080/' + `${this.source}/${customUrlSource}`, {params: this.buildUrlParams(params)});
  }

  public add(data: {}): Observable<IResponse<T>> {
    return this.http.post<IResponse<T>>('http://localhost:8080/' + this.source, data);
  }

  public addWithParams(params: any = {}, data: {}): Observable<IResponse<T>> {
    return this.http.post<IResponse<T>>(this.source, data, {params: this.buildUrlParams(params)});
  }

  public addCustomSource(customUrlSource: string, data: {}): Observable<IResponse<T>> {
    return this.http.post<IResponse<T>>(this.baseURL+`${this.source}/${customUrlSource}`, data);
  }

  public edit(id: string | undefined, data: {}): Observable<IResponse<T>> {
    return this.http.put<IResponse<T>>('http://localhost:8080/' + `${this.source}` + '/' + id, data);
  }

  public editCustomSource(customUrlSource: string, data: {}): Observable<IResponse<T>> {
    return this.http.put<IResponse<T>>(`http://localhost:8080${customUrlSource ? '/' + customUrlSource: ''}`, data);
  }

  public del(id: any): Observable<IResponse<T>> {
    return this.http.delete<IResponse<T>>(this.source + '/' + id);
  }

  public delCustomSource(customUrlSource: string): Observable<IResponse<T>> {
    return this.http.delete<IResponse<T>>(`http://localhost:8080/${customUrlSource}`);
  }

  public patch(id: string | undefined, data:{}): Observable<IResponse<T>>{
    return this.http.patch<IResponse<T>>(this.baseURL + `${this.source}` + '/' + id, data);
  }

  public patchCustomSource(customUrlSource: string, data?: {}): Observable<IResponse<T>> {
    return this.http.patch<IResponse<T>>(this.baseURL + `${this.source}` + `${customUrlSource ? '/' + customUrlSource: ''}`, data);
  }

  public buildUrlParams (params: any = {}) {
    let queryParams = new HttpParams();
    Object.keys(params).forEach(key => {
      queryParams = queryParams.append(key, params[key]);
    })
    return queryParams;
  }
}
