import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { thunkFetchGroups } from '../../store/groups';
import { NavLink } from 'react-router-dom'
import GroupItem from "./GroupItem"
import './GroupList.css';

export default function GroupList() {
  const dispatch = useDispatch();
  let groups = useSelector(state => Object.values(state.groupState));


  useEffect(() => {

    const getGroups = async () => {
      await dispatch(thunkFetchGroups());
    }

    getGroups();
  }, [dispatch]);

  return (
    <div className='groups-list-container'>
      <nav className='group-list-buttons'>
        <NavLink to='/events'>Events</NavLink>  <NavLink to='/groups'>Groups</NavLink>
      </nav>
      <ul className='groups-list'>
        {
          groups && groups.map(group => {
            return (
            <NavLink className={'group-navlink'} key={group.id} to={`/groups/${group.id}`}>
              <GroupItem
                key={group.id}
                group={group}
              />
            </NavLink>
          )})
        }
      </ul>
    </div>
  )
}
