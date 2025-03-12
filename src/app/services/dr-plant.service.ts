import { Injectable } from '@angular/core';
import { BaseService } from '../../app/shared/service/base.service';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../enviroments/enviroment.development';

/**
 * DrPlantService - Handles plant identification and chat API calls.
 */
@Injectable({
  providedIn: 'root',
})
export class DrPlantService extends BaseService<any> {
  protected override source = `${environment.apiUrl}/dr-plant`;

  /**
   * Returns two mock plants if development is true.
   * Otherwise, calls the backend to identify the plant.
   */
  public identifyPlant(
    imageFile?: FormData,
    development: boolean = true
  ): Observable<{ name: string; description: string }[]> {
    if (development) {
      // Return two mock plants
      return of([
        {
          name: 'Mock Plant #1',
          description: 'Description for Mock Plant #1.',
        },
        {
          name: 'Mock Plant #2',
          description: 'Description for Mock Plant #2.',
        },
      ]).pipe(delay(2000)); // Simulated network delay
    }

    if (!imageFile) {
      throw new Error('Image file is required in production mode.');
    }

    // Real API call, if implemented
    return this.add(imageFile).pipe(map((response) => response.data));
  }

  /**
   * Simulates a chat response from Dr. Planta.
   * Returns a single mock message after a short delay.
   */
  public chatWithPlant(
    userMessage: string,
    development: boolean = true
  ): Observable<string> {
    if (development) {
      return of(`Dr. Planta says: "I received your message: ${userMessage}"`).pipe(
        delay(1500)
      );
    }

    // In production, you would call a real endpoint. Example:
    // return this.add({ message: userMessage }).pipe(
    //   map(response => response.data.someChatField)
    // );

    throw new Error('chatWithPlant: Production mode not implemented yet.');
  }
}
