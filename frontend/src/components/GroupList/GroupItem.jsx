import ph_icon from './PH_icon.jpg';
import './GroupItem.css'

export default function GroupItem({ group }) {

  return (
    <div className='group-list-item'>
      <img className='group-preview-image' src={ph_icon} />
      <div className='group-entry'>
        <span className='group-name'>{group.name}</span>
        <span className='group-loc'>{group.city}, {group.state}</span>
        <span className='group-about'>{group.about}</span>
        <span className='group-misc'>## events * {group.private ? 'Private' : 'Public'}</span>
      </div>
    </div>
  )
}
