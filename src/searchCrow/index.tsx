import React, { FC, forwardRef, useEffect, useState, useRef, useImperativeHandle } from 'react'

import { useClickOutside, useGetListPosition } from './hooks'
import { addClassesTypes, Any, SearchCrowProps } from './types'

import './style.css'

// onSearchCrow function

function onSearchCrow(
  list: Any[],
  value: string,
  excludesKeys: string[] = [],
  onlyVertexSearch = false,
): Any[] {
  const newValue = value.toString().toLowerCase().trim()

  if (newValue === '') return []

  const isSimpleArray = list.length <= 50 || (onlyVertexSearch && list.length <= 100)

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

// SearchCrow component

const SearchCrow: FC<SearchCrowProps> = forwardRef(
  (
    {
      children,
      items = [],
      keyId = '',
      excludesKeys = [],
      keysShowValue = [],
      searchByKeyAfterSelect = '',
      separatorValue = ', ',
      value = '',
      debounce = 0,
      onSearchResults = () => {},
      onSelect = () => {},
      onLoad = () => {},
      onFocus = () => {},
      onBlur = () => {},
      onClear = () => {},
      onlyVertexSearch = false,
      autoSearch = false,
      disabledSelect = false,
      closeOnSelect = false,
      withClear = true,
      withBtn = true,
      withDropdown = true,
      withLoader = true,
      disabled = false,
      autoFocus = false,
      changeDropdownPosition = true,
      placeholder = 'text...',
      label = 'Search',
      btnText = 'Search',
      loaderText = 'Loading',
      noResultsText = 'No results:',
      addClasses = {},
    }: SearchCrowProps,
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const searchRef = useRef<HTMLDivElement>(null)

    const [searchValue, setSearchValue] = useState<string>(value)
    const [selectionValue, setSelectionValue] = useState<string>('')
    const [load, setLoad] = useState<boolean>(false)
    const [isOpenList, setIsOpenList] = useState<boolean>(true)
    const [errorText, setErrorText] = useState<string | null>(null)
    const [searchResults, setSearchResults] = useState<Any[]>([])
    const [selectionItem, setSelectionItem] = useState<Any>(null)

    useEffect(() => {
      if (inputRef.current && autoFocus) inputRef.current.focus()
    }, [])

    const { fieldRef, listRef, dropdownStyles } = useGetListPosition({
      isOpenList,
      itemsLength: searchResults.length,
      execute: withDropdown || changeDropdownPosition,
    })

    useClickOutside(searchRef, () => setIsOpenList(false))

    useImperativeHandle(ref, () => ({
      handleItem(el: Any, val: string) {
        if (children && el) handleItem(el, val)
      },
    }))

    const handleSearch = (results: Any[] = [], val: string) => {
      if (onLoad) onLoad(true)
      setLoad(true)
      setErrorText(null)

      const newList = results.length > 0 ? results : items

      const result = onSearchCrow(newList, val, excludesKeys, onlyVertexSearch)

      if (result.length === 0 && val !== '') {
        setErrorText(`${noResultsText} "${val}"`)
      }

      setTimeout(() => {
        if (onLoad) onLoad(false)
        if (onSearchResults) onSearchResults(result)
        setSearchResults(result)
        setLoad(false)
      }, debounce)

      if (!isOpenList) setIsOpenList(true)
    }

    const onSearch = (val: string, el?: Any) => {
      const newVal = val.toString().split(separatorValue)[0].replace(separatorValue.trim(), '')

      if (closeOnSelect) {
        if (el) setIsOpenList(false)
        else handleSearch([], newVal)
      } else handleSearch([], newVal)
    }

    const getValue = (el: Any) => {
      if (typeof el === 'object') {
        if (keysShowValue.length) {
          return keysShowValue.reduce((result, key) => {
            if (el[key] !== undefined && el[key] !== '') {
              if (result === '') return el[key].toString()
              else return `${result}${separatorValue}${el[key].toString()}`
            }
            return result
          }, '')
        } else return JSON.stringify(el)
      } else return el.toString()
    }

    const getTargetValue = () => {
      if (selectionValue && searchValue.trim() !== selectionValue.trim()) {
        return selectionValue
      } else if (selectionItem && searchByKeyAfterSelect) {
        return selectionItem[searchByKeyAfterSelect]
      } else return searchValue
    }

    const getClass = (key: keyof addClassesTypes) => {
      const isEmpty = Object.keys(addClasses).length === 0
      return isEmpty || !addClasses[key] ? '' : ` ${addClasses[key]}`
    }

    const handleItem = (el: Any, val?: string) => {
      if (onSelect) onSelect(el)

      let newValue = ''
      const isObject = typeof el === 'object'

      if (val) newValue = val
      else {
        if (!isObject) newValue = el.toString()
        else newValue = getValue(el)
      }
      setSelectionItem(el)
      setSearchValue(newValue)
      setSelectionValue(newValue)
      onSearch(searchByKeyAfterSelect ? el[searchByKeyAfterSelect] : newValue, el)
    }

    const handleFocus = () => {
      if (onFocus) onFocus()
      if (!isOpenList) setIsOpenList(true)
    }
    const handleBlur = () => {
      if (onBlur) onBlur()
    }

    const handleClear = () => {
      if (onClear) onClear()
      if (onSearchResults) onSearchResults([])
      setErrorText(null)
      setSearchValue('')
      setSearchResults([])
      setSelectionItem(null)
    }

    useEffect(() => {
      if (searchValue.trim() === '') {
        handleClear()
        return
      }
      if (searchValue.trim() !== selectionValue.trim()) {
        setSelectionItem(null)
        setSelectionValue('')
      }
      if (autoSearch && !selectionItem) onSearch(getTargetValue())
    }, [searchValue, selectionItem])

    return (
      <div className={`sc-wrapper${getClass('wrapper')}`} ref={searchRef}>
        {label && (
          <div className={`sc-label${getClass('label')}`}>
            <label htmlFor="searchInput">{label}</label>
          </div>
        )}
        <form
          onSubmit={event => {
            event.preventDefault()
            if (!disabled) onSearch(getTargetValue())
          }}
          className={`sc-input-form${getClass('inputForm')}`}
        >
          <div className={`sc-input${getClass('input')}`} ref={fieldRef}>
            <input
              type="text"
              id="searchInput"
              onBlur={handleBlur}
              onFocus={handleFocus}
              disabled={disabled}
              ref={inputRef}
              placeholder={placeholder}
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
            />
            {withClear && searchValue && !disabled && !load && (
              <div onClick={handleClear} className={`sc-input-clear${getClass('clear')}`}></div>
            )}
          </div>

          {!autoSearch && withBtn ? (
            <button
              data-testid="search-button"
              className={`sc-button${getClass('button')}`}
              onClick={() => onSearch(getTargetValue())}
              disabled={load || !searchValue || disabled}
            >
              {withLoader && load ? loaderText : btnText}
            </button>
          ) : (
            withLoader && (
              <span className={`sc-loader${getClass('loader')}`}>{load && loaderText}</span>
            )
          )}
        </form>

        {withDropdown && (
          <div
            className={`sc-dropdown-wrapper${getClass('dropdownWrapper')}${(searchResults.length > 0 || errorText) && isOpenList ? ' sc-dropdown--open' : ''}`}
            style={{ ...dropdownStyles }}
            ref={listRef}
          >
            {children ? (
              <>{children}</>
            ) : (
              <div className={`sc-dropdown${getClass('dropdown')}`}>
                {errorText
                  ? errorText
                  : searchResults.length > 0 &&
                    searchResults.map((el: Any, index: number) => (
                      <div
                        key={keyId && el[keyId] ? el[keyId] : index + el.toString()}
                        className={`sc-dropdown-item${disabledSelect ? 'sc-dropdown-item--disabled' : ''}${getClass('dropdownItem')}`}
                        onClick={() => (!disabledSelect ? handleItem(el) : () => {})}
                      >
                        {getValue(el)}
                      </div>
                    ))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  },
)

SearchCrow.displayName = 'SearchCrow'

export { SearchCrow, onSearchCrow }
