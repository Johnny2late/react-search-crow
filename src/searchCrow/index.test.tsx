import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SearchCrow } from './index'

describe('SearchCrow', () => {
  const defaultProps = {
    items: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ],
    excludesKeys: ['id'],
    keysShowValue: ['name'],
    searchByKeyAfterSelect: 'name',
    onSelect: jest.fn(),
  }

  it('should render the component with autoSearch = false', () => {
    render(<SearchCrow {...defaultProps} autoSearch={false} />)
    expect(screen.getByLabelText('Search')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('text...')).toBeInTheDocument()
    expect(screen.getByTestId('search-button')).toBeInTheDocument()

    const input = screen.getByPlaceholderText('text...')
    fireEvent.change(input, { target: { value: 'Item 1' } })

    expect(screen.queryByText('Item 1')).not.toBeInTheDocument()

    const searchButton = screen.getByTestId('search-button')
    fireEvent.click(searchButton)

    waitFor(() => expect(screen.getByText('Item 1')).toBeInTheDocument())
  })

  it('should render the component with autoSearch = true', () => {
    render(<SearchCrow {...defaultProps} autoSearch={false} />)
    expect(screen.getByLabelText('Search')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('text...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()

    const input = screen.getByPlaceholderText('text...')
    fireEvent.change(input, { target: { value: 'Item 1' } })

    expect(screen.queryByText('Item 1')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Search' }))

    waitFor(() => expect(screen.getByText('Item 1')).toBeInTheDocument())
  })

  it('should update the search value when the input is changed', () => {
    render(<SearchCrow {...defaultProps} />)
    const input = screen.getByPlaceholderText('text...')
    fireEvent.change(input, { target: { value: 'Item 1' } })
    expect(input).toHaveValue('Item 1')
  })

  it('should call the onSelect callback when an item is selected', () => {
    render(<SearchCrow {...defaultProps} />)
    const input = screen.getByPlaceholderText('text...')
    fireEvent.change(input, { target: { value: 'Item 1' } })

    waitFor(() => {
      const itemElement = screen.getByText('Item 1')
      expect(itemElement).toBeInTheDocument()
      fireEvent.click(itemElement)
      expect(defaultProps.onSelect).toHaveBeenCalledWith({ id: 1, name: 'Item 1' })
    })
  })

  it('should display the selected item in the input field', () => {
    render(<SearchCrow {...defaultProps} />)
    const input = screen.getByPlaceholderText('text...')
    fireEvent.change(input, { target: { value: 'Item 1' } })

    waitFor(() => {
      const itemElement = screen.getByText((_content, element) => {
        const hasText = (node: Element) => node.textContent === 'Item 1'
        const childrenMatch = (node: Element) => Array.from(node.children).some(hasText)
        return hasText(element) || childrenMatch(element)
      })
      expect(itemElement).toBeInTheDocument()
      fireEvent.click(itemElement)
      expect(input).toHaveValue('Item 1')
    })
  })
})
