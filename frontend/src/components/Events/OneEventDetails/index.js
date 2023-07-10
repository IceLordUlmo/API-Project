import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

import "./OneEventDetails.css";

import { getOneEventThunk } from "../../../store/event";
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
        console.log("useEffect oneEvent", event);
        if (!event || event.id != eventId)
        {
            dispatch(getOneEventThunk(eventId))
        }
        if (event.id !== undefined)
        {
            dispatch(getOneGroupThunk(event.Group.id))
        }
    }, [dispatch, eventId, event])

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
        <div className="one-event-external">

            <div className="event-breadcrumb">
                <div className="event-breadcrumb-spacer">

                </div>
                <div className="event-breadcrumb-text">
                    {'<'} <Link to='/events'>
                        Events
                    </Link>
                </div>

                <h3 className='one-event-breadcrumb-name'>{event.name}</h3>

                <h3 className='one-event-breadcrumb-organizer'>Hosted by: {organizer}</h3>

            </div>
            <div className="one-event-gray">
                <div className="one-event-top-half">

                    <div className="event-details">
                        <div className="event-detail-text-top">

                            <img className='one-event-image' src={eventImage?.url} />
                            <div className='one-event-thirds'>
                                <div className='one-event-top-third'>
                                    <img className='one-event-top-third-image' src={eventImage?.url} />
                                    <div className='one-event-top-third-text'>
                                        <Link to={`/groups/${event.groupId}`} className="event-group-chunk">
                                            <h4 className='one-event-top-third-name'>{group.name}</h4>
                                            <h4 className='one-event-top-third-type'>{group.type}</h4>
                                        </Link>
                                    </div>
                                </div>
                                <div className='one-event-bottom-two-thirds'>
                                    <div className="one-event-column-one">
                                        <div className='one-event-details-x'>
                                            <div className='one-event-details-details'>
                                                <div className='one-event-details-time'>
                                                    <div className='one-event-detail-start-and-end'>
                                                        <i className='fa-regular fa-clock one-event-clock' />
                                                        <div className="one-event-times">
                                                            <p>
                                                                {eventDay} • {displayEventTime}
                                                            </p><p>
                                                                {endEventDay} • {endDisplayEventTime}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='one-event-details-cost'>
                                                    <p className="fa-circle-dollar">$</p>
                                                    <div className="one-event-price">
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
                                                </div>

                                                <div className='one-event-details-location'>
                                                    <i className="fa-sharp fa-solid fa-map-pin" />
                                                    <div className='one-event-details-location-type'>
                                                        <p>{event.type}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="one-event-column-two">
                                        {
                                            (weCreatedThis) &&
                                            (<div>
                                                <Link to={`/events/${group.id}/edit`} className="hidden one-event-details-button one-event-details-dg">
                                                    Update
                                                </Link>

                                                <div className="one-event-details-button one-group-details-dg">
                                                    <OpenModalMenuItem
                                                        itemText="Delete"
                                                        modalComponent={<DeleteModal className="modal-container-delete" eventId={event.id} groupId={group.id} />}
                                                    /></div>
                                            </div>
                                            )
                                        }
                                        {(weCanJoinThis) &&
                                            (
                                                <button className="one-event-details-join-button"
                                                    onClick={joinButton}
                                                >Join this event</button>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='one-event-details'>
                        <h3 className='one-event-description'>
                            Description
                        </h3>
                        <h3>
                            {event.description}
                        </h3>
                    </div>
                </div>
            </div>
        </div >
    )
}
