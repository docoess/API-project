import { useModal } from "../../context/Modal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { thunkFetchDeleteEvent } from "../../store/events";
import './DeleteEvent.css';

export default function DeleteEventModal({ event, group }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const eventId = event.id;
  const groupId = group.id;
  const navigate = useNavigate();

  const handleConfirm = async () => {
    await dispatch(thunkFetchDeleteEvent(eventId));

    navigate(`/groups/${groupId}`);
    closeModal();
  }

  const handleCancel = () => {
    closeModal();
  }

  return (
    <div className="delete-modal">
      <p className="confirm-delete-text">Confirm Delete</p>
      <p>Are you sure you want to remove this event?</p>
      <button onClick={handleConfirm} className="delete-event-confirm">Yes (Delete Event)</button>
      <button onClick={handleCancel} className="delete-event-cancel">No (Keep Event)</button>
    </div>
  )
}
