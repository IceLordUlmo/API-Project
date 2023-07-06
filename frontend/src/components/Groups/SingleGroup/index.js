import { Link } from "react-router-dom";
import './SingleGroup.css';

export const SingleGroup = ({ group, events }) =>
{

    const groupPublicity = group.private ? 'Private' : 'Public'
    const eventsArray = Object.values(events);
    const eventCount = eventsArray.reduce(
        (accumulator, currentValue) => currentValue.groupId === group.id ? accumulator + 1 : accumulator,
        0
    )

    return (
        <li className="all-groups-single-group">
            <Link to={`/groups/${group.id}`} className='single-group-grid-setup'>
                <img src={group.previewImage} className="single-group-image-temp">

                </img>

                <div className="single-group-text">
                    <h2>
                        <p className="single-group-link">{group.name}</p>
                    </h2>
                    <p className="single-group-location">{group.city}, {group.state}</p>
                    <p className="single-group-about">{group.about}</p>
                    <div className="single-group-events">
                        <h3 className="single-group-event-word">Events</h3>
                        <p>
                            {eventCount}
                        </p>
                        <p>
                            {groupPublicity}
                        </p>
                    </div>
                </div>
            </Link>
        </li >
    )
}
