import { GroupFormModal } from '../GroupForm';

export const CreateGroup = () => {
    // make a dummy group name: '', about: '', type: '', private: '', city: '', state: ''
    const group = {};

    return (
        <GroupFormModal isCreateForm={true} />

    )
}
