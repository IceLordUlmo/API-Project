import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

// import { getGroupEventsThunk } from "../../store/events";

export const SingleGroup = ({ group }) => {
    const dispatch = useDispatch();
    const groupPublicity = group.private ? 'Private' : 'Public'
    //useEffect(() => {
    //    dispatch
    //})

    return (
        <li className="all-groups-single-group">
            <div className="single-group-image-temp"></div>
            <div className="single-group-text">
                <h2>
                    <Link className="single-group-link">{group.name}</Link>
                </h2>
                <p className="single-group-location"></p>
                <p className="single-group-about"></p>
                <div className="single-group-events">
                    <h3 className="single-group-event-word">Events</h3>
                    <p>

                    </p>
                    <p>
                        {groupPublicity}
                    </p>
                </div>
            </div>
        </li>
    )
}
