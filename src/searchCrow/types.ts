export type addClassesTypes = {
  wrapper?: string
  label?: string
  inputForm?: string
  input?: string
  clear?: string
  button?: string
  loader?: string
  dropdownWrapper?: string
  dropdown?: string
  dropdownItem?: string
}
// eslint-disable-next-line
export type Any = any

export interface SearchCrowProps {
  ref?: Any
  items?: unknown[]
  excludesKeys?: string[]
  keysShowValue?: string[]
  searchByKeyAfterSelect?: string
  separatorValue?: string
  keyId?: string
  value?: string
  children?: unknown
  debounce?: number
  onSearchResults?: (results: unknown[]) => void
  onSelect?: (item: unknown) => void
  onLoad?: (isLoading: boolean) => void
  onFocus?: () => void
  onBlur?: () => void
  onClear?: () => void
  onlyVertexSearch?: boolean
  autoSearch?: boolean
  disabledSelect?: boolean
  closeOnSelect?: boolean
  withClear?: boolean
  withBtn?: boolean
  withDropdown?: boolean
  withLoader?: boolean
  disabled?: boolean
  autoFocus?: boolean
  changeDropdownPosition?: boolean
  placeholder?: string
  label?: string
  btnText?: string
  loaderText?: string
  noResultsText?: string
  addClasses?: addClassesTypes
}
