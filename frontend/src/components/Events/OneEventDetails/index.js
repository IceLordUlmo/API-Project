import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

import "./OneEventDetails.css";
//import EventDetailDescription from "./EventDetailDescription";

//import EventEventItem from "../EventEventItem";

import { getOneEventThunk, deleteEventThunk } from "../../../store/event";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

//import { getEventEventsThunk } from "../../store/events";

export const OneEventDetails = () =>
{
    const { eventId } = useParams();
    const dispatch = useDispatch();
    const event = useSelector(state => state.events.oneEvent);
    const history = useHistory();
    useEffect(() =>
    {
        console.log("useEffect oneEvent");
        dispatch(getOneEventThunk(eventId))
    }, [dispatch, eventId])

    if (event === undefined) return;

    function deleteThis()
    {
        dispatch(deleteEventThunk(eventId));
    }

    function editThis()
    {

        history.push(`/events/${event.id}/edit`)
    }

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
                    <p>{event.city}, {event.state}</p>
                    <div className="event-public-container">
                        <p>Events</p>
                        <p>•</p>
                        <p>{event.private ? "Private" : "Public"}</p>
                    </div>
                    <p>Organized by {event.Organizer.firstName} {event.Organizer.lastName}</p>
                    <button onClick={deleteThis}>
                        Delete
                    </button>
                    <button onClick={editThis}>
                        Edit
                    </button>
                </div>
            </div>
        </div>
    )
}
