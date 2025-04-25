import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment.development';
import { Observable } from 'rxjs';
import { PlantResponse } from '../interfaces/plantResponse.interface';

/**
 * Enum to represent the type of action for identifying a plant.
 */
export enum PlantActionType {
  Identify = 'identify',
  Diagnosis = 'diagnosis'
}

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
   * @param actionType - Indicates whether the request is for identification or diagnosis.
   *                     For identification, the endpoint will be /img.
   *                     For diagnosis, the endpoint will be /healthAssessment.
   * @returns An Observable that emits an array of PlantResponse objects.
   */
  public identifyPlant(
    formData: FormData,
    actionType: PlantActionType
  ): Observable<PlantResponse[]> {
    const endpoint =
      actionType === PlantActionType.Identify
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
