import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

import "./OneGroupDetails.css";

import { getOneGroupThunk, deleteGroupThunk } from "../../../store/group";
import { getOneGroupsEventsThunk } from "../../../store/event";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import OpenModalMenuItem from '../../Navigation/OpenModalMenuItem'
import DeleteModal from "../DeleteModal";

export const OneGroupDetails = () =>
{
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups.oneGroup);
    const user = useSelector(state => state.session.user);
    const groupEvents = useSelector(state => state.events.oneGroupsEvents);
    const history = useHistory();
    useEffect(() =>
    {
        console.log("useEffect oneGroup");
        dispatch(getOneGroupThunk(groupId));
        dispatch(getOneGroupsEventsThunk(groupId));
    }, [dispatch, groupId])

    if (group === undefined) return;

    const weCanJoinThis = (user && user.id !== group.Organizer.id)
    const weCreatedThis = (user && user.id === group.Organizer.id)

    const joinButton = (e) =>
    {
        return alert('Feature coming soon!')
    }

    return (
        <div>
            <div className="group-breadcrumb">
                <div className="group-breadcrumb-spacer">

                </div>
                <div className="group-breadcrumb-text">
                    <Link to='/groups'>
                        Groups
                    </Link>
                </div>
            </div>
            <div className="group-details">
                <img src={group.previewImage} className="one-group-image-temp">

                </img>
                <div className="group-detail-text-top">
                    <h1>{group.name}</h1>
                    <p>{group.city}, {group.state}</p>
                    <div className="event-public-container">
                        <p>Events</p>
                        <p>•</p>
                        <p>{group.private ? "Private" : "Public"}</p>
                    </div>
                    <p>
                        Organized by {group.Organizer.firstName} {group.Organizer.lastName}
                    </p>
                    {(weCreatedThis) &&
                        (<div>
                            <Link to={`/groups/${group.id}/events/new`} className="one-group-details-button">
                                Create event
                            </Link>
                            <Link to={`/groups/${group.id}/edit`} className="one-group-details-button one-group-details-dg">
                                Update
                            </Link>

                            <div className="one-group-details-button one-group-details-dg">
                                <OpenModalMenuItem
                                    itemText="Delete"
                                    modalComponent={<DeleteModal className="modal-container-delete" groupId={group.id} />}
                                /></div>
                        </div>
                        )
                    }
                    {(weCanJoinThis) &&
                        (
                            <button className="one-group-details-join-button"
                                onClick={joinButton}
                            >Join this group</button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
