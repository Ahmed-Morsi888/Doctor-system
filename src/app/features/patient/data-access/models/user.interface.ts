
export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface CreateUserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}
