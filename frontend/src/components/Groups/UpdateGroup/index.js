import { GroupFormModal } from '../GroupForm';
import { useParams } from 'react-router-dom'
export const UpdateGroup = () => {

    // currently copy pasted from Create Group so it compiles
    const group = {};

    return (
        <GroupFormModal isCreateForm={false} />

    )
}
