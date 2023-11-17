const LOAD_EVENTS = 'events/LOAD';

export const actionLoadAllEvents = () => {
  return {
    type: LOAD_EVENTS
  }
}

const initialState = { events: {} };

const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
}

export default eventReducer;
