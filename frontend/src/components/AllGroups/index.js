import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { getAllGroupsThunk } from "../../store/group"

import { SingleGroup } from "../SingleGroup"

import "./AllGroups.css"

export function AllGroups() {
    const dispatch = useDispatch();
    const [loadComplete, setLoadComplete] = useState(false)
    let allGroups = useSelector(state => state.groups.allGroups);
    console.log(allGroups);
    allGroups = allGroups ? Object.values(allGroups) : null
    useEffect(() => {
        console.log("useEffect allGroups");
        dispatch(getAllGroupsThunk())
        //const timerID = setTimeout(() => { setLoadComplete(true) }, 1500)
        //return () => clearInterval(timerID)

    }, [dispatch])

    // if (!loadComplete) {
    //     return null;
    // }

    return (
        <div className="all-groups-external-div">

            <ul className="all-groups-unordered-list-of-groups">
                {
                    allGroups?.map((singleGroup) => (
                        <SingleGroup key={singleGroup.id} group={singleGroup} />
                    ))}
            </ul>
        </div>
    )
}
