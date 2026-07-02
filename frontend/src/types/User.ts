export interface User {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  role: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
