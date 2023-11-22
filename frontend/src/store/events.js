const LOAD_EVENTS = 'events/LOAD';
const GET_EVENT = 'events/GET_ONE';

export const actionLoadAllEvents = (events) => {
  return {
    type: LOAD_EVENTS,
    events
  }
}

export const actionGetEventInfo = (event) => {
  return {
    type: GET_EVENT,
    event
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

export const thunkFetchEventInfo = (eventId) => async (dispatch) => {
  const response = await fetch(`/api/events/${eventId}`);
  const eventInfo = await response.json();
  dispatch(actionGetEventInfo(eventInfo));
  return eventInfo;
}

const initialState = { };

const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_EVENTS: {
      const newState = { ...action.events };
      return newState;
    }
    case GET_EVENT: {
      const event = action.event;
      const newState = { ...state, [event.id]: {...state[event.id], ...event} };
      return newState;
    }
    default:
      return state;
  }
}

export default eventReducer;
