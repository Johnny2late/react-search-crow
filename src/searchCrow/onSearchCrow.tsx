import { Any } from './types'

export function onSearchCrow<T>(
  list: T[],
  value: string,
  excludesKeys: string[] = [],
  onlyVertexSearch = false,
): T[] {
  const newValue = value.toString().toLowerCase().trim()

  if (newValue === '') return []

  const isSimpleArray = list.length <= 50 || (onlyVertexSearch && list.length <= 100)

  if (isSimpleArray) {
    return iteratingSimpleArray(list, newValue, excludesKeys, onlyVertexSearch)
  } else {
    return iteratinghHardArray(list, newValue, 0, list.length - 1, excludesKeys, onlyVertexSearch)
  }
}

function iteratingSimpleArray<T>(
  list: T[],
  value: string,
  excludesKeys: string[],
  onlyVertexSearch: boolean,
): T[] {
  const result: T[] = []

  function isType(item: T, type: string) {
    return typeof item === type
  }

  for (const item of list) {
    const midItem = getMidItem(item, excludesKeys)

    if (midItem !== null) {
      if (isType(midItem, 'string') && isIncludes(midItem, value)) {
        result.push(item)
      } else if (isType(midItem, 'number') && isIncludes(String(midItem), value)) {
        result.push(item)
      } else if (Array.isArray(midItem)) {
        const nestedResults = iteratingSimpleArray(midItem, value, excludesKeys, onlyVertexSearch)

        if (nestedResults.length > 0) result.push(...nestedResults)
      } else if (isType(midItem, 'object')) {
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

function iteratinghHardArray<T>(
  list: T[],
  value: string,
  start: number,
  end: number,
  excludesKeys: string[],
  onlyVertexSearch: boolean,
): T[] {
  if (start > end) return []

  const mid = Math.floor((start + end) / 2)
  const midItem = getMidItem(list[mid], excludesKeys)
  const result: T[] = []

  function isType(type: string) {
    return typeof midItem === type
  }

  if (midItem !== null) {
    if (isType('string') && isIncludes(midItem, value)) {
      result.push(list[mid])
    } else if (isType('number') && isIncludes(midItem, value)) {
      result.push(list[mid])
    } else if (Array.isArray(midItem)) {
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
    } else if (isType('object')) {
      const keys = Object.keys(midItem)

      for (const key of keys) {
        if (onlyVertexSearch && Array.isArray(midItem[key])) break

        if (!excludesKeys.includes(key)) {
          const nestedResult = iteratinghHardArray(
            midItem[key],
            value,
            0,
            0,
            excludesKeys,
            onlyVertexSearch,
          )

          if (nestedResult.length > 0) {
            result.push(list[mid])
            break
          }
        }
      }
    }
  }

  const left = iteratinghHardArray(list, value, start, mid - 1, excludesKeys, onlyVertexSearch)
  const right = iteratinghHardArray(list, value, mid + 1, end, excludesKeys, onlyVertexSearch)

  return [...result, ...left, ...right]
}
function getMidItem(item: Any, excludes: string[]): Any {
  for (const key of Object.keys(item)) {
    if (!excludes.includes(key)) {
      break
    }
  }
  return item
}

function isIncludes(a: number | string, value: string): boolean {
  return a.toString().toLowerCase().replaceAll(' ', '').includes(value.replaceAll(' ', ''))
}
