/**
 * Disease defines the structure for a disease suggestion returned in diagnosis mode.
 * Note that 'treatment' is inside 'details', matching the JSON structure you provided.
 */
export interface Disease {
  id: string;              // "e5eed7f688efa59e"
  name: string;            // "water excess or uneven watering"
  probability: number;     // e.g. 41
  details: {
    localName: string;     // e.g. "water excess or uneven watering"
    description: string;   // e.g. "Water excess and uneven watering are abiotic disorders..."
    url?: string;          // e.g. "https://www.missouribotanicalgarden.org/..."
    treatment: {
      chemical: string[];
      biological: string[];
      prevention: string[];
    };
  };
}
