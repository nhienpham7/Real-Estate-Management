import { describe, it, expect } from 'vitest'
import { nightsBetween } from '../src/utils/booking'

describe('nightsBetween', () => {
    it('calculates nights correctly for 2 nights', () => {
        const s = '2025-12-10'
        const e = '2025-12-12'
        expect(nightsBetween(s, e)).toBe(2)
    })

    it('returns 0 for invalid or same-date ranges', () => {
        expect(nightsBetween('2025-12-10', '2025-12-10')).toBe(0)
        expect(nightsBetween('', '')).toBe(0)
        expect(nightsBetween('invalid', '2025-12-12')).toBe(0)
    })
})
