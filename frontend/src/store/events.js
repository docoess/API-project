const LOAD_EVENTS = 'events/LOAD';

export const actionLoadAllEvents = (events) => {
  return {
    type: LOAD_EVENTS,
    events
  }
}

export const thunkFetchEvents = () => async (dispatch) => {
  const response = await fetch('/api/events');
  const events = await response.json();
  const normalizedEvents = {};
  Object.values(events.Events).forEach(event => {
    normalizedEvents[event.id] = event;
  });
  dispatch(actionLoadAllEvents(normalizedEvents));
  return normalizedEvents;
}

const initialState = { };

const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_EVENTS: {
      const newState = { ...action.events };
      return newState;
    }
    default:
      return state;
  }
}

export default eventReducer;
