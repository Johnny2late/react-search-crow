import { FC } from 'react';

type addClassesTypes = {
    wrapper?: string;
    label?: string;
    inputForm?: string;
    input?: string;
    clear?: string;
    button?: string;
    loader?: string;
    dropdownWrapper?: string;
    dropdown?: string;
    dropdownItem?: string;
};
type Any = any;
interface SearchCrowProps {
    ref?: Any;
    items?: unknown[];
    excludesKeys?: string[];
    keysShowValue?: string[];
    searchByKeyAfterSelect?: string;
    separatorValue?: string;
    keyId?: string;
    value?: string;
    children?: unknown;
    debounce?: number;
    onSearchResults?: (results: unknown[]) => void;
    onSelect?: (item: unknown) => void;
    onLoad?: (isLoading: boolean) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onClear?: () => void;
    onlyVertexSearch?: boolean;
    autoSearch?: boolean;
    disabledSelect?: boolean;
    closeOnSelect?: boolean;
    withClear?: boolean;
    withBtn?: boolean;
    withDropdown?: boolean;
    withLoader?: boolean;
    disabled?: boolean;
    autoFocus?: boolean;
    changeDropdownPosition?: boolean;
    placeholder?: string;
    label?: string;
    btnText?: string;
    loaderText?: string;
    noResultsText?: string;
    addClasses?: addClassesTypes;
}

declare function onSearchCrow(list: Any[], value: string, excludesKeys?: string[], onlyVertexSearch?: boolean): Any[];
declare const SearchCrow: FC<SearchCrowProps>;

export { SearchCrow, onSearchCrow };
