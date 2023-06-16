import { Link } from "react-router-dom";
import { timeFormatter } from "../../Utils/time";

export const SingleEvent = ({ event }) =>
{
    const eventTimeInfo = event.startDate.split("T");
    let eventDay = eventTimeInfo[0];
    let eventTime = eventTimeInfo[1];
    let displayEventTime = timeFormatter(eventTime);

    return (
        <li className="all-events-single-event">
            <div className="single-event-image-temp"></div>
            <div className="single-event-text">
                <h2>
                    <Link to={`/events/${event.id}`} className="single-event-link">{event.name}</Link>
                </h2>
                <div className="single-event-text-container">
                    <div className="single-event-sub-text-container">
                        <p>
                            {eventDay} • {displayEventTime}
                        </p>
                    </div>
                    <h2 className="single-event-group-list-header">{event.name}</h2>
                    <p className="single-event-event-type-text">{event.type}</p>
                </div>
            </div>
        </li>
    )
}
