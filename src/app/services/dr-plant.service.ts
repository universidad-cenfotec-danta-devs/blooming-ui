import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment.development';
import { Observable } from 'rxjs';
import { PlantResponse } from '../interfaces/plantResponse.interface';


@Injectable({
  providedIn: 'root',
})
export class DrPlantService {
  private BACKEND_URL = `${environment.apiUrl}/api/plantAI`;

  constructor(private http: HttpClient) {}

  /**
   * Sends the image file to the backend.
   *
   * @param formData - A FormData object containing the image file (with key 'img').
   * @param actionType - Indicates whether the request is for 'identify' or 'diagnosis'.
   *                     For 'identify', the endpoint will be /img.
   *                     For 'diagnosis', the endpoint will be /healthAssessment.
   * @returns An Observable that emits an array of PlantResponse objects.
   */
  public identifyPlant(
    formData: FormData,
    actionType: 'identify' | 'diagnosis'
  ): Observable<PlantResponse[]> {
    // Choose the endpoint based on the actionType.
    const endpoint =
      actionType === 'identify'
        ? `${this.BACKEND_URL}/img`
        : `${this.BACKEND_URL}/healthAssessment`;

    return this.http.post<PlantResponse[]>(endpoint, formData);
  }

  /**
   * Asks a question about a specific plant.
   *
   * @param plantId - The ID of the plant.
   * @param question - The question to ask.
   * @returns An Observable that emits the answer as a string.
   */
  public askPlantQuestion(plantId: number, question: string): Observable<string> {
    return this.http.post<string>(
      `${this.BACKEND_URL}/askAI/${plantId}`,
      { question }
    );
  }
}
