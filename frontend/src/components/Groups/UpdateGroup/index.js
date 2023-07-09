import { GroupForm } from '../GroupForm';
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { getOneGroupThunk, deleteGroupThunk } from "../../../store/group";
import { useHistory } from 'react-router-dom';
export const UpdateGroup = () =>
{
    const thisUser = useSelector(state => state.session.user);
    const history = useHistory();

    const { groupId } = useParams();
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups.oneGroup);
    useEffect(() =>
    {
        console.log("useEffect oneGroup");
        dispatch(getOneGroupThunk(groupId))
    }, [dispatch, groupId])

    if (group === undefined) return;
    if (!thisUser || thisUser.id != group.organizerId)
    {
        history.push('/');
        return null;
    }
    return (
        <GroupForm isCreateForm={false} preexistingGroup={group} />

    )
}
