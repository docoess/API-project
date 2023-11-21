import { thunkFetchGroupInfo } from '../../store/groups';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import './GroupItem.css'

export default function GroupItem({ group }) {
  const dispatch = useDispatch();
  const groupId = group.id;
  const groupImage = group && group.GroupImages && group.GroupImages[0].url;

  useEffect(() => {

    const getGroupDetails = async () => {
      if (group !== undefined) {
       await dispatch(thunkFetchGroupInfo(groupId));
      }
    }

    getGroupDetails();
  }, [dispatch]);


  return (
    <div className='group-list-item'>
      <img className='group-preview-image' src={groupImage} />
      <div className='group-entry'>
        <span className='group-name'>{group && group.name}</span>
        <span className='group-loc'>{group && group.city}, {group && group.state}</span>
        <span className='group-about'>{group && group.about}</span>
        <span className='group-misc'>{`${group && group.Events && group.Events.length !== 1 ? `${group.Events && group.Events.length} events` : `${group.Events && group.Events.length} event`}`} * {group && group.private ? 'Private' : 'Public'}</span>
      </div>
    </div>
  )
}
