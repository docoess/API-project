import { thunkFetchGroupInfo } from '../../store/groups';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import ph_icon from './PH_icon.jpg';
import './GroupItem.css'

export default function GroupItem({ group }) {
  const dispatch = useDispatch();
  const groupId = group.id;
  let groupInfo;

  useEffect(() => {

    const getGroupDetails = async () => {
      if (group !== undefined) {
       groupInfo = await dispatch(thunkFetchGroupInfo(groupId));
      }
    }

    getGroupDetails();
  }, []);

  return (
    <div className='group-list-item'>
      <img className='group-preview-image' src={ph_icon} />
      <div className='group-entry'>
        <span className='group-name'>{group && group.name}</span>
        <span className='group-loc'>{group && group.city}, {group && group.state}</span>
        <span className='group-about'>{group && group.about}</span>
        <span className='group-misc'>{`${groupInfo && groupInfo.Events.length} events `} * {group && group.private ? 'Private' : 'Public'}</span>
      </div>
    </div>
  )
}
