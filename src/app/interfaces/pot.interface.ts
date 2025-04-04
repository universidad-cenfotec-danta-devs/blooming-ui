/**
 * Represents a Pot object as defined in the backend.
 */
export interface Pot {
    /** Unique identifier for the pot */
    id: number;
    /** Name of the pot */
    name: string;
    /** Description of the pot */
    description: string;
    /** Price of the pot */
    price: number;
    /** URL of the pot's image (3D file) */
    imageUrl: string;
    /**
     * Designer (user) who created the pot.
     */
    designer: User;
    /** List of evaluations for the pot (optional) */
    evaluations?: Evaluation[];
    /** Indicates if the pot is active */
    status: boolean;
    /** Timestamp when the pot was created (ISO string) */
    createdAt: string;
    /** Timestamp when the pot was last updated (ISO string) */
    updatedAt: string;
  }
  
  /**
   * A minimal User interface.
   * Extend this with additional properties as required by your application.
   */
  export interface User {
    id: number;
  }
  
  /**
   * A minimal Evaluation interface.
   * Define the properties according to your backend's Evaluation entity.
   */
  export interface Evaluation {
    id: number;
    score: number;
    comment?: string;
  }
  