import { INITIAL_STATE, setEntries, next, vote } from './core'

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_ENTRIES':
      return setEntries(state, action.entries)
    case 'NEXT':
      return next(state)
    case 'VOTE':
      return state.update('vote', s => vote(s, action.entry))
    default:
      return state
  }
}
