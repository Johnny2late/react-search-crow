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

  let isSimpleArray

  if (onlyVertexSearch) {
    isSimpleArray = list.length <= 100
  } else isSimpleArray = list.length <= 50

  if (isSimpleArray) {
    return iteratingSimpleArray(list, newValue, excludesKeys, onlyVertexSearch)
  } else {
    return iteratinghHardArray(list, newValue, 0, list.length - 1, excludesKeys, onlyVertexSearch)
  }
}

function iteratingSimpleArray(
  list: Any[],
  value: string,
  excludesKeys: string[],
  onlyVertexSearch: boolean,
): Any[] {
  const result: Any[] = []

  function isType(item: Any, type: string) {
    return typeof item === type
  }

  for (const item of list) {
    const midItem = getMidItem(item, excludesKeys)

    if (midItem !== null) {
      if (isType(midItem, 'string') && isIncludes(midItem, value)) {
        result.push(item)
      } else if (isType(midItem, 'number') && isIncludes(String(midItem), value)) {
        result.push(item)
      } else if (Array.isArray(midItem) && !onlyVertexSearch) {
        const nestedResults = iteratingSimpleArray(midItem, value, excludesKeys, onlyVertexSearch)

        if (nestedResults.length > 0) {
          result.push(...nestedResults)
        }
      } else if (isType(midItem, 'object') && !Array.isArray(midItem)) {
        const keys = Object.keys(midItem)

        for (const key of keys) {
          if (!excludesKeys.includes(key)) {
            const toArrayItem = Array.isArray(midItem[key]) ? midItem[key] : [midItem[key]]

            const nestedResult = iteratingSimpleArray(
              toArrayItem,
              value,
              excludesKeys,
              onlyVertexSearch,
            )

            if (nestedResult.length > 0) {
              result.push(item)
              break
            }
          }
        }
      }
    }
  }
  return result
}

function iteratinghHardArray(
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

  function isType(type: string) {
    return typeof midItem === type
  }

  if (midItem !== null) {
    if (isType('string') && isIncludes(midItem, value)) {
      result.push(list[mid])
    } else if (isType('number') && isIncludes(midItem, value)) {
      result.push(list[mid])
    } else if (Array.isArray(midItem) && !onlyVertexSearch) {
      const nestedResults = iteratinghHardArray(
        midItem,
        value,
        0,
        midItem.length - 1,
        excludesKeys,
        onlyVertexSearch,
      )

      if (nestedResults.length > 0) {
        result.push(...nestedResults)
      }
    } else if (isType('object') && !Array.isArray(midItem)) {
      const keys = Object.keys(midItem)
      const matchedKeys = []

      for (const key of keys) {
        if (onlyVertexSearch && Array.isArray(midItem[key])) continue

        const toArrayItem = Array.isArray(midItem[key]) ? midItem[key] : [midItem[key]]

        if (!excludesKeys.includes(key)) {
          const nestedResult = iteratinghHardArray(
            toArrayItem,
            value,
            0,
            toArrayItem.length - 1,
            excludesKeys,
            onlyVertexSearch,
          )
          if (nestedResult.length > 0) {
            matchedKeys.push(key)
          }
        }
      }
      if (matchedKeys.length > 0) {
        result.push(list[mid])
      }
    }
  }

  const left = iteratinghHardArray(list, value, start, mid - 1, excludesKeys, onlyVertexSearch)
  const right = iteratinghHardArray(list, value, mid + 1, end, excludesKeys, onlyVertexSearch)

  return [...result, ...left, ...right]
}

function getMidItem(item: Any, excludes: string[]) {
  if (typeof item === 'object') {
    for (const key of Object.keys(item)) {
      if (!excludes.includes(key)) break
    }
  }
  return item
}

function isIncludes(a: number | string, value: string): boolean {
  return a.toString().toLowerCase().replaceAll(' ', '').includes(value.replaceAll(' ', ''))
}

export { onSearchCrow, iteratingSimpleArray, iteratinghHardArray }
