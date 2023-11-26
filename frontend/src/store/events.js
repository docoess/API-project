import Cookies from "js-cookie";

const LOAD_EVENTS = 'events/LOAD';
const GET_EVENT = 'events/GET_ONE';
const CREATE_EVENT = 'events/CREATE';

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

export const actionCreateEvent = (event) => {
  return {
    type: CREATE_EVENT,
    event
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

export const thunkFetchPostEvent = (event, groupId) => async (dispatch) => {
  const reqBody = event;
  const route = `/api/groups/${groupId}/events`;

  const response = await fetch(route, {method: 'POST', headers: {"Content-Type": "application/json", "XSRF-Token": Cookies.get('XSRF-TOKEN')}, body: JSON.stringify(reqBody)});
  const newEvent = await response.json();
  dispatch(actionCreateEvent(newEvent));
  return newEvent;
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
    case CREATE_EVENT: {
      const event = action.event;
      const newState = { ...state, [event.id]: {...state[event.id], ...event}}
      return newState;
    }
    default:
      return state;
  }
}

export default eventReducer;
