import { useModal } from "../../../context/Modal";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteEventThunk } from "../../../store/event";
import "./DeleteModal.css";


function DeleteModal({ eventId, groupId })
{
    const dispatch = useDispatch();

    const history = useHistory();

    const { closeModal } = useModal();
    console.log('delete modal groupId', groupId);
    const handleDelete = () =>
    {
        return dispatch(deleteEventThunk(eventId)).then(history.push(`/groups/${groupId}`)).then(closeModal);
    }

    return (

        <div className="delete-modal">

            <h1>Confirm Delete</h1>

            <p>Are you sure you want to remove this event?</p>

            <button className="delete-modal-yes" onClick={handleDelete}>
                Yes (Delete Event)
            </button>

            <button className="delete-modal-no" onClick={closeModal}>
                No (Keep Event)
            </button>
        </div>

    )
}

export default DeleteModal;
