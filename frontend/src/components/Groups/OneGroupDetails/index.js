import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

import "./OneGroupDetails.css";

import { getOneGroupThunk, deleteGroupThunk } from "../../../store/group";
import { getOneGroupsEventsThunk } from "../../../store/event";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import MiniEvent from "../../Shared/GroupEvent"
import OpenModalMenuItem from '../../Navigation/OpenModalMenuItem'
import DeleteModal from "../DeleteModal";
import { SortEvents } from "../../Utils/sort";
export const OneGroupDetails = () =>
{
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups.oneGroup);
    const user = useSelector(state => state.session.user);
    let groupEvents = Object.values(useSelector(state => state.events.oneGroupsEvents))[0];

    const history = useHistory();
    useEffect(() =>
    {
        console.log("useEffect oneGroup");
        dispatch(getOneGroupThunk(groupId));
        dispatch(getOneGroupsEventsThunk(groupId));
    }, [dispatch, groupId])

    if (group === undefined) return;
    if (groupEvents === undefined) return;
    groupEvents = SortEvents(groupEvents);
    const weCanJoinThis = (user && user.id !== group.Organizer.id)
    const weCreatedThis = (user && user.id === group.Organizer.id)
    const eventCount = groupEvents.length;
    const joinButton = (e) =>
    {
        return alert('Feature coming soon!')
    }

    console.log('in 1', group)
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

                <div className="group-detail-text-top">
                    <h1>{group.name}</h1>
                    <img src={group.GroupImages[0].url} className="one-group-image-temp">

                    </img>
                    <p>{group.city}, {group.state}</p>
                    <div className="event-public-container">
                        <p>{eventCount} {eventCount === 1 ? 'Event' : 'Events'} • {group.private ? "Private" : "Public"}</p>
                    </div>
                    <p>
                        Organized by: {group.Organizer.firstName} {group.Organizer.lastName}
                    </p>
                    <div>
                        <h3>What we're about:</h3>
                        <p>{group.about}</p>
                    </div>
                    <div>
                        <h3>Events ({groupEvents.length})</h3>
                        {groupEvents.map(event => <MiniEvent event={event} key={event.id} />)}
                    </div>

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
