import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"


import { getAllGroupsThunk } from "../../../store/group"

import { SingleGroup } from "../SingleGroup"

import "./AllGroups.css"

export function AllGroups()
{
    const dispatch = useDispatch();
    let allGroups = useSelector(state => state.groups.allGroups);
    let oneGroup = useSelector(state => state.groups.oneGroup);
    allGroups = Object.values(allGroups);
    useEffect(() =>
    {
        console.log("useEffect allGroups");
        dispatch(getAllGroupsThunk())

    }, [dispatch, oneGroup])



    return (
        <div className="all-groups-constraint">
            <div className="all-groups-external-div">
                <div className="all-groups-events-and-groups">
                    <div className='all-groups-headers'>
                        <h1 className=' all-groups-events'>Events</h1>
                    </div>
                    <div className='all-groups-headers'>
                        <h1 className='all-groups-headers all-groups-groups'>Groups</h1>
                    </div>
                </div>
                <h2 className='all-groups-caption'>Groups in FleetUp</h2>
                <ul className="all-groups-unordered-list-of-groups">
                    {
                        allGroups?.map((singleGroup) => (
                            <div>
                                <SingleGroup key={singleGroup.id} group={singleGroup} />
                                {allGroups.indexOf(singleGroup) !== (allGroups.length - 1) ?
                                    <div></div> : <div></div>}
                            </div>
                        ))}
                </ul>
            </div>
        </div>
    )
}
