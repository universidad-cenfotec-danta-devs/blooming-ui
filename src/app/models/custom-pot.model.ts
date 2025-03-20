/**
 * Interface representing a custom pot configuration.
 */
export interface CustomPot {
    material: string; // e.g., Ceramic, Plastic, Metal, Wood
    size: number;     // Numeric value (e.g., diameter or scale factor)
    color: string;    // e.g., "red", "#FF0000", "blue"
    forma?: string;    // Shape of the pot, e.g., "Circular", "Square"
    price?: number;   // Calculated price (optional until computed)
  }
  