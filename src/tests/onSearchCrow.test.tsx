import { iteratingArray } from '../searchCrow/onSearchCrow'

// iteratingArray

describe('iteratingArray', () => {
  it('should return the correct results for a number array', () => {
    const list = [1, 2, 3, 4, 33, [333]]
    const results = iteratingArray(list, '3', 0, list.length - 1, [], false)

    expect(results).toEqual([3, 33, 333])
  })

  it('should return the correct results for a number array onlyVertexSearch', () => {
    const list = [1, 2, 3, 4, 33, [333]]
    const results = iteratingArray(list, '3', 0, list.length - 1, [], true)

    expect(results).toEqual([3, 33])
  })

  it('should return the correct results for a string array', () => {
    const list = ['1', 'text 1', 'text', 'text2', ['text1']]
    const results = iteratingArray(list, '1', 0, list.length - 1, [], false)

    expect(results).toEqual(['1', 'text 1', 'text1'])
  })

  it('should return the correct results for a string array', () => {
    const list = ['1', 'text 1', 'text', 'text2', ['text1']]
    const results = iteratingArray(list, 'text', 0, list.length - 1, [], false)

    expect(results).toEqual(['text', 'text 1', 'text2', 'text1'])
  })

  it('should return the correct results for a string array onlyVertexSearch', () => {
    const list = ['1', 'text 1', 'text', 'text2', ['text1']]
    const results = iteratingArray(list, '1', 0, list.length - 1, [], true)

    expect(results).toEqual(['1', 'text 1'])
  })

  it('should handle nested arrays', () => {
    const list = [
      { name: 'John Doe', hobbies: ['reading', 'gardening'] },
      { name: 'Jane Smith', hobbies: ['swimming', 'hiking'] },
      { name: 'Bob Johnson', hobbies: ['painting', 'cooking'] },
    ]
    const results = iteratingArray(list, 'king', 0, list.length - 1, ['name'], false)

    expect(results).toEqual([
      { name: 'Jane Smith', hobbies: ['swimming', 'hiking'] },
      { name: 'Bob Johnson', hobbies: ['painting', 'cooking'] },
    ])
  })

  it('should handle nested objects', () => {
    const list = [
      { name: 'John Doe', info: { email: 'john@example.com', phone: '555-1234' } },
      { name: 'Jane Smith', info: { email: 'jane@example.com', phone: '555-5678' } },
      { name: 'Bob Johnson', info: { email: 'bob@example.com', phone: '555-9012' } },
    ]
    const results = iteratingArray(list, '555', 0, list.length - 1, ['name'], false)

    expect(results).toEqual([
      { name: 'Jane Smith', info: { email: 'jane@example.com', phone: '555-5678' } },
      { name: 'John Doe', info: { email: 'john@example.com', phone: '555-1234' } },
      { name: 'Bob Johnson', info: { email: 'bob@example.com', phone: '555-9012' } },
    ])
  })

  it('should handle onlyVertexSearch', () => {
    const list = [
      { name: 'John Doe', hobbies: ['reading', 'gardening'] },
      { name: 'Jane Smith', hobbies: ['swimming', 'hiking'] },
      { name: 'Bob Johnson', hobbies: ['painting', 'cooking'] },
    ]
    const results = iteratingArray(list, 'king', 0, list.length - 1, [], true)

    expect(results).toEqual([])
  })

  it('should handle onlyVertexSearch', () => {
    const list = [
      { name: 'John Doe', hobbies: ['reading', 'gardening'] },
      { name: 'Jane Smith', hobbies: ['swimming', 'hiking'] },
      { name: 'Read Johnson', hobbies: ['painting', 'cooking'] },
    ]
    const results = iteratingArray(list, 'read', 0, list.length - 1, [], true)

    expect(results).toEqual([{ name: 'Read Johnson', hobbies: ['painting', 'cooking'] }])
  })
})
