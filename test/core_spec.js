import { List, Map, fromJS } from 'immutable'
import { describe, it } from 'mocha'
import { expect } from 'chai'

import { setEntries, next, vote } from '../src/core'

describe('application logic', () => {
  describe('setEntries', () => {
    it('adds the entries to the state', () => {
      const state = new Map()
      const entries = fromJS(['Trainspotting', '28 Days Later'])
      const nextState = setEntries(state, entries)
      expect(nextState).to.equal(fromJS({
        entries: ['Trainspotting', '28 Days Later'],
      }))
    })

    it('converts to immutable', () => {
      const state = new Map()
      const entries = ['Trainspotting', '28 Days Later']
      const nextState = setEntries(state, entries)
      expect(nextState).to.equal(fromJS({
        entries: ['Trainspotting', '28 Days Later'],
      }))
    })
  })

  describe('next', () => {
    it('takes the next two entries under vote', () => {
      const state = fromJS({
        entries: ['Trainspotting', '28 Days Later', 'Sunshine'],
      })
      const nextState = next(state)
      expect(nextState).to.equal(fromJS({
        vote: {
          pair: ['Trainspotting', '28 Days Later'],
        },
        entries: ['Sunshine'],
      }))
    })

    it('puts winner of current vote back to entries', () => {
      const state = fromJS({
        vote: {
          pair: ['Trainspotting', '28 Days Later'],
          tally: {
            Trainspotting: 4,
            '28 Days Later': 2,
          },
        },
        entries: ['Sunshine', 'Millions', '127 Hours'],
      })
      const nextState = next(state)
      expect(nextState).to.equal(fromJS({
        vote: {
          pair: ['Sunshine', 'Millions'],
        },
        entries: ['127 Hours', 'Trainspotting'],
      }))
    })

    it('puts both from tied vote back to entries', () => {
      const state = fromJS({
        vote: {
          pair: ['Trainspotting', '28 Days Later'],
          tally: {
            Trainspotting: 3,
            '28 Days Later': 3,
          },
        },
        entries: ['Sunshine', 'Millions', '127 Hours'],
      })
      const nextState = next(state)
      expect(nextState).to.equal(fromJS({
        vote: {
          pair: ['Sunshine', 'Millions'],
        },
        entries: ['127 Hours', 'Trainspotting', '28 Days Later'],
      }))
    })

    it('marks winner when just one entry left', () => {
      const state = fromJS({
        vote: {
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: {
            Trainspotting: 4,
            '28 Days Later': 2,
          },
        },
        entries: [],
      })
      const nextState = next(state)
      expect(nextState).to.equal(fromJS({
        winner: 'Trainspotting',
      }))
    })
  })

  describe('vote', () => {
    it('creates a tally for the voted entry', () => {
      const state = fromJS({
        vote: {
          pair: ['Trainspotting', '28 Days Later'],
        },
        entries: [],
      })
      const nextState = vote(state, 'Trainspotting')
      expect(nextState).to.equal(fromJS({
        vote: {
          pair: ['Trainspotting', '28 Days Later'],
          tally: {
            Trainspotting: 1,
          },
        },
        entries: [],
      }))
    })

    it('adds to existing tally for the voted entry', () => {
      const state = fromJS({
        vote: {
          pair: ['Trainspotting', '28 Days Later'],
          tally: {
            Trainspotting: 3,
            '28 Days Later': 2,
          },
        },
        entries: [],
      })
      const nextState = vote(state, 'Trainspotting')
      expect(nextState).to.equal(fromJS({
        vote: {
          pair: ['Trainspotting', '28 Days Later'],
          tally: {
            Trainspotting: 4,
            '28 Days Later': 2,
          },
        },
        entries: [],
      }))
    })
  })
})