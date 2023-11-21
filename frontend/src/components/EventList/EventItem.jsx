import './EventItem.css';

export default function EventItem({ event }) {

  const fullDateTime = new Date(event.startDate);
  const yyyy = fullDateTime.getFullYear();
  const mm = fullDateTime.getMonth();
  const dd = fullDateTime.getDate();
  const hours = fullDateTime.getHours();
  const minutes = fullDateTime.getMinutes();

  const yearString = `${yyyy}-${Number(mm) < 10 ? `0${mm+1}` : `${mm+1}` }-${dd < 10 ? `0${dd}` : `${dd}`}`;
  const eventTime = `${hours < 10 ? `0${hours}` : `${hours}`}:${minutes < 10 ? `0${minutes}` : `${minutes}`}`;



  return (
    <div className='event-list-item'>
      <img className='event-preview-image' src={event.previewImage} />
      <div className='event-entry'>
        <span className='event-date'>{yearString} * {eventTime}</span>
        <span className='event-name'>{event.name}</span>
        <span className='event-loc'>{event && event.Venue && event.Venue.city + ', ' + event.Venue.state || event.type}</span>
        <span className='event-desc'>{event.description}</span>
      </div>
    </div>
  )
}
