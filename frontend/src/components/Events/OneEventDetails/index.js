import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

import "./OneEventDetails.css";

import { getOneEventThunk, deleteEventThunk } from "../../../store/event";
import { getOneGroupThunk } from "../../../store/group";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import { timeFormatter } from "../../Utils/time";

import OpenModalMenuItem from '../../Navigation/OpenModalMenuItem'
import DeleteModal from "../DeleteModal";
export const OneEventDetails = () =>
{


    const { eventId } = useParams();
    const dispatch = useDispatch();
    const event = useSelector(state => state.events.oneEvent);
    const group = useSelector(state => state.groups.oneGroup);
    const user = useSelector(state => state.session.user);

    useEffect(() =>
    {
        console.log("useEffect oneEvent");
        dispatch(getOneEventThunk(eventId))
        if (event.Group !== undefined)
        {
            dispatch(getOneGroupThunk(event.Group.id))
        }
    }, [dispatch, eventId])

    const history = useHistory();
    if (event === undefined || group === undefined) return;
    if (event.id === undefined || group.id === undefined) return;
    const eventImage = event?.EventImages?.find(image => image.preview === true);
    const groupImage = group?.GroupImages.find(image => image.preview === true);
    let organizer = '';
    organizer = organizer + group?.Organizer?.firstName + ' ' + group?.Organizer?.lastName;




    console.log('looking for a startDate', event);
    const eventTimeInfo = event.startDate.split("T");
    let eventDay = eventTimeInfo[0];
    let eventTime = eventTimeInfo[1];
    let displayEventTime = timeFormatter(eventTime);

    const endEventTimeInfo = event.startDate.split("T");
    let endEventDay = endEventTimeInfo[0];
    let endEventTime = endEventTimeInfo[1];
    let endDisplayEventTime = timeFormatter(endEventTime);

    const isFree = (event.price === 0 || event.price === "0");

    const weCanJoinThis = (user && user.id !== group.Organizer.id)
    const weCreatedThis = (user && user.id === group.Organizer.id)

    const joinButton = (e) =>
    {
        return alert('Feature coming soon!')
    }
    // Update goes in here later

    return (
        <div>
            <div className="event-breadcrumb">
                <div className="event-breadcrumb-spacer">

                </div>
                <div className="event-breadcrumb-text">
                    <Link to='/events'>
                        Events
                    </Link>
                </div>
            </div>
            <div className="event-details">
                <div className="event-detail-text-top">
                    <h1>{event.name}</h1>
                    <p className='one-event-details-host'>
                        Hosted by: {organizer}
                    </p>
                    <img className='one-event-details-event-image' src={eventImage?.url} />
                    <div className='one-event-details-x'>
                        <Link to={`/groups/${event.groupId}`} className="event-group-chunk">
                            <div className='one-event-details-group-info'>
                                <p className='one-event-details-group-name'>{event.Group.name}</p>
                                <p>{group.private ? "Private" : "Public"}</p>
                            </div>
                        </Link>
                        <div className='one-event-details-details'>
                            <div className='one-event-details-time'>
                                <i className='fa-regular fa-clock' />
                                <div className='one-event-detail-start-and-end'>
                                    <p>
                                        {eventDay} • {displayEventTime}
                                    </p><p>
                                        {endEventDay} • {endDisplayEventTime}
                                    </p>
                                </div>
                            </div>
                            <div className='one-event-details-cost'>
                                <p className='fa-circle-dollar'>
                                    $
                                </p>
                                {isFree ? (
                                    <p>
                                        Free
                                    </p>
                                ) : (
                                    <p>
                                        {event.price}
                                    </p>
                                )}
                            </div>

                            <div className='one-event-details-location'>
                                <i class="fa-sharp fa-solid fa-map-pin" />
                                <div className='one-event-details-location-type'>
                                    {event.type}
                                </div>
                            </div>
                        </div>
                    </div>
                    {(weCreatedThis) &&
                        (<div>
                            <Link to={`/events/${group.id}/edit`} className="one-event-details-button one-event-details-dg">
                                Update
                            </Link>

                            <div className="one-event-details-button one-group-details-dg">
                                <OpenModalMenuItem
                                    itemText="Delete"
                                    modalComponent={<DeleteModal className="modal-container-delete" eventId={event.id} />}
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
            <div className='one-event-details'>
                <h3>
                    Description
                </h3>
                <p>
                    {event.description}
                </p>
            </div>
        </div >
    )
}
