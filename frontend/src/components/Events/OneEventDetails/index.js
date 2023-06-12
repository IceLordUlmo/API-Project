import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

import "./OneGroupDetails.css";
//import GroupDetailDescription from "./GroupDetailDescription";

//import GroupEventItem from "../GroupEventItem";

import { getOneGroupThunk, deleteGroupThunk } from "../../../store/group";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

//import { getGroupEventsThunk } from "../../store/events";

export const OneGroupDetails = () =>
{
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups.oneGroup);
    const history = useHistory();
    useEffect(() =>
    {
        console.log("useEffect oneGroup");
        dispatch(getOneGroupThunk(groupId))
    }, [dispatch, groupId])

    if (group === undefined) return;

    function deleteThis()
    {
        dispatch(deleteGroupThunk(groupId));
    }

    function editThis()
    {

        history.push(`/groups/${group.id}/edit`)
    }

    return (
        <div>
            <div className="group-breadcrumb">
                <div className="group-breadcrumb-spacer">

                </div>
                <div className="group-breadcrumb-text">
                    <Link to='/groups'>
                        Groups
                    </Link>
                </div>
            </div>
            <div className="group-details">
                <div className="group-detail-text-top">
                    <h1>{group.name}</h1>
                    <p>{group.city}, {group.state}</p>
                    <div className="event-public-container">
                        <p>Events</p>
                        <p>•</p>
                        <p>{group.private ? "Private" : "Public"}</p>
                    </div>
                    <p>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</p>
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
