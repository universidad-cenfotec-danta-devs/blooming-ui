/**
 * Disease defines the structure for a disease suggestion returned in diagnosis mode.
 * Note that 'treatment' is inside 'details', matching the JSON structure you provided.
 */
export interface Disease {
  id: string;              
  name: string;            
  probability: number;     
  details: {
    localName: string;     
    description: string;   
    url?: string;          
    treatment: {
      chemical: string[];
      biological: string[];
      prevention: string[];
    };
  };
}
