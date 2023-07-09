import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { SortEvents } from "../../Utils/sort"

import { getAllEventsThunk } from "../../../store/event"

import MiniEvent from "../../Shared/GroupEvent"

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

    if (allEvents === undefined) return;

    allEvents = SortEvents(allEvents);

    return (
        <div className="all-events-external-div">
            <h2>Events in Meetup</h2>
            <div className="all-groups-events-and-groups">
                <div className='all-groups-headers'>
                    <h1 className=' all-groups-events'>Events</h1>
                </div>
                <div className='all-groups-headers'>
                    <h1 className='all-groups-headers all-groups-groups'>Groups</h1>
                </div>
            </div>
            <ul className="all-events-unordered-list-of-events">
                {
                    allEvents?.map((singleEvent) => (<div className={"all-events-single-event " +
                        (allEvents.indexOf(singleEvent) === allEvents.length - 1
                            ? "all-events-last-event" : '')} >
                        <MiniEvent key={singleEvent.id} event={singleEvent} />
                    </div>
                    ))}
            </ul>
        </div>
    )
}
