import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkFetchGroupInfo, thunkFetchGroups } from '../../store/groups';
import { useEffect } from 'react';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteGroupModal from '../DeleteGroupModal';
import './GroupDetails.css';

export default function GroupDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { groupId } = useParams();
  let groups;
  let group;
  let pastEvents;
  let futureEvents;
  const user = useSelector(state => state.session.user);
  const userId = user && user.id;

  useEffect(() => {

    const getGroupDetails = async () => {
      groups = await dispatch(thunkFetchGroups());
      group = Object.values(groups).find(el => el.id == Number(groupId));
      if (groupId) {
        await dispatch(thunkFetchGroupInfo(groupId));
      }
    }

    getGroupDetails();

  }, [dispatch]);

  const handleJoinClick = () => {
    alert('Feature Coming Soon...');
  }

  const handleUpdateClick = (groupId) => {
    navigate(`/groups/${groupId}/edit`);
  }

  const handleCreateEventClick = (groupId) => {
    navigate(`/groups/${groupId}/events/new`);
  }

  groups = useSelector(state => state.groupState);
  group = groups[groupId];

  const groupImage = group && group.GroupImages && group.GroupImages[0].url;
  futureEvents = group && group.Events && group.Events.filter(event => Date.parse(event.startDate) > Date.now());
  pastEvents = group && group.Events && group.Events.filter(event => Date.parse(event.startDate) < Date.now());

  return (
    <>
    <div id='group-details-container'>
        <div className='group-details-top-container'>
        <NavLink id='return-to-groups' to='/groups'>&lt; Groups</NavLink>
          <div className='group-info-top'>
            <div>
              <img className='group-picture' src={groupImage}/>
            </div>
            <div className='group-info-text'>
              <h1>{group && group.name}</h1>
              <p>{group && `${group.city}, ${group.state}`}</p>
              <p>{group && `${group.Events && group.Events.length} events * ${group.private ? 'Private' : 'Public'}`}</p>
              <p>Organized by {group && group.Organizer && `${group.Organizer.firstName} ${group.Organizer.lastName}`}</p>
              {
                user && group && userId === group.organizerId &&
                <span>
                  <button onClick={() => handleCreateEventClick(groupId)}>Create Event</button>
                  <button onClick={() => handleUpdateClick(groupId)}>Update</button>
                  <OpenModalMenuItem
                    itemText='Delete'
                    modalComponent={<DeleteGroupModal group={group} />}
                  />
                </span>
              }
              {
                user && group && userId !== group.organizerId && <button className='join-group-btn' onClick={handleJoinClick}>Join this group</button>
              }
            </div>
          </div>
        </div>
        <div className='group-info-mid'>
          <div className='mid-info-content'>
            <p id='details-organizer-label'>Organizer </p>
            <p id='details-organizer'>{group && group.Organizer && `${group.Organizer.firstName} ${group.Organizer.lastName}`}</p>
            <h2 id='details-label'>What we&apos;re about</h2>
            <p id='details'>{group && group.about}</p>
            {
              futureEvents && futureEvents.length > 0 && <p className='upcoming-label'>Upcoming Events ({futureEvents.length})</p>
            }
            {
              futureEvents && futureEvents.map(event => {
                  const fullDateTime = new Date(event.startDate);
                  const yyyy = fullDateTime.getFullYear();
                  const mm = fullDateTime.getMonth();
                  const dd = fullDateTime.getDate();
                  const hours = fullDateTime.getHours();
                  const minutes = fullDateTime.getMinutes();

                  const yearString = `${yyyy}-${Number(mm) < 10 ? `0${mm+1}` : `${mm+1}` }-${dd < 10 ? `0${dd}` : `${dd}`}`;
                  const eventTime = `${hours < 10 ? `0${hours}` : `${hours}`}:${minutes < 10 ? `0${minutes}` : `${minutes}`}`;
                return (
                  <NavLink className={'group-details-event-navlink'} key={event.id} to={`/events/${event.id}`}>
                    <div className='group-details-event-info'>
                      <div className='event-details-top'>
                        <img className='event-preview-image' src={event.previewImage}/>
                        <div className='event-preview-details'>
                          <span className='event-date'>{yearString} * {eventTime}</span>
                          <span>{event.name}</span>
                          <span>{event && event.Venue && event.Venue.city + ', ' + event.Venue.state || event.type}</span>
                        </div>
                      </div>
                      <div className='event-details-bottom'>
                        <span className='event-desc'>{event.description}</span>
                      </div>
                    </div>
                  </NavLink>
                )
              })
            }
            {
              pastEvents && pastEvents.length > 0 && <p className='past-label'>Past Events ({pastEvents.length})</p>
            }
            {
              pastEvents && pastEvents.map(event => {
                const fullDateTime = new Date(event.startDate);
                const yyyy = fullDateTime.getFullYear();
                const mm = fullDateTime.getMonth();
                const dd = fullDateTime.getDate();
                const hours = fullDateTime.getHours();
                const minutes = fullDateTime.getMinutes();

                const yearString = `${yyyy}-${Number(mm) < 10 ? `0${mm+1}` : `${mm+1}` }-${dd < 10 ? `0${dd}` : `${dd}`}`;
                const eventTime = `${hours < 10 ? `0${hours}` : `${hours}`}:${minutes < 10 ? `0${minutes}` : `${minutes}`}`;
              return (
                <NavLink className={'group-details-event-navlink'} key={event.id} to={`/events/${event.id}`}>
                  <div className='group-details-event-info'>
                    <div className='event-details-top'>
                      <img className='event-preview-image' src={event.previewImage}/>
                      <div className='event-preview-details'>
                        <span className='event-date'>{yearString} * {eventTime}</span>
                        <span className='event-details-title'>{event.name}</span>
                        <span>{event && event.Venue && event.Venue.city + ', ' + event.Venue.state || event.type}</span>
                      </div>
                    </div>
                    <div className='event-details-bottom'>
                      <span className='event-desc'>{event.description}</span>
                    </div>
                  </div>
                </NavLink>
              )
            })
            }
            {
              futureEvents && pastEvents && futureEvents.length === 0 && pastEvents.length === 0 && <p className='no-events-label'>No Upcoming Events</p>
            }
          </div>
        </div>
      </div>
    </>
  )
}
