export interface IRoleRequest {
    id?: string;
    roleRequested?: string;
    requesterId?: number;
    requesterEmail?: string;
    requestStatus?: string;
    createdAt?: Date;
    updatedAt?: Date;
}