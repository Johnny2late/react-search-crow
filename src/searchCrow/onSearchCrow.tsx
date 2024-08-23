import { Any } from './types'

// onSearchCrow function

function onSearchCrow(
  list: Any[],
  value: string,
  excludesKeys: string[] = [],
  onlyVertexSearch = false,
): Any[] {
  const newValue = value.toString().toLowerCase().trim()

  if (newValue === '') return []

  return iteratingArray(list, newValue, 0, list.length - 1, excludesKeys, onlyVertexSearch)
}

function iteratingArray(
  list: Any[],
  value: string,
  start: number,
  end: number,
  excludesKeys: string[],
  onlyVertexSearch: boolean,
): Any[] {
  if (start > end) return []

  const mid = Math.floor((start + end) / 2)
  const midItem = getMidItem(list[mid], excludesKeys)
  const result: Any[] = []

  if (midItem) {
    const itemIsArray = Array.isArray(midItem)

    if (isMatch(midItem, value)) {
      result.push(list[mid])
    } else if (itemIsArray && !onlyVertexSearch) {
      result.push(
        ...iteratingArray(midItem, value, 0, midItem.length - 1, excludesKeys, onlyVertexSearch),
      )
    } else if (typeof midItem === 'object' && !itemIsArray) {
      if (checkNestedObjects(midItem, value, excludesKeys, onlyVertexSearch)) {
        result.push(list[mid])
      }
    }
  }

  return [
    ...result,
    ...iteratingArray(list, value, start, mid - 1, excludesKeys, onlyVertexSearch),
    ...iteratingArray(list, value, mid + 1, end, excludesKeys, onlyVertexSearch),
  ]
}

function checkNestedObjects(
  midItem: Any,
  value: string,
  excludesKeys: string[],
  onlyVertexSearch: boolean,
): boolean {
  const keys = Object.keys(midItem)
  const nestedResults: Any[] = []

  for (const key of keys) {
    if (excludesKeys.includes(key)) continue

    const currentItem = midItem[key]
    const isArray = Array.isArray(currentItem)

    if (onlyVertexSearch && isArray) continue

    if (typeof currentItem !== 'object') {
      if (isMatch(currentItem, value)) {
        nestedResults.push(currentItem)
      }
    } else {
      if (checkNestedObjects(currentItem, value, excludesKeys, onlyVertexSearch)) {
        nestedResults.push(currentItem)
      } else if (isArray) {
        const results = iteratingArray(
          currentItem,
          value,
          0,
          currentItem.length - 1,
          excludesKeys,
          onlyVertexSearch,
        )

        if (results.length > 0) {
          nestedResults.push(currentItem)
        }
      }
    }
  }

  return nestedResults.length > 0
}

function getMidItem(item: Any, excludes: string[]) {
  if (typeof item === 'object') {
    for (const key of Object.keys(item)) {
      if (!excludes.includes(key)) break
    }
  }
  return item
}

function isMatch(item: Any, value: string): boolean {
  if (typeof item === 'string' || typeof item === 'number') {
    return isIncludes(item, value)
  }
  return false
}

function isIncludes(item: number | string, value: string): boolean {
  return item.toString().toLowerCase().replace(/\s+/g, '').includes(value.replace(/\s+/g, ''))
}

export { onSearchCrow, iteratingArray }
