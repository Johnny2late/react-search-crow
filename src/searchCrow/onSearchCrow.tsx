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

  const isSimpleArray = onlyVertexSearch ? list.length <= 100 : list.length <= 50

  return isSimpleArray
    ? iteratingSimpleArray(list, newValue, excludesKeys, onlyVertexSearch)
    : iteratingHardArray(list, newValue, 0, list.length - 1, excludesKeys, onlyVertexSearch)
}

function iteratingSimpleArray(
  list: Any[],
  value: string,
  excludesKeys: string[],
  onlyVertexSearch: boolean,
): Any[] {
  const result: Any[] = []

  for (const item of list) {
    const midItem = getMidItem(item, excludesKeys)

    if (midItem !== null) {
      if (isMatch(midItem, value)) {
        result.push(item)
      } else if (Array.isArray(midItem) && !onlyVertexSearch) {
        result.push(...iteratingSimpleArray(midItem, value, excludesKeys, onlyVertexSearch))
      } else if (typeof midItem === 'object' && !Array.isArray(midItem)) {
        if (checkNestedObjects(midItem, value, excludesKeys, onlyVertexSearch, true)) {
          result.push(item)
        }
      }
    }
  }
  return result
}

function iteratingHardArray(
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

  if (midItem !== null) {
    if (isMatch(midItem, value)) {
      result.push(list[mid])
    } else if (Array.isArray(midItem) && !onlyVertexSearch) {
      result.push(
        ...iteratingHardArray(
          midItem,
          value,
          0,
          midItem.length - 1,
          excludesKeys,
          onlyVertexSearch,
        ),
      )
    } else if (typeof midItem === 'object' && !Array.isArray(midItem)) {
      if (checkNestedObjects(midItem, value, excludesKeys, onlyVertexSearch, false)) {
        result.push(list[mid])
      }
    }
  }

  return [
    ...result,
    ...iteratingHardArray(list, value, start, mid - 1, excludesKeys, onlyVertexSearch),
    ...iteratingHardArray(list, value, mid + 1, end, excludesKeys, onlyVertexSearch),
  ]
}

function checkNestedObjects(
  midItem: Any,
  value: string,
  excludesKeys: string[],
  onlyVertexSearch: boolean,
  isSimple: boolean,
): boolean {
  const keys = Object.keys(midItem)
  const nestedResults = []

  for (const key of keys) {
    if (!excludesKeys.includes(key)) {
      const currentItem = midItem[key]

      if (onlyVertexSearch && Array.isArray(currentItem)) continue

      if (!Array.isArray(currentItem)) {
        if (typeof currentItem !== 'object') {
          if (isMatch(currentItem, value)) nestedResults.push(currentItem)
        } else {
          if (checkNestedObjects(currentItem, value, excludesKeys, onlyVertexSearch, isSimple)) {
            nestedResults.push(currentItem)
          }
        }
      } else {
        const results = isSimple
          ? iteratingSimpleArray(currentItem, value, excludesKeys, onlyVertexSearch)
          : iteratingHardArray(
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

export { onSearchCrow, iteratingSimpleArray, iteratingHardArray }
