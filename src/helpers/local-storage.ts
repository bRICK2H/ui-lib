const prefix = 'ui-kit'

const collectKey = (name: string) => {
  return `${prefix}-${name}`
}

const isJsonValid = (string: string) => {
  try {
    JSON.parse(string)
  } catch (error: unknown) {
    return false
  }

  return true
}

export const hasItemStorage = (name: string) => {
  return typeof localStorage.getItem(collectKey(name)) === 'string'
}

export const getItemStorage = (name: string) => {
  const itemStorage = localStorage.getItem(collectKey(name))

  if (typeof itemStorage === 'string' && isJsonValid(itemStorage)) {
    return JSON.parse(itemStorage)
  }

  return null
}

export const setItemStorage = (name: string, data: string | object) => {
  localStorage.setItem(collectKey(name), JSON.stringify(data))
}

export const removeItemStorage = (name: string) => {
  localStorage.removeItem(collectKey(name))
}
