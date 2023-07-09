import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink } from 'react-router-dom'

import { getAllGroupsThunk } from "../../../store/group"
import { getAllEventsThunk } from "../../../store/event"
import { SingleGroup } from "../SingleGroup"

import "./AllGroups.css"

export function AllGroups()
{
    const dispatch = useDispatch();
    let allGroups = useSelector(state => state.groups.allGroups);
    let oneGroup = useSelector(state => state.groups.oneGroup);
    let allEvents = useSelector(state => state.events.allEvents);
    allGroups = Object.values(allGroups);
    useEffect(() =>
    {
        console.log("useEffect allGroups");
        dispatch(getAllGroupsThunk())
        dispatch(getAllEventsThunk());
    }, [dispatch, oneGroup])



    return (
        <div className="all-groups-constraint">
            <div className="all-groups-external-div">
                <div className="all-groups-events-and-groups">
                    <div className='all-groups-headers'>
                        <h1 className='all-groups-events'><NavLink to='/events' className='all-groups-events-link'>Events</ NavLink></h1>
                    </div>
                    <div className='all-groups-headers'>
                        <h1 className='all-groups-headers all-groups-groups'>Groups</h1>
                    </div>
                </div>
                <h2 className='all-groups-caption'>Groups in FleetUp</h2>
                <ul className="all-groups-unordered-list-of-groups">
                    {
                        allGroups?.map((singleGroup) => (
                            <div className={"all-groups-single-group " +
                                (allGroups.indexOf(singleGroup) === allGroups.length - 1
                                    ? "all-groups-last-group" : '')}>
                                <SingleGroup key={singleGroup.id} group={singleGroup} events={allEvents} />
                            </div>
                        ))}
                </ul>
            </div>
        </div>
    )
}
