export interface WateringDay {
    /** Unique identifier for the watering day */
    id: number;
    /** Day of the month */
    day: number;
    /** Month of the year */
    month: number;
    /** Year */
    year: number;
    /** Recommendation for watering on this day */
    recommendation: string;
    /** URL of the image associated with the watering day */
    imageURL: string;
    /** Indicates if the watering day is active */
    isActive: boolean;
    /** Timestamp when the watering day was created (ISO string) */
    createdAt: string;
    /** Timestamp when the watering day was last updated (ISO string) */
    updatedAt: string;

  }
    