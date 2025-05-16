import { removeDuplicates } from './removeDuplicates';
import { expect, it, describe } from 'vitest'

describe('removeDuplicates', () => {
  it('should remove a duplicated number', () => {
    expect(removeDuplicates([1, 2, 1])).toStrictEqual([1, 2])
  })

  it('should remove a duplicated string', () => {
    expect(removeDuplicates(['1', '2', '1'])).toStrictEqual(['1', '2'])
  })
})
