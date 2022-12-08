export enum SortDirection {
  ASC = 'asc', 
  DESC = 'desc', 
}

export type QueryBlogModel = {
  searchNameTerm: string | null
  pageNumber: number
  pageSize: number
  sortBy: string
  sortDirection: SortDirection
}
