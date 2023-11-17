const LOAD_GROUPS = 'groups/LOAD';

export const actionLoadAllGroups = (groups) => {
  return {
    type: LOAD_GROUPS,
    groups
  }
}

export const thunkFetchGroups = () => async (dispatch) => {
  const response = await fetch('/api/groups');
  const groups = await response.json();
  dispatch(actionLoadAllGroups(groups));
}

const initialState = { Groups: {} };

const groupReducer = (state = initialState, action) => {
  switch (action.type){
    case LOAD_GROUPS: {
      const newState = { ...state, Groups: [...action.groups.Groups] };
      console.log(newState);
      return newState;
    }
    default:
      return state;
  }
}

export default groupReducer;
