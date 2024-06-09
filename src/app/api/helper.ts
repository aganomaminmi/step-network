import { NextApiRequest, NextApiResponse } from "next";

export interface ApiRequest<T> extends NextApiRequest {
  body: T;
}

export interface ApiResponse<T> extends NextApiResponse {
  data: T;
}
