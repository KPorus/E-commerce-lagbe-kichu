export interface User {
    _id: string;
    email: string;
    username: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    created_by?: string | null;
    __v?: number;
  }
  