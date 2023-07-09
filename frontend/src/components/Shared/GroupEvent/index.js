import './MiniEvent.css'
import { dateString, dateTransformer } from '../../Utils/time'
import { Link } from 'react-router-dom'

// onError={e => { e.currentTarget.src = "https://t4.ftcdn.net/jpg/04/00/24/31/360_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg" }}
export default function MiniEvent({ event })
{
    //const stringTime = timeFormatter(stringTime);

    //console.log('event is:', event.startDate);
    return (
        <Link to={`/events/${event.id}`} className="event-item-container-box">
            <div className="event-item-top-half">
                <img className="group-event-image" src={event.previewImage} />
                <div className="group-event-top-text">
                    <p className="group-event-date">
                        {dateString(dateTransformer(event.startDate))}
                    </p>
                    <h3 className="group-event-list-title">
                        {event.name}
                    </h3>
                    <h3 className="group-event-list-location">
                        {event.Venue?.city}, {event.Venue?.state}
                    </h3>
                    <h3 className="group-event-type">
                        {event.type}
                    </h3>
                </div>
                <div>
                    <h3>{event.description}</h3>
                </div>
            </div>
        </Link>
    )
}
