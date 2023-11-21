const LOAD_GROUPS = 'groups/LOAD';
const GET_GROUP = 'groups/GET_ONE';

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

export const thunkFetchGroups = () => async (dispatch) => {
  const response = await fetch('/api/groups');
  const groups = await response.json();
  const normalizedGroups = {};
  Object.values(groups.Groups).forEach(group => {
    normalizedGroups[group.id] = group;
  });
  console.log('NORMALIZED GROUPS', normalizedGroups)
  await dispatch(actionLoadAllGroups(normalizedGroups));
  return normalizedGroups;
}

export const thunkFetchGroupInfo = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}`);
  const groupInfo = await response.json();
  const eventsResponse = await fetch(`/api/groups/${groupId}/events`);
  const eventsInfo = await eventsResponse.json();
  groupInfo.Events = eventsInfo.Events;
  await dispatch(actionGetGroupInfo(groupInfo, eventsInfo));
  return groupInfo;
}

const initialState = { Groups: { Events: {} } };

const groupReducer = (state = initialState, action) => {
  switch (action.type){
    case LOAD_GROUPS: {
      const newState = { ...state, Groups: {...action.groups} };
      // console.log('NEW STATE', newState);
      return newState;
    }
    case GET_GROUP: {
      const group = action.group;
      const events = action.events;
      console.log('ACTION GROUP', group);
      console.log('ACTION EVENTS', events);
      const newState = { ...state, Groups: {...state.Groups, [group.id]: group } };
      // console.log('NEW STATE =========', newState);
      return newState;
    }
    default:
      return state;
  }
}

export default groupReducer;
