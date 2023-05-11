import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom'

import { GroupFormModal } from '../GroupFormModal';
import { getOneGroupThunk } from '../../../store/group'

export const CreateGroup = () => {
    // make a dummy group name: '', about: '', type: '', private: '', city: '', state: ''
    const group = {};

    return (
        <GroupFormModal isCreateForm={true} />

    )
}
