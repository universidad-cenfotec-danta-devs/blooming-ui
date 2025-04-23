export interface IEvaluation {
  id?: string;
  objToEvaluateId: number;
  rating: number;
  comment?: string;
  userName?: string;
  anonymous: boolean;
  createdAt?: string;
}
export interface IEvaluationResponse<T> {
  data: T;
  message: string,
  meta: T;
}
