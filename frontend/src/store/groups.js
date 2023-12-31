import Cookies from "js-cookie";

const LOAD_GROUPS = 'groups/LOAD';
const GET_GROUP = 'groups/GET_ONE';
const CREATE_GROUP = 'groups/CREATE';
const UPDATE_GROUP = '/groups/UPDATE';
const DELETE_GROUP = '/groups/DELETE';

export const actionLoadAllGroups = (groups) => {
  return {
    type: LOAD_GROUPS,
    groups
  }
}

export const actionGetGroupInfo = (group, events, groupInfo) => {
  return {
    type: GET_GROUP,
    group,
    events,
    groupInfo
  }
}

export const actionCreateGroup = (group) => {
  return {
    type: CREATE_GROUP,
    group
  }
}

export const actionUpdateGroup = (group) => {
  return {
    type: UPDATE_GROUP,
    group
  }
}

export const actionDeleteGroup = (groupId) => {
  return {
    type: DELETE_GROUP,
    groupId
  }
}

export const thunkFetchGroups = () => async (dispatch, getState) => {
  const currState = getState().groupState;
  if (Object.keys(currState).length === 0) {
    const response = await fetch('/api/groups');
    const groups = await response.json();
    dispatch(actionLoadAllGroups(groups));
    return groups;
  }
  return currState;
}

export const thunkFetchGroupInfo = (groupId) => async (dispatch) => {
  const currGroup = await fetch(`/api/groups/${groupId}`);
  const groupInfo = await currGroup.json();
  const eventsResponse = await fetch(`/api/groups/${groupId}/events`);
  const eventsInfo = await eventsResponse.json();
  let group = groupInfo;
  dispatch(actionGetGroupInfo(group, eventsInfo, groupInfo));
  return group;
}

export const thunkFetchPostGroup = (group) => async (dispatch) => {
  const reqBody = group;
  const route = '/api/groups';

  const response = await fetch(route, {method: 'POST', headers: {"Content-Type": "application/json", "XSRF-Token": Cookies.get('XSRF-TOKEN')}, body: JSON.stringify(reqBody)});
  const newGroup = await response.json();
  dispatch(actionCreateGroup(newGroup));
  return newGroup;
}

export const thunkFetchPutGroup = (group, groupId) => async (dispatch) => {
  const reqBody = group;
  const route = `/api/groups/${groupId}`;

  const response = await fetch(route, {method: 'PUT', headers: {"Content-Type": "application/json", "XSRF-Token": Cookies.get('XSRF-TOKEN')}, body: JSON.stringify(reqBody)});
  const updatedGroup = await response.json();
  dispatch(actionUpdateGroup(updatedGroup));
  return updatedGroup;
}

export const thunkFetchDeleteGroup = (groupId) => async (dispatch) => {
  const route = `/api/groups/${groupId}`;

  await fetch(route, {method: 'DELETE', headers: {"XSRF-Token": Cookies.get('XSRF-TOKEN')}});

  dispatch(actionDeleteGroup(groupId));
}

const initialState = { };

const groupReducer = (state = initialState, action) => {
  switch (action.type){
    case LOAD_GROUPS: {
      const normalizedGroups = {};
      Object.values(action.groups.Groups).forEach(group => {
        normalizedGroups[group.id] = group;
      });
      const newState = { ...normalizedGroups };
      return newState;
    }
    case GET_GROUP: {
      const group = action.group;
      const events = action.events;
      const info = action.groupInfo;
      const GroupImages = info.GroupImages;
      const Organizer = info.Organizer;
      const Venues = info.Venues;
      const newState = { ...state, [group.id]: {...state[group.id], ...group, ...events, GroupImages, Organizer, Venues } };
      return newState;
    }
    case CREATE_GROUP: {
      const group = action.group;
      const newState = { ...state, [group.id]: {...state[group.id], ...group}}
      return newState;
    }
    case UPDATE_GROUP: {
      const group = action.group;
      const newState = { ...state, [group.id]: {...state[group.id], ...group}}
      return newState;
    }
    case DELETE_GROUP: {
      const newState = { ...state };
      delete newState[action.groupId];
      return newState;
    }
    default:
      return state;
  }
}

export default groupReducer;
