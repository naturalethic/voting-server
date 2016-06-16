import { List, Map } from 'immutable'

export const INITIAL_STATE = new Map()

export function setEntries(state, entries) {
  return state.set('entries', new List(entries))
}

function getWinners(state) {
  if (!state) return []
  const [a, b] = state.get('pair')
  const aVotes = state.getIn(['tally', a], 0)
  const bVotes = state.getIn(['tally', b], 0)
  return ((aVotes > bVotes) && [a]) || ((aVotes < bVotes) && [b]) || [a, b]
}

export function next(state) {
  const entries = state.get('entries').concat(getWinners(state.get('vote')))
  if (entries.size === 1) {
    return state.remove('vote')
                .remove('entries')
                .set('winner', entries.first())
  }
  return state.merge({
    vote: new Map({ pair: entries.take(2) }),
    entries: entries.skip(2),
  })
}

export function vote(state, entry) {
  return state.updateIn(
    ['tally', entry],
    0,
    tally => tally + 1
  )
}
