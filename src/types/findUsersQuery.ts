export interface FindUsersQuery {
  role?: string;
  sortBy?: 'name' | 'createdAt';
  order?: 'asc' | 'desc';
  name: string;
}
