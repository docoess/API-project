const LOAD_EVENTS = 'events/LOAD';
const GET_EVENT = 'events/GET_ONE';

export const actionLoadAllEvents = (events) => {
  return {
    type: LOAD_EVENTS,
    events
  }
}

export const actionGetEventInfo = (event, eventInfo) => {
  return {
    type: GET_EVENT,
    event,
    eventInfo
  }
}

export const thunkFetchEvents = () => async (dispatch, getState) => {
  const currState = getState().eventState;
  if (Object.keys(currState).length === 0) {
    const response = await fetch('/api/events');
    const events = await response.json();
    dispatch(actionLoadAllEvents(events));
    return events;
  }
  return currState;
}

export const thunkFetchEventInfo = (eventId) => async (dispatch, getState) => {
  const currState = getState().eventState;
  const currEvent = await fetch(`/api/events/${eventId}`);
  const eventInfo = await currEvent.json();
  let event = currState[eventId];
  dispatch(actionGetEventInfo(event, eventInfo));
  return event;
}

const initialState = { };

const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_EVENTS: {
      const normalizedEvents = {};
      Object.values(action.events.Events).forEach(event => {
        normalizedEvents[event.id] = event;
      });
      const newState = { ...normalizedEvents };
      return newState;
    }
    case GET_EVENT: {
      const event = action.event;
      const info = action.eventInfo;
      const EventImages = info.EventImages;
      const Venue = info.Venue || {};
      const newState = { ...state, [event.id]: {...state[event.id], ...event, EventImages, Venue} };
      return newState;
    }
    default:
      return state;
  }
}

export default eventReducer;
