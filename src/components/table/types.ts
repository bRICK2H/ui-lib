export interface IUnknownKeys {
  [index: string]: unknown
}

export interface INumberKeys {
  [key: string]: number
}

export interface IBooleanKeys {
  [key: string]: boolean
}

export interface IElementKeys {
  [key: string]: HTMLElement
}

export interface INumberCollection {
  [key: string]: number[]
}

export interface ISortedItem {
  active: boolean
  sortBy: string
}

export interface ISortedItems {
  [index: string]: ISortedItem
}

export interface ISortedOption {
  index: number
  columnKey?: string
  sortBy: string | { [index: string]: string }
}
