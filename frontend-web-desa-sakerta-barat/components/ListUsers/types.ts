export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

export interface UserListResponse {
  data: User[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
