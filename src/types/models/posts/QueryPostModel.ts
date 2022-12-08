export enum SortDirection {
  ASC = 'asc', 
  DESC = 'desc', 
}

export type QueryPostModel = {
  searchNameTerm: string | null
  pageNumber: number
  pageSize: number
  sortBy: string
  sortDirection: SortDirection
}
