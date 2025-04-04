import { Plant } from './plant.interface';
import { WateringDay } from './wateringDay.interface';

/**
 * Represents a watering plan that groups several watering days for a plant.
 */
export interface WateringPlan {
  /** Unique identifier for the watering plan */
  id: number;
  /** The plant associated with this watering plan */
  plant: Plant;
  /** An array of watering days included in the plan */
  wateringDays: WateringDay[];
  /** Indicates if the watering plan is active */
  isActive: boolean;
  /** Timestamp when the plan was created (ISO string) */
  createdAt: string;
  /** Timestamp when the plan was last updated (ISO string) */
  updatedAt: string;
}
