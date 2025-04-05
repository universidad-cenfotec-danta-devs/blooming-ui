import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment.development';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Plant } from '../interfaces/plant.interface';

/**
 * Interface for a plant identified (or saved) by the backend.
 */


@Injectable({
  providedIn: 'root'
})
export class PlantService {
  private BACKEND_URL = `${environment.apiUrl}/api/plant`;

  constructor(private http: HttpClient) {}

  /**
   * Saves a plant for the current user.
   * Calls the endpoint: POST /api/plant/saveByUser/{tokenPlant}/{plantName}
   *
   * @param tokenPlant - The plant token.
   * @param plantName - The name of the plant.
   * @returns An Observable that emits the saved Plant data.
   */
  savePlantByUser(tokenPlant: string, plantName: string, img: File): Observable<Plant> {
    const encodedPlantName = encodeURIComponent(plantName);
    const url = `${this.BACKEND_URL}/saveByUser/${tokenPlant}/${encodedPlantName}`;
  
    const formData = new FormData();
    formData.append('img', img);
  
    return this.http.post<Plant>(url, formData);
  }
  
  

  /**
   * Saves a plant by admin.
   * Calls the endpoint: POST /api/plant/saveByAdmin/{plantName}/{userEmail}/{tokenPlant}
   *
   * @param plantName - The name of the plant.
   * @param userEmail - The email of the user.
   * @param tokenPlant - The plant token.
   * @returns An Observable that emits the saved Plant data.
   */
  savePlantByAdmin(plantName: string, userEmail: string, tokenPlant: string): Observable<Plant> {
    const url = `${this.BACKEND_URL}/saveByAdmin/${plantName}/${userEmail}/${tokenPlant}`;
    return this.http.post<Plant>(url, {});
  }

  /**
   * Fetches the plants for the current user.
   * Calls the endpoint: GET /api/plant/getPlantsByUser?page={page}&size={size}
   *
   * @param page - The page number.
   * @param size - The number of items per page.
   * @returns An Observable that emits an array of Plant.
   */
  getPlantsByUser(page: number = 0, size: number = 10): Observable<Plant[]> {
    const url = `${this.BACKEND_URL}/getPlantsByUser?page=${page}&size=${size}`;
    return this.http.get<any>(url).pipe(
      map(response => response.data as Plant[])
    );
  }

  /**
   * Fetches the plants for a given user (admin view).
   * Calls the endpoint: GET /api/plant/getPlantsByUserAdmin/{userEmail}?page={page}&size={size}
   *
   * @param userEmail - The email of the user.
   * @param page - The page number.
   * @param size - The number of items per page.
   * @returns An Observable that emits an array of Plant.
   */
  getPlantsByUserAdmin(userEmail: string, page: number = 1, size: number = 10): Observable<Plant[]> {
    const url = `${this.BACKEND_URL}/getPlantsByUserAdmin/${userEmail}?page=${page}&size=${size}`;
    return this.http.get<any>(url).pipe(
      map(response => response.data as Plant[])
    );
  }

  /**
   * Activates a plant.
   * Calls the endpoint: PATCH /api/plant/activate/{id}
   *
   * @param plantId - The ID of the plant to activate.
   * @returns An Observable that emits the backend response.
   */
  activatePlant(plantId: number): Observable<any> {
    const url = `${this.BACKEND_URL}/activate/${plantId}`;
    return this.http.patch(url, {});
  }

  /**
   * Deactivates a plant.
   * Calls the endpoint: PATCH /api/plant/deactivate/{id}
   *
   * @param plantId - The ID of the plant to deactivate.
   * @returns An Observable that emits the backend response.
   */
  deactivatePlant(plantId: number): Observable<any> {
    const url = `${this.BACKEND_URL}/deactivate/${plantId}`;
    return this.http.patch(url, {});
  }
}
