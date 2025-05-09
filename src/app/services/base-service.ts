import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable, inject} from '@angular/core';
import {IResponse} from '../interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class BaseService<T> {
  protected source!: string;
  protected http = inject(HttpClient);

  public find(id: string | number): Observable<IResponse<T>> {
    return this.http.get<IResponse<T>>(this.source + '/' + id);
  }

  public findAll(): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(this.source);
  }

  public findAllWithParams(params: any = {}): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(this.source, {params: this.buildUrlParams(params)});
  }

  public paginated(params: any = {}): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(`${this.source}/paginated`, {params: this.buildUrlParams(params)});
  }

  public getById(objId: number): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(`${this.source}/${objId}`);
  }

  public getByUser(): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(`${this.source}/getByUser`);
  }

  public activate(id: number): Observable<IResponse<any>> {
    return this.http.patch<IResponse<any>>(`${this.source}/activate/${id}`, {});
  }

  public deactivate(id: string | undefined): Observable<IResponse<T[]>> {
    return this.http.patch<IResponse<any>>(`${this.source}/deactivate/${id}`, null);
  }


  public paginatedWithCustomSource(params: any = {}, objId: number, endpoint: string): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(`${this.source}/${endpoint}/${objId}`, {params: this.buildUrlParams(params)});
  }

  public getCustom<R = T>(customUrl: string): Observable<IResponse<R>> {
    return this.http.get<IResponse<R>>(`${this.source}/${customUrl}`);
  }


  public findAllWithParamsAndCustomSource(customUrlSource: string, params: any = {}): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(`${this.source}/${customUrlSource}`, {params: this.buildUrlParams(params)});
  }

  public add(data: {}): Observable<IResponse<T>> {
    return this.http.post<IResponse<T>>(this.source, data);
  }

  public addWithParams(params: any = {}, data: {}): Observable<IResponse<T>> {
    return this.http.post<IResponse<T>>(this.source, data, {params: this.buildUrlParams(params)});
  }

  public addCustomSource(customUrlSource: string, data: {}): Observable<IResponse<T>> {
    return this.http.post<IResponse<T>>(`${this.source}/${customUrlSource}`, data);
  }

  public edit(id: number | undefined, data: {}): Observable<IResponse<T>> {
    return this.http.put<IResponse<T>>(this.source + '/' + id, data);
  }

  public editCustomSource(customUrlSource: string, data: {}): Observable<IResponse<T>> {
    return this.http.patch<IResponse<T>>(`${this.source}${customUrlSource ? '/' + customUrlSource : ''}`, data);
  }

  public updateToThisEndpoint(data: {}): Observable<IResponse<T>> {
    return this.http.patch<IResponse<T>>("http://localhost:8080/users/updateProfile", data);
  }

  public del(id: any): Observable<IResponse<T>> {
    return this.http.delete<IResponse<T>>(this.source + '/' + id);
  }

  public delCustomSource(customUrlSource: string): Observable<IResponse<T>> {
    return this.http.delete<IResponse<T>>(`${this.source}/${customUrlSource}`);
  }

  public buildUrlParams(params: any = {}) {
    let queryParams = new HttpParams();
    Object.keys(params).forEach(key => {
      queryParams = queryParams.append(key, params[key]);
    })
    return queryParams;
  }
}
