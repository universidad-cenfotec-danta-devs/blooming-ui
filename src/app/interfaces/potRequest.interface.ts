/**
 * Represents the request body for creating a new pot.
 */
export interface PotRequest {
    /** The name of the pot */
    name: string;
    /** A description of the pot */
    description: string;
    /** The price of the pot */
    price: number;
  }
  