import './MiniEvent.css'
import { dateString, dateTransformer } from '../../Utils/time'
import { Link } from 'react-router-dom'

// onError={e => { e.currentTarget.src = "https://t4.ftcdn.net/jpg/04/00/24/31/360_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg" }}
export default function MiniEvent({ event })
{
    //const stringTime = timeFormatter(stringTime);

    //console.log('event is:', event.startDate);
    return (
        <Link to={`/events/${event.id}`} className="mini-event-item-container-box">
            <div className="mini-event-item-top-half">
                <img className="mini-event-image" src={event.previewImage} />
                <div className="mini-event-top-text">
                    <h3 className="mini-event-date">
                        {dateString(dateTransformer(event.startDate))}
                    </h3>
                    <h3 className="mini-event-title">
                        {event.name}
                    </h3>
                    <h3 className="mini-event-location">
                        {event.Venue?.city}, {event.Venue?.state}
                    </h3>
                    <h3 className="mini-event-type">
                        {event.type}
                    </h3>
                </div>
            </div>
            <div className='mini-event-bottom-half'>
                <h3>{event.description}</h3>
            </div>
        </Link>
    )
}
