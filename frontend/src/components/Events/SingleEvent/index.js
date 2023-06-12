import { Link } from "react-router-dom";


// import { getEventEventsThunk } from "../../store/events";

export const SingleEvent = ({ event }) =>
{

    const eventPublicity = event.private ? 'Private' : 'Public'

    return (
        <li className="all-events-single-event">
            <div className="single-event-image-temp"></div>
            <div className="single-event-text">
                <h2>
                    <Link to={`/events/${event.id}`} className="single-event-link">{event.name}</Link>
                </h2>
                <p className="single-event-location"></p>
                <p className="single-event-about"></p>
                <div className="single-event-events">
                    <h3 className="single-event-event-word">Events</h3>
                    <p>

                    </p>
                    <p>
                        {eventPublicity}
                    </p>
                </div>
            </div>
        </li>
    )
}
