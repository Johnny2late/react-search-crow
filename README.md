# react-search-crow

React Search Crow

<p align="center" dir="auto">
  <img src="https://raw.githubusercontent.com/Johnny2late/react-search-crow/585fe8aca6b60b70375bd880757819531e7de0c8/react-search-crow.png" width="250" height="250" alt="Crow">
</p>

# SearchCrow Component

The SearchCrow component is a React component that provides a search functionality with a dropdown list of results. It allows you to customize various aspects of the search behavior and appearance.

## Features

- It is capable of searching for any type of array and any nesting
- Allows you to pass your own list of items to search through
- Supports searching excluding certain keys, and displaying specific keys in the dropdown list
- Provides callbacks for search results, item selection, loading state, focus/blur events, and clear events
- Supports buttonless search, disabled selection, closing the list on selection, and showing/hiding various UI elements
- Allows customizing the placeholder, label, button text, loader text, and no results text
- Supports changing the dropdown position if it rests at the bottom of the window

## Install

```
npm instal react-search-crow
```

## Usage

```javascript
import { SearchCrow } from 'react-search-crow'

const MyComponent = () => {
  const handleSearchResults = (results) => {
    // Handle {search} results
  }
  const handleSelect = (item) => {
    // Handle {item} selection
  }

  return (
    <SearchCrow
      items={[...]}
      onSearchResults={handleSearchResults}
      onSelect={handleSelect}
      // ...props
    />
  )
}
```

## Props

The SearchCrow component accepts the following props:

<!-- prettier-ignore -->
| Prop                     | Type                    | Default         | Description                                                          |
| ------------------------ | ----------------------- | --------------- | -------------------------------------------------------------------- |
| `children`               | React.ReactNode         | `null`          | Custom content to be rendered inside the component.                  |
| `items`                  | any[]                   | `[]`            | Array of items to search through.                                    |
| `keyId`                  | string                  | `''`            | Key to use as the unique identifier for each item.                   |
| `excludesKeys`           | string[]                | `[]`            | Array of keys to exclude from the search.                            |
| `keysShowValue`          | string[]                | `[]`            | Array of keys whose values should be displayed in the dropdown list. |
| `searchByKeyAfterSelect` | string                  | `''`            | Key to use for searching after an item is selected. The key must not match a key from the excludesKeys list.                |
| `separatorValue`         | string                  | `', '`          | Separator to use for displaying multiple values in the input field. Space must not be used and if children is used - use the same separator as in children.  |
| `value`                  | string                  | `''`            | Initial value of the search input.                                   |
| `debounce`               | number                  | `0`             | Delay time (in milliseconds) for the search results.                 |
| `onSearchResults`        | function                | `() => {}`      | Callback that returns the search results.                            |
| `onSelect`               | function                | `() => {}`      | Callback that returns the selected item.                             |
| `onLoad`                 | function                | `() => {}`      | Callback that returns the loading state.                             |
| `onFocus`                | function                | `() => {}`      | Callback that is executed on input focus.                            |
| `onBlur`                 | function                | `() => {}`      | Callback that is executed on input blur.                             |
| `onClear`                | function                | `() => {}`      | Callback that is executed on clear.                                  |
| `onlyVertexSearch`       | boolean                 | `false`         | Whether to search only by vertices, excluding nested arrays.         |
| `autoSearch`             | boolean                 | `false`         | Whether to perform the search automatically without a button.        |
| `disabledSelect`         | boolean                 | `false`         | Whether to disable selection of items.                               |
| `closeOnSelect`          | boolean                 | `false`         | Whether to close the dropdown list when an item is selected.         |
| `withClear`              | boolean                 | `true`          | Whether to show the clear button.                                    |
| `withBtn`                | boolean                 | `true`          | Whether to show the search button.                                   |
| `withDropdown`           | boolean                 | `true`          | Whether to show the dropdown list of results.                        |
| `withLoader`             | boolean                 | `true`          | Whether to show the loader.                                          |
| `disabled`               | boolean                 | `false`         | Whether to disable the search input.                                 |
| `autoFocus`              | boolean                 | `false`         | Whether to focus the search input on mount.                          |
| `changeDropdownPosition` | boolean                 | `true`          | Whether to change the dropdown position if it rests at the bottom.   |
| `placeholder`            | string                  | `'text...'`     | Placeholder text for the search input.                               |
| `label`                  | string                  | `'Search'`      | Label text for the search input.                                     |
| `btnText`                | string                  | `'Search'`      | Text for the search button.                                          |
| `loaderText`             | string                  | `'Loading'`     | Text for the loader.                                                 |
| `noResultsText`          | string                  | `'No results:'` | Text to display when there are no search results.                    |
| `addClasses`             | `addClassesTypes`       | `{}`            | Custom CSS classes to apply to the component.                        |

<!-- prettier-ignore -->
##

## addClassesTypes

| Class             | Type   | Default |
| ----------------- | ------ | ------- |
| `wrapper`         | string | `''`    |
| `label`           | string | `''`    |
| `inputForm`       | string | `''`    |
| `input`           | string | `''`    |
| `clear`           | string | `''`    |
| `button`          | string | `''`    |
| `loader`          | string | `''`    |
| `dropdownWrapper` | string | `''`    |
| `dropdown`        | string | `''`    |
| `dropdownItem`    | string | `''`    |

##

<!-- prettier-ignore -->
## SearchCrow Function

The onSearchCrow function is a utility function that can be used to perform a search on a list of items. It takes the following parameters:

## Usage

```javascript
import { onSearchCrow } from 'react-search-crow'

onSearchCrow([...], 'search text' ['id'], false)
```

| Arguments          | Type     | Default | Description                                                                       |
| ------------------ | -------- | ------- | --------------------------------------------------------------------------------- |
| `list`             | any[]    | `[]`    | An array of elements of any type and nesting.                                     |
| `value`            | string   | `''`    | The search query.                                                                 |
| `excludesKeys`     | string[] | `[]`    | An optional array of keys to exclude from the search.                             |
| `onlyVertexSearch` | boolean  | `false` | A boolean indicating whether to search only by vertices, excluding nested arrays. |

The function returns an array of items that match the search query.

You can use this function for your own search or sort arrays by found values.

## Engines

```
react: 18.3.1
typescript: 4.9.5
node: >=14.0.0
```

## Contribution

If you find any problems or have suggestions for improvement:

- Feel free to submit a pull request.
- Create issues.
- Email me at german.work11@gmail.com
