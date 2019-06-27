export interface ITodoItem {
  id: string,
  summary: string,
  isComplete: boolean
}

export interface ITodoItemList {
  items: ITodoItem[],
  count: number
}
