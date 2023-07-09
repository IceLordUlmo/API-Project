import { useDispatch, useSelector } from 'react-redux';
import { EventForm } from '../EventForm';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import * as groupActions from '../../../store/group'
export const CreateEvent = () =>
{
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups.oneGroup);
    const empty = '';
    const event = {
        name: empty,
        description: empty,
        price: 0,
        type: empty,
        startDate: empty,
        endDate: empty
    };

    useEffect(() =>
    {
        dispatch(groupActions.getOneGroupThunk(groupId));
    }, [dispatch, groupId])

    return (
        <div>
            <EventForm isCreateForm={true} group={group} event={event} />
        </div>
    )
}
