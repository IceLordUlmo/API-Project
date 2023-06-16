import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"


import { getAllEventsThunk } from "../../../store/event"

import { SingleEvent } from "../SingleEvent"

import "./AllEvents.css"

export function AllEvents()
{
    const dispatch = useDispatch();
    let allEvents = useSelector(state => state.events.allEvents);
    let oneEvent = useSelector(state => state.events.oneEvent);
    allEvents = Object.values(allEvents);
    useEffect(() =>
    {
        console.log("useEffect allEvents");
        dispatch(getAllEventsThunk())

    }, [dispatch, oneEvent])



    return (
        <div className="all-events-external-div">
            <h1 className='all-events-events'>Events</h1>
            <h1 className='all-events-groups'>Groups</h1>
            <ul className="all-events-unordered-list-of-events">
                {
                    allEvents?.map((singleEvent) => (
                        <SingleEvent key={singleEvent.id} event={singleEvent} />
                    ))}
            </ul>
        </div>
    )
}
