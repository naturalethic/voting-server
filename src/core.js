import { List, Map } from 'immutable'

export const INITIAL_STATE = new Map()

export function setEntries(state, entries) {
  return state.set('entries', new List(entries))
}

function getWinners(v) {
  if (!v) return []
  const [a, b] = v.get('pair')
  const aVotes = v.getIn(['tally', a], 0)
  const bVotes = v.getIn(['tally', b], 0)
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
    ['vote', 'tally', entry],
    0,
    tally => tally + 1
  )
}
