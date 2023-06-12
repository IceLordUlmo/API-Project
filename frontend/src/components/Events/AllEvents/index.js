import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"


import { getAllGroupsThunk } from "../../../store/group"

import { SingleGroup } from "../SingleGroup"

import "./AllGroups.css"

export function AllGroups() {
    const dispatch = useDispatch();
    let allGroups = useSelector(state => state.groups.allGroups);
    let oneGroup = useSelector(state => state.groups.oneGroup);
    allGroups = Object.values(allGroups);
    useEffect(() => {
        console.log("useEffect allGroups");
        dispatch(getAllGroupsThunk())

    }, [dispatch, oneGroup])



    return (
        <div className="all-groups-external-div">
            <h1 className='all-groups-events'>Events</h1>
            <h1 className='all-groups-groups'>Groups</h1>
            <ul className="all-groups-unordered-list-of-groups">
                {
                    allGroups?.map((singleGroup) => (
                        <SingleGroup key={singleGroup.id} group={singleGroup} />
                    ))}
            </ul>
        </div>
    )
}
