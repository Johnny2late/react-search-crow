import React, { RefObject, useLayoutEffect, useRef, useState, useEffect } from 'react'
import { Any } from './types'

//  Dropdown Position

interface StylesTypes {
  width?: string
  top?: string
}

export const useGetListPosition = ({
  isOpenList,
  itemsLength = 0,
  execute,
}: {
  isOpenList: boolean
  itemsLength?: number
  execute: boolean
}) => {
  const [dropdownStyles, setDropdownStyles] = useState<StylesTypes>({
    width: '',
    top: '',
  })

  const [parent, setParent] = useState<HTMLElement | null>(null)

  const initHeightRef = useRef<number | null>(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (execute) {
      setDropdownStyles((prev: StylesTypes): StylesTypes => {
        let width
        if (fieldRef.current) width = fieldRef.current.offsetWidth.toString()

        return { ...prev, width }
      })
    }
  }, [])

  function getStyles() {
    const styles: StylesTypes = setStyles({
      isOpenList,
      fieldRef,
      listRef,
      initHeightRef,
      setParent,
    })
    setDropdownStyles(styles)
  }

  useLayoutEffect(() => {
    if (execute && parent && fieldRef.current) {
      parent.addEventListener('scroll', getStyles)
      window.addEventListener('scroll', getStyles)
    }
    return () => {
      if (execute && parent && fieldRef.current) {
        parent.removeEventListener('scroll', getStyles)
        window.removeEventListener('scroll', getStyles)
      }
    }
  }, [parent])

  useLayoutEffect(() => {
    if (execute) {
      window.addEventListener('resize', getStyles)
      getStyles()
    }
    return () => {
      if (execute) window.removeEventListener('resize', getStyles)
    }
  }, [isOpenList, itemsLength])

  return {
    fieldRef,
    listRef,
    dropdownStyles,
  }
}

function setStyles({
  isOpenList,
  fieldRef,
  listRef,
  initHeightRef,
  setParent,
}: {
  isOpenList: boolean
  fieldRef: React.RefObject<HTMLDivElement>
  listRef: React.RefObject<HTMLDivElement>
  initHeightRef: React.RefObject<number | null>
  setParent: (parent: HTMLElement | null) => void
}): StylesTypes {
  function getScrollParent(node: {
    scrollHeight: number
    clientHeight: number
    parentNode: Any
  }): Any {
    if (node == null) return null

    if (node.scrollHeight > node.clientHeight) return node
    else return getScrollParent(node.parentNode)
  }

  function getSpaceBottom(): number {
    if (fieldRef.current) {
      return window.innerHeight - fieldRef.current.getBoundingClientRect().bottom - 10
    } else return 0
  }

  function getTopPosition(height: number, onTop: boolean): number {
    const spaceTop = fieldRef.current?.getBoundingClientRect().top || 0
    const spaceBottom = fieldRef.current?.getBoundingClientRect().bottom || 0

    if (onTop) return spaceTop - height - 5
    else return spaceBottom + 5
  }

  if (fieldRef.current && listRef.current && isOpenList) {
    const spaceBottom = getSpaceBottom()
    const listHeight = listRef.current.clientHeight

    if (initHeightRef.current === null) {
      // eslint-disable-next-line
      // @ts-ignore
      initHeightRef.current = listHeight
    }

    const parent = getScrollParent(fieldRef.current)

    if (parent) setParent(parent)
    else setParent(null)

    const height = listHeight
    let onTop = false

    if (height > spaceBottom) onTop = true

    return {
      width: `${fieldRef.current.clientWidth}px`,
      top: `${getTopPosition(listHeight, onTop)}px`,
    }
  }

  return { width: '', top: '' }
}

// Click Outside

export const useClickOutside = (
  ref: RefObject<HTMLElement | undefined>,
  callback: () => void,
  addEventListener = true,
) => {
  const handleClick = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
      callback()
    }
  }

  useEffect(() => {
    if (addEventListener) document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  })
}
