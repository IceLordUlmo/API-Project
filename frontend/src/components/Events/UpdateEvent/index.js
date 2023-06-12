import { GroupForm } from '../GroupForm';
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { getOneGroupThunk, deleteGroupThunk } from "../../../store/group";
export const UpdateGroup = () =>
{

    // currently copy pasted from Create Group so it compiles
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups.oneGroup);
    useEffect(() =>
    {
        console.log("useEffect oneGroup");
        dispatch(getOneGroupThunk(groupId))
    }, [dispatch, groupId])

    if (group === undefined) return;

    return (
        <GroupForm isCreateForm={false} preexistingGroup={group} />

    )
}
