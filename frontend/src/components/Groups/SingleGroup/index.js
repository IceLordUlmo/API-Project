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
        <li className="all-groups-single-group-container">
            <Link to={`/groups/${group.id}`} className='single-group-grid-setup'>
                <img src={group.previewImage} className="single-group-image">

                </img>

                <div className="single-group-text">
                    <h2>
                        <div className="single-group-name">{group.name}</div>
                    </h2>
                    <div className="single-group-location">{group.city}, {group.state}</div>
                    <div className="single-group-about">{group.about}</div>
                    <div className="single-group-events">
                        <div>
                            {eventCount} {eventCount === 1 ? 'Event' : 'Events'}  • {groupPublicity}
                        </div>
                    </div>
                </div>
            </Link>
        </li >
    )
}
