import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"


import { getOneGroupThunk } from "../../../store/group"

import { SingleGroup } from "../SingleGroup"

import "./OneGroup.css"

export function OneGroup() {
    const dispatch = useDispatch();
    let group = useSelector(state => state.groups.oneGroup);

    allGroups = Object.values(allGroups);
    useEffect(() => {
        console.log("useEffect oneGroup");
        dispatch(getOneGroupThunk())

    }, [dispatch])



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
