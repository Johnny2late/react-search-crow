import React, { FC, forwardRef, useEffect, useState, useRef, useImperativeHandle } from 'react'

import { onSearchCrow } from './onSearchCrow'
import { useClickOutside, useGetListPosition } from './hooks'
import { addClassesTypes, Any, CrowSearchProps } from './types'

import './style.css'

export const SearchCrow: FC<CrowSearchProps> = forwardRef(
  (
    {
      // you can pass your own list
      children,
      // array of any type
      items = [],
      // Key for the list item. Defaults to index
      keyId = '',
      // keys to exclude from the search
      excludesKeys = [],
      // keys whose values are displayed in the drop-down list
      keysShowValue = [],
      // if an array of objects, it is necessary to specify by which key to search after selection. The key must not match a key from the excludesKeys list
      searchByKeyAfterSelect = '',
      // separator of output values.
      // It is obligatory to specify if several values are output.
      // Space must not be used and if children is used - use the same separator as in children.
      separatorValue = ', ',
      // value to be written to the input
      value = '',
      // result output delay time
      debounce = 0,
      // callback that returns the search results
      onSearchResults = () => {},
      // callback that returns the selected item
      onSelect = () => {},
      // callback that returns true/false on loading
      onLoad = () => {},
      // callback that is executed if onFocus
      onFocus = () => {},
      // callback which is executed if onBlur
      onBlur = () => {},
      // callback that is executed if onClear
      onClear = () => {},
      // search only by vertices if it is necessary to exclude search by nested arrays
      onlyVertexSearch = false,
      // buttonless search
      autoSearch = false,
      // disallow selection
      disabledSelect = false,
      // close the list if the item is selected
      closeOnSelect = false,
      // show the clear
      withClear = true,
      // show the button search
      withBtn = true,
      // show the list results
      withDropdown = true,
      // show the loader
      withLoader = true,
      // disabled search
      disabled = false,
      // post-mount focus
      autoFocus = false,
      // change the position of the list if it rests at the bottom of the window
      changeDropdownPosition = true,
      // text placeholder
      placeholder = 'text...',
      // text label
      label = 'Search',
      // text search button
      btnText = 'Search',
      // text loader
      loaderText = 'Loading',
      // text no Results
      noResultsText = 'No results:',
      // custom classes
      addClasses = {},
    }: CrowSearchProps,
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
