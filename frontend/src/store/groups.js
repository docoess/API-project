import Cookies from "js-cookie";

const LOAD_GROUPS = 'groups/LOAD';
const GET_GROUP = 'groups/GET_ONE';
const CREATE_GROUP = 'groups/CREATE';

export const actionLoadAllGroups = (groups) => {
  return {
    type: LOAD_GROUPS,
    groups
  }
}

export const actionGetGroupInfo = (group, events) => {
  return {
    type: GET_GROUP,
    group,
    events
  }
}

export const actionCreateGroup = (group) => {
  return {
    type: CREATE_GROUP,
    group
  }
}

export const thunkFetchGroups = () => async (dispatch) => {
  const response = await fetch('/api/groups');
  const groups = await response.json();
  dispatch(actionLoadAllGroups(groups));
  return groups;
}

export const thunkFetchGroupInfo = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}`);
  const groupInfo = await response.json();
  const eventsResponse = await fetch(`/api/groups/${groupId}/events`);
  const eventsInfo = await eventsResponse.json();
  groupInfo.Events = eventsInfo.Events;
  dispatch(actionGetGroupInfo(groupInfo, eventsInfo));
  return groupInfo;
}

export const thunkFetchPostGroup = (group) => async (dispatch) => {
  const reqBody = group;
  const route = '/api/groups';

  const response = await fetch(route, {method: 'POST', headers: {"Content-Type": "application/json", "XSRF-Token": Cookies.get('XSRF-TOKEN')}, body: JSON.stringify(reqBody)});
  const newGroup = await response.json();
  console.log('NEW GROUP', newGroup)
  dispatch(actionCreateGroup(newGroup));
  return newGroup;
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
      const Events = action.events;
      const newState = { ...state, [group.id]: {...state[group.id], ...group, ...Events} };
      return newState;
    }
    case CREATE_GROUP: {
      const group = action.group;
      const newState = { ...state, [group.id]: {...state[group.id], ...group}}
      return newState;
    }
    default:
      return state;
  }
}

export default groupReducer;
