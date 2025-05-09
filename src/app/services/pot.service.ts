import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment.development';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PotRequest } from '../interfaces/potRequest.interface';
import { Pot } from '../interfaces/pot.interface';

@Injectable({
  providedIn: 'root'
})
export class PotService {
  private BACKEND_URL = `${environment.apiUrl}/api/pot`;

  constructor(private http: HttpClient) {}

  /**
   * Uploads a pot along with its associated 3D file.
   * Calls the endpoint: POST /api/pot
   *
   * The API expects a multipart request where:
   * - The pot details are sent as JSON (key: "potRequest")
   * - The 3D file is sent as a file under the key "3dFile"
   *
   * @param potRequest - The request object containing pot details.
   * @param pot3dFile - The 3D file to be uploaded.
   * @returns An Observable emitting the registered PotDTO.
   */
  uploadPot(potRequest: PotRequest, pot3dFile: File): Observable<Pot> {
    const url = `${this.BACKEND_URL}`;
    const formData = new FormData();
  
    formData.append('potRequest', new Blob(
      [JSON.stringify(potRequest)], 
      { type: 'application/json' }
    ));
  
    formData.append('3dFile', pot3dFile);
  
    return this.http.post<any>(url, formData).pipe(
      map(response => response.data as Pot)
    );
  }
  

  /**
   * Retrieves a paginated list of pots.
   * Calls the endpoint: GET /api/pot?page={page}&size={size}
   *
   * @param page - The page number (default is 0).
   * @param size - The number of items per page (default is 10).
   * @returns An Observable emitting an array of PotDTO.
   */
  getPots(page: number = 0, size: number = 10): Observable<Pot[]> {
    const url = `${this.BACKEND_URL}?page=${page}&size=${size}`;
  
    return this.http.get<any>(url).pipe(
      tap((response) => {
        console.log('[PotService] getPots response:', response);
      }),
      map((response) => response.data as Pot[])
    );
  }


  /**
 * Retrieves a paginated list of pots created by the **logged-in designer**.
 * Sends the current JWT in the Authorization header so the back-end can
 *
 * @param page   0-based page index (default 0)
 * @param size   items per page      (default 10)
 * @param active if true, only active pots; if false, only inactive
 * @returns      Observable<Pot[]>
 */
getPotsByDesigner(
  page   : number = 0,
  size   : number = 10,
  active : boolean = true
): Observable<Pot[]> {

  const url = `${this.BACKEND_URL}/byDesigner`
            + `?page=${page}&size=${size}&status=${active}`;

  /* Inject the stored JWT from localStorage (or wherever you keep it) */
  const token  = localStorage.getItem('token') ?? '';
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  return this.http.get<any>(url).pipe(
    tap((response) => {
      console.log('[PotService] getPots response:', response);
    }),
    map((response) => response.data as Pot[])
  );
}
}