import { useModal } from "../../context/Modal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { thunkFetchDeleteGroup } from "../../store/groups";
import './DeleteGroup.css';

export default function DeleteGroupModal({ group }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const groupId = group.id;
  const navigate = useNavigate();

  const handleConfirm = async () => {
    await dispatch(thunkFetchDeleteGroup(groupId));

    closeModal();
    navigate('groups');
  }

  const handleCancel = () => {
    closeModal();
  }

  return (
    <>
      <p>Are you sure you want to remove this group?</p>
      <button onClick={handleConfirm} className="delete-group-confirm">Yes (Delete Group)</button>
      <button onClick={handleCancel} className="delete-group-cancel">No (Keep Group)</button>
    </>
  )
}
