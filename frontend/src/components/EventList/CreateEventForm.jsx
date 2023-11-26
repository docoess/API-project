import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { thunkFetchPostEvent } from "../../store/events";
import Cookies from "js-cookie";

export default function CreateEventForm() {
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventPrivacy, setEventPrivacy] = useState('');
  const [eventPrice, setEventPrice] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [eventImg, setEventImg] = useState('');
  const [eventAbout, setEventAbout] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let groups = useSelector(state => state.groupState);
  let group = groups[groupId];

  useEffect(() => {
    const errors = {};

    if (!eventName) {
      errors.name = 'Name is required'
    }

    if (eventType === '') {
      errors.type = 'Event Type is required'
    }

    if (eventPrivacy === '') {
      errors.privacy = 'Visibility is required'
    }

    if (eventPrice === '') {
      errors.price = 'Price is required'
    }

    if (!eventStart) {
      errors.start = 'Event start is required'
    }

    if (!eventEnd) {
      errors.end = 'Event end is required'
    }

    if (!eventImg || (!eventImg.endsWith('.png') && !eventImg.endsWith('.jpg') && !eventImg.endsWith('.jpeg'))) {
      errors.image = 'Image URL must end in .png, .jpg, or .jpeg';
    }

    if (eventAbout.length < 30) {
      errors.about = 'Description must be at least 30 characters'
    }

    setValidationErrors(errors);
  }, [eventName, eventType, eventPrivacy, eventPrice, eventStart, eventEnd, eventImg, eventAbout]);

  const onSubmit = async e => {
    e.preventDefault();

    setHasSubmitted(true);

    if (!Object.values(validationErrors).length) {
      const realStart = eventStart.slice(6, 10) + '-' +
                        eventStart.slice(0, 2) + '-' +
                        eventStart.slice(3, 5) + ' ' +
                        eventStart.slice(11, 13) + ':' +
                        eventStart.slice(14, 16) + ':00';

      const realEnd = eventEnd.slice(6, 10) + '-' +
                      eventEnd.slice(0, 2) + '-' +
                      eventEnd.slice(3, 5) + ' ' +
                      eventEnd.slice(11, 13) + ':' +
                      eventEnd.slice(14, 16) + ':00';

      const createEventBody = {
        "name": eventName,
        "description": eventAbout,
        "startDate": realStart,
        "endDate": realEnd,
        "type": eventType,
        "private": eventPrivacy,
        "price": eventPrice,
        "previewImage": eventImg,
        "venueId": 1,
        "capacity": 20
      }

      const createEventImageReqBody = {
        "url": eventImg,
        "preview": true
      }

      const newEvent = await dispatch(thunkFetchPostEvent(createEventBody, groupId));
      const newEventId = newEvent.id;

      await fetch(`/api/events/${newEventId}/images`, {method: 'POST', headers: {"Content-Type": "application/json", "XSRF-Token": Cookies.get('XSRF-TOKEN')}, body: JSON.stringify(createEventImageReqBody)})

      navigate(`/events/${newEventId}`);
    }
  }


  return (
    <>
      <h1>Create an event for {group && group.name}</h1>
      <form onSubmit={onSubmit}>
        <label>What is the name of your event?</label>
        <input
          type='text'
          onChange={e => setEventName(e.target.value)}
          value={eventName}
          placeholder="Event Name"
        />
        <p className='create-group-errors'>
          {hasSubmitted && validationErrors.name && validationErrors.name}
        </p>
        <label>Is this an in person or online event?</label>
        <select
          onChange={e => setEventType(e.target.value)}
          value={eventType}
        >
          <option value='' disabled>(select one)</option>
          <option>In person</option>
          <option>Online</option>
        </select>
        <p className='create-group-errors'>
          {hasSubmitted && validationErrors.type && validationErrors.type}
        </p>
        <label>Is this event private or public?</label>
        <select
          onChange={e => setEventPrivacy(e.target.value === 'Private' ? true : false)}
          value={eventPrivacy === '' ? '' : (eventPrivacy ? 'Private' : 'Public')}
        >
          <option value='' disabled>(select one)</option>
          <option>Private</option>
          <option>Public</option>
        </select>
        <p className='create-group-errors'>
          {hasSubmitted && validationErrors.privacy && validationErrors.privacy}
        </p>
        <label>What is the price for your event?</label>
        <input
          type='number'
          onChange={e => setEventPrice(e.target.value)}
          value={eventPrice}
          placeholder="0"
        />
        <p className='create-group-errors'>
          {hasSubmitted && validationErrors.price && validationErrors.price}
        </p>
        <label>When does your event start?</label>
        <input
          type='text'
          onChange={e => setEventStart(e.target.value)}
          value={eventStart}
          placeholder="MM/DD/YYYY, HH:mm AM"
        />
        <p className='create-group-errors'>
          {hasSubmitted && validationErrors.start && validationErrors.start}
        </p>
        <label>When does your event end?</label>
        <input
          type='text'
          onChange={e => setEventEnd(e.target.value)}
          value={eventEnd}
          placeholder="MM/DD/YYYY, HH:mm PM"
        />
        <p className='create-group-errors'>
          {hasSubmitted && validationErrors.end && validationErrors.end}
        </p>
        <label>Please add an image url for your event below:</label>
        <input
          type="text"
          onChange={e => setEventImg(e.target.value)}
          value={eventImg}
          placeholder="Image URL"
        />
        <p className='create-group-errors'>
          {hasSubmitted && validationErrors.image && validationErrors.image}
        </p>
        <label>Please describe your event:</label>
        <textarea
          onChange={e => setEventAbout(e.target.value)}
          value={eventAbout}
          placeholder="Please include at least 30 characters"
        />
        <p className='create-group-errors'>
          {hasSubmitted && validationErrors.about && validationErrors.about}
        </p>
        <button>Create Event</button>
      </form>
    </>
  )
}
