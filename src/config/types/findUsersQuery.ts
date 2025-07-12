export interface FindUsersQuery {
  role?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  name: string;
}
