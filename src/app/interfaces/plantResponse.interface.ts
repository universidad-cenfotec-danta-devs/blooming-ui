/**
 * PlantResponse defines the structure for plant identification responses.
 * Note: Instead of a numeric 'id', we now use 'plantId' (string).
 */
export interface PlantResponse {
  tokenPlant: string;             // Maps to API's "idAccessToken"
  plantId: string;                // Unique plant ID as string
  name: string;
  probabilityPercentage: string;  // e.g., "74%"
  similarityPercentage: string;   // e.g., "72%"
  imageUrl: string;
  imageUrlSmall: string;
  description?: string;
}
