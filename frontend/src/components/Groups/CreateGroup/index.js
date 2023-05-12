import { GroupFormModal } from '../GroupFormModal';

export const CreateGroup = () => {
    // make a dummy group name: '', about: '', type: '', private: '', city: '', state: ''
    const group = {};

    return (
        <GroupFormModal isCreateForm={true} />

    )
}
