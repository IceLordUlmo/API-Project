import { useModal } from "../../../context/Modal";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteGroupThunk } from "../../../store/group";
import "./DeleteModal.css";


function DeleteModal({ groupId })
{
    const dispatch = useDispatch();

    const history = useHistory();

    const { closeModal } = useModal();

    const handleDelete = () =>
    {
        return dispatch(deleteGroupThunk(groupId)).then(history.push("/groups")).then(closeModal);
    }

    return (

        <div className="delete-modal">

            <h1>Confirm Delete</h1>

            <p>Are you sure you want to remove this group?</p>

            <button className="delete-modal-yes" onClick={handleDelete}>
                Yes (Delete Group)
            </button>

            <button className="delete-modal-no" onClick={closeModal}>
                No (Keep Group)
            </button>
        </div>

    )
}

export default DeleteModal;
