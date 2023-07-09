import { EventForm } from '../EventForm';
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { getOneEventThunk } from "../../../store/event";
export const UpdateGroup = () =>
{

    // currently copy pasted from Create Group so it compiles
    const { eventId } = useParams();
    const dispatch = useDispatch();
    const event = useSelector(state => state.events.oneEvent);
    const group = useSelector(state => state.groups.oneGroup);
    useEffect(() =>
    {
        console.log("useEffect oneEvent");
        dispatch(getOneEventThunk(eventId))
        dispatch(getOneGroupThunk(groupId))
    }, [dispatch, eventId])

    if (event === undefined) return;
    if (group === undefined) return;

    return (
        <GroupForm isCreateForm={false} preexistingEvent={event} group={group} />

    )
}
