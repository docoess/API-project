import { useParams } from "react-router-dom";
import { useSelector} from "react-redux";
import { useState } from "react";

export default function CreateEventForm() {
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventPrivacy, setEventPrivacy] = useState('');
  const [eventPrice, setEventPrice] = useState(0);
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [eventImg, setEventImg] = useState('');
  const [eventAbout, setEventAbout] = useState('');
  // const [validationErrors, setValidationErrors] = useState({}); , useEffect
  // const [hasSubmitted, setHasSubmitted] = useState(false);
  const { groupId } = useParams();
  // const dispatch = useDispatch(); , useDispatch
  // const navigate = useNavigate(); , useNavigate

  let groups = useSelector(state => state.groupState);
  let group = groups[groupId];


  return (
    <>
      <h1>Create an event for {group && group.name}</h1>
      <form>
        <label>What is the name of your event?</label>
        <input
          type='text'
          onChange={e => setEventName(e.target.value)}
          value={eventName}
          placeholder="Event Name"
        />
        <label>Is this an in person or online event?</label>
        <select
          onChange={e => setEventType(e.target.value)}
          value={eventType}
        >
          <option value='' disabled>(select one)</option>
          <option>In person</option>
          <option>Online</option>
        </select>
        <label>Is this event private or public?</label>
        <select
          onChange={e => setEventPrivacy(e.target.value === 'Private' ? true : false)}
          value={eventPrivacy === '' ? '' : (eventPrivacy ? 'Private' : 'Public')}
        >
          <option value='' disabled>(select one)</option>
          <option>Private</option>
          <option>Public</option>
        </select>
        <label>What is the price for your event?</label>
        <input
          type='number'
          onChange={e => setEventPrice(e.target.value)}
          value={eventPrice}
          placeholder="0"
        />
        <label>When does your event start?</label>
        <input
          type='text'
          onChange={e => setEventStart(e.target.value)}
          value={eventStart}
          placeholder="MM/DD/YYYY, HH/mm AM"
        />
        <label>When does your event end?</label>
        <input
          type='text'
          onChange={e => setEventEnd(e.target.value)}
          value={eventEnd}
          placeholder="MM/DD/YYYY, HH/mm PM"
        />
        <label>Please add an image url for your event below:</label>
        <input
          type="text"
          onChange={e => setEventImg(e.target.value)}
          value={eventImg}
          placeholder="Image URL"
        />
        <label>Please describe your event:</label>
        <textarea
          onChange={e => setEventAbout(e.target.value)}
          value={eventAbout}
          placeholder="Please include at least 30 characters"
        />
        <button>Create Event</button>
      </form>
    </>
  )
}
