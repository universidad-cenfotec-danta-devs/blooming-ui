/**
 * PlantResponse defines the structure for plant identification responses.
 * Note: Instead of a numeric 'id', we now use 'plantId' (string).
 */
export interface PlantResponse {
  tokenPlant: string;
  plantId: number;
  name: string;
  probabilityPercentage: string;
  similarityPercentage: string;
  imageUrl: string;
  imageUrlSmall: string;
  description?: string;
}
