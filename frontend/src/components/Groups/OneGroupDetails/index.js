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
        <div className="one-group-external">
            <div className='one-group-top-half'>
                <div className="group-breadcrumb">
                    <div className="group-breadcrumb-spacer">

                    </div>
                    <div className="group-breadcrumb-text">
                        {'<'}<Link to='/groups'>
                            Groups
                        </Link>
                    </div>
                </div>
                <div className="group-details">

                    <div className="group-detail-text-top">

                        <img src={group.GroupImages[0].url} className="one-group-image-temp">

                        </img>
                        <div>
                            <h2 className="one-group-name">{group.name}</h2>
                            <h3 className="one-group-right-text">{group.city}, {group.state}</h3>
                            <div>
                                <h3 className="one-group-right-text">{eventCount} {eventCount === 1 ? 'Event' : 'Events'} • {group.private ? "Private" : "Public"}</h3>
                            </div>
                            <h3 className="one-group-right-text">
                                Organized by: {group.Organizer.firstName} {group.Organizer.lastName}
                            </h3>

                            {(weCreatedThis) &&
                                (<div className="one-group-horizontal-buttons">
                                    <Link to={`/groups/${group.id}/events/new`} >
                                        <button className="one-group-details-button">Create event</button>
                                    </Link>
                                    <Link to={`/groups/${group.id}/edit`} >
                                        <button className="one-group-details-button one-group-details-dg">Update</button>
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



            </div>
            <div className="one-group-events-wide">
                <div className="one-group-events">
                    <h2 className="one-group-bottom-organizer">
                        Organizer
                    </h2>
                    <h3 className='one-group-bottom-name'>
                        {group.Organizer.firstName} {group.Organizer.lastName}
                    </h3>
                    <div>
                        <h3 className="one-group-bottom-organizer">What we're about:</h3>
                        <h4 className='one-group-bottom-about'>{group.about}</h4>
                    </div>
                    {groupEvents.length > 0 ? (<div>
                        <h3>Events ({groupEvents.length})</h3>
                        {groupEvents.map(event => <MiniEvent event={event} key={event.id} />)}
                    </div>) :
                        (<h3>No Upcoming Events</h3>)
                    }
                </div>
            </div>



        </div >
    )
}
