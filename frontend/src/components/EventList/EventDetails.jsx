import { useDispatch, useSelector } from "react-redux";
import { useParams, NavLink, Link } from "react-router-dom";
import { thunkFetchEventInfo, thunkFetchEvents } from "../../store/events";
import { thunkFetchGroupInfo, thunkFetchGroups } from '../../store/groups';
import { useEffect } from "react";
import './EventDetails.css'
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteEventModal from "../DeleteEventModal/DeleteEventModal";

export default function EventDetails() {
  // const navigate = useNavigate(); , useNavigate
  const dispatch = useDispatch();
  const { eventId } = useParams();
  let events;
  let event;
  let groups;
  let group;
  const user = useSelector(state => state.session.user);
  const userId = user && user.id;

  useEffect(() => {

    const getEvents = async () => {
      let events = await dispatch(thunkFetchEvents());
      return events;
    }

    const getEventDetails = async (events) => {
      let event = Object.values(events).find(el => el.id == Number(eventId));
      await dispatch(thunkFetchEventInfo(eventId));
      return event;
    }

    const getGroups = async () => {
      await dispatch(thunkFetchGroups());
    }

    const getGroupDetails = async (event) => {
      if (event && event.groupId) {
        await dispatch(thunkFetchGroupInfo(event.groupId));
      }
    }

    const getAllData = async () => {
      let events = await getEvents();
      let event = await getEventDetails(events);
      await getGroups();
      await getGroupDetails(event);
    }

    getAllData();

  }, [dispatch]);


  events = useSelector(state => state.eventState);
  groups = useSelector(state => state.groupState);
  event = events[eventId];
  group = event && groups[event.groupId];

  console.log('GROUP', group)

  const eventImage = event && event.EventImages && event.EventImages[0].url;
  const groupImage = group && group.GroupImages && group.GroupImages[0].url;

  const makeTimeString = (datetime) => {
    const fullDateTime = new Date(datetime);
    const yyyy = fullDateTime.getFullYear();
    const mm = fullDateTime.getMonth();
    const dd = fullDateTime.getDate();
    const hours = fullDateTime.getHours();
    const minutes = fullDateTime.getMinutes();

    const yearString = `${yyyy}-${Number(mm) < 10 ? `0${mm+1}` : `${mm+1}` }-${dd < 10 ? `0${dd}` : `${dd}`}`;
    const eventTime = `${hours < 10 ? `0${hours}` : `${hours}`}:${minutes < 10 ? `0${minutes}` : `${minutes}`}`;

    return `${yearString} * ${eventTime}`;
  }

  const eventStart = event && makeTimeString(event.startDate);
  const eventEnd = event && makeTimeString(event.endDate);

  return (
    <div className='event-details-container'>
      <div id="top-of-event-details">
        <NavLink id='return-to-events' to='/events'>&lt; Events</NavLink>
        <h1>{event && event.name}</h1>
        <h3>Hosted by {group && group.Organizer && group.Organizer.firstName}  {group && group.Organizer &&  group.Organizer.lastName}</h3>
      </div>
      <div className='event-details-top-container'>
        <div className='event-info-top'>
          <div>
            <img className='event-picture' src={eventImage} />
          </div>
          <div className='event-info-text'>
            { event && group &&
              <Link to={`/groups/${event.groupId}`}>
                <div className='event-group-info'>
                  <img id='group-image-on-event' src={groupImage} />
                  <p>{group && group.name}</p>
                  <p>{group && group.private ? 'Private' : 'Public'}</p>
                </div>
              </Link>
            }
            <div className='event-info-main'>
              {
                eventStart && <p className='event-date-info'>Start {eventStart}</p>
              }
              {
                eventEnd && <p className='event-date-info'>End {eventEnd}</p>
              }
              {
                event && <p>{event.price}</p>
              }
              {
                event && <p>{event.type}</p>
              }
            </div>
              {
                user && group && userId === group.organizerId &&
                <span>
                  <button>Update</button>
                  <OpenModalMenuItem
                    itemText='Delete'
                    modalComponent={<DeleteEventModal event={event} group={group} />}
                  />
                </span>
              }
          </div>
        </div>
      </div>
        <div className='event-details-mid'>
          <h3>Details</h3>
          <p>{event && event.description}</p>
        </div>
    </div>
  )
}
