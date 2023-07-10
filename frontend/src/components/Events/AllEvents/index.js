import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { SortEvents } from "../../Utils/sort"
import { NavLink } from 'react-router-dom'
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
        <div className='all-events-constraint'>
            <div className="all-events-external-div">

                <div className="all-events-events-and-groups">
                    <div className='all-events-headers'>
                        <h2 className='all-events-events'>Events</h2>
                    </div>
                    <div className='all-events-headers'>
                        <h2 className='all-events-groups'><NavLink to='/Groups' className='all-events-groups-link'>Groups</NavLink></h2>
                    </div>
                </div>
                <h3>Events in Meetup</h3>
                <ul className="all-events-unordered-list-of-events">
                    {
                        allEvents?.map((singleEvent) => (<div key={singleEvent.id} className={"all-events-single-event " +
                            (allEvents.indexOf(singleEvent) === allEvents.length - 1
                                ? "all-events-last-event" : '')} >
                            <MiniEvent key={singleEvent.id} event={singleEvent} />
                        </div>
                        ))}
                </ul>
            </div>
        </div>
    )
}
