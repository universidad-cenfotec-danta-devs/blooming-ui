import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment.development';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// Import or define the necessary interfaces according to your implementation
import { WateringPlan } from '../interfaces/wateringPlan.interface';
import { WateringDay } from  '../interfaces/wateringDay.interface';

@Injectable({
  providedIn: 'root'
})
export class WateringPlanService {
  // Base URL for the wateringPlan endpoints.
  private BACKEND_URL = `${environment.apiUrl}/api/wateringPlan`;

  constructor(private http: HttpClient) {}

  /**
   * Generates a watering plan for the current user.
   * Calls the endpoint: POST /api/wateringPlan/generateByUser/{plantId}
   *
   * @param plantId - The ID of the plant.
   * @returns An Observable emitting the generated watering plan.
   */
  generateByUser(plantId: number): Observable<WateringPlan> {
    const url = `${this.BACKEND_URL}/generateByUser/${plantId}`;
    return this.http.post<any>(url, {}).pipe(
      map(response => response.data as WateringPlan)
    );
  }

  /**
   * Generates a watering plan for an administrator.
   * Calls the endpoint: POST /api/wateringPlan/generateByAdmin/{plantId}/{userEmail}
   *
   * @param plantId - The ID of the plant.
   * @param userEmail - The email of the user.
   * @returns An Observable emitting the generated watering plan.
   */
  generateByAdmin(plantId: number, userEmail: string): Observable<WateringPlan> {
    const url = `${this.BACKEND_URL}/generateByAdmin/${plantId}/${userEmail}`;
    return this.http.post<any>(url, {}).pipe(
      map(response => response.data as WateringPlan)
    );
  }

  /**
   * Generates and downloads the PDF for a watering plan.
   * Calls the endpoint: GET /api/wateringPlan/generatePDF/{wateringPlanId}
   *
   * @param wateringPlanId - The ID of the watering plan.
   * @returns An Observable emitting the Blob (PDF file).
   */
  generatePDF(wateringPlanId: number): Observable<Blob> {
    const url = `${this.BACKEND_URL}/generatePDF/${wateringPlanId}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  /**
   * Retrieves the watering plans for the current user.
   * Calls the endpoint: GET /api/wateringPlan/getWateringPlansByUser?page={page}&size={size}
   *
   * @param page - The page number.
   * @param size - The number of items per page.
   * @returns An Observable emitting an array of watering plans.
   */
  getWateringPlansByUser(page: number = 1, size: number = 10): Observable<WateringPlan[]> {
    const url = `${this.BACKEND_URL}/getWateringPlansByUser?page=${page}&size=${size}`;
    return this.http.get<any>(url).pipe(
      map(response => response.data as WateringPlan[])
    );
  }

  /**
   * Retrieves the watering plans for a specific user (admin view).
   * Calls the endpoint: GET /api/wateringPlan/getWateringPlansByUserAdmin/{userEmail}?page={page}&size={size}
   *
   * @param userEmail - The email of the user.
   * @param page - The page number.
   * @param size - The number of items per page.
   * @returns An Observable emitting an array of watering plans.
   */
  getWateringPlansByUserAdmin(userEmail: string, page: number = 1, size: number = 10): Observable<WateringPlan[]> {
    const url = `${this.BACKEND_URL}/getWateringPlansByUserAdmin/${userEmail}?page=${page}&size=${size}`;
    return this.http.get<any>(url).pipe(
      map(response => response.data as WateringPlan[])
    );
  }

  /**
   * Adds an image to a specific watering day.
   * Calls the endpoint: PATCH /api/wateringPlan/addImageToWateringDay/{wateringDayId}
   *
   * @param wateringDayId - The ID of the watering day.
   * @param img - The image file to upload.
   * @returns An Observable emitting the updated watering day.
   */
  addImageToWateringDay(wateringDayId: number, img: File): Observable<WateringDay> {
    const url = `${this.BACKEND_URL}/addImageToWateringDay/${wateringDayId}`;
    const formData = new FormData();
    formData.append('img', img);
    return this.http.patch<any>(url, formData).pipe(
      map(response => response.data as WateringDay)
    );
  }
}
