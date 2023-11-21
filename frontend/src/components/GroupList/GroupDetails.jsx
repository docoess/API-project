import { useParams, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkFetchGroupInfo, thunkFetchGroups } from '../../store/groups';
import { useEffect } from 'react';
import './GroupDetails.css';
import ph_pic from './PH_infographic.jpg'

export default function GroupDetails() {
  const dispatch = useDispatch();
  const { groupId } = useParams();
  let groups;
  let group;

  console.log('INITIAL GROUP', group);

  useEffect(() => {

    const getGroupDetails = async () => {
      groups = await dispatch(thunkFetchGroups());
      console.log('GROUPS', groups)
      group = Object.values(groups).find(el => el.id == groupId);
      console.log('GROUP', group)
      if (group !== undefined) {
        await dispatch(thunkFetchGroupInfo(group.id));
      }
    }

    getGroupDetails();

  }, []);

  groups = useSelector(state => state.groupState.Groups);
  group = groups[groupId];

  console.log('GROUP DETAILS', group)
  console.log('GROUP IMAGES', group && group.GroupImages && group.GroupImages[0])

  return (
    <>
      <NavLink id='return-to-groups' to='/groups'>&lt; Groups</NavLink>
      <div className='group-details-top-container'>
        <div className='group-info-top'>
          <div className='group-picture'>
            <img src={ph_pic}/>
          </div>
          <div className='group-info-text'>
            <h1>{group && group.name}</h1>
            <p>{group && `${group.city}, ${group.state}`}</p>
            <p>{group && `${group.Events && group.Events.length} events * ${group.private ? 'Private' : 'Public'}`}</p>
            <p>Organized by {group && group.Organizer && `${group.Organizer.firstName} ${group.Organizer.lastName}`}</p>
            <button>Join this group</button>
          </div>
        </div>
        <div className='group-info-mid'>
          <p>Organizer </p>
          <p>{group && group.Organizer && `${group.Organizer.firstName} ${group.Organizer.lastName}`}</p>
          <h2>What we&apos;re about</h2>
          <p>{group && group.about}</p>
        </div>
      </div>
    </>
  )
}
