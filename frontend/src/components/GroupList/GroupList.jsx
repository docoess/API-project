import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { thunkFetchGroups } from '../../store/groups';
import { NavLink } from 'react-router-dom'
import GroupItem from "./GroupItem"
import './GroupList.css';

export default function GroupList() {
  const dispatch = useDispatch();
  const groups = useSelector(state => Object.values(state.groupState.Groups));

  useEffect(() => {
    dispatch(thunkFetchGroups());
  }, [dispatch]);

  return (
    <div>
      <h1>Groups</h1>
      <ul className='groups-list'>
        {
          groups.map(group => (
            <NavLink className={'group-navlink'} key={group.id} to={`/groups/${group.id}`}>
              <GroupItem
                key={group.id}
                group={group}
              />
            </NavLink>
          ))
        }
      </ul>
    </div>
  )
}
