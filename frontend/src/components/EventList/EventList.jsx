import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkFetchEvents } from "../../store/events";
import { NavLink } from "react-router-dom";
import EventItem from "./EventItem";
import './EventList.css';

export default function EventList() {
  const dispatch = useDispatch();
  const events = useSelector(state => Object.values(state.eventState));

  useEffect(() => {
    dispatch(thunkFetchEvents());
  }, [dispatch])

  return (
    <div className='events-list-container'>
      <nav className='group-list-buttons'>
        <NavLink to='/events'>Events</NavLink>  <NavLink to='/groups'>Groups</NavLink>
      </nav>
      <p>Events in Meetup</p>
      <ul className='events-list'>
        {
          events.map(event => (
            <NavLink className={'event-navlink'} key={event.id} to={`/events/${event.id}`}>
              <EventItem
                key={event.id}
                event={event}
              />
            </NavLink>
          ))
        }
      </ul>
    </div>
  )
}
