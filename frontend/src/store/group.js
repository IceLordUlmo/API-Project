// need for authentication
import { csrfFetch } from "./csrf";

// consts for actions
const GET_ALL_GROUPS = "groups/getGroups"
const initialState = {};

// actions to export
export const getAllGroupsAction = groups => ({
    type: GET_ALL_GROUPS,
    groups
})

// thunk about it

export const getAllGroupsThunk = () =>
    async (dispatch) => {
        const response = await fetch("/api/groups");

        const allGroupsJson = await response.json();

        if (response.ok) {
            await dispatch(getAllGroupsAction(allGroupsJson));

        } else {
            const error = await response.json();
            return error;
        }
    }

const groupReducer = (state = initialState, action) => {

    switch (action.type) {
        case GET_ALL_GROUPS:
            const allGroupsState = { ...state };

            const allGroups = action.groups.Groups.forEach(group => {
                allGroupsState[group.id] = group;
            })

            return allGroupsState;

        default:
            return state;
    }
};

export default groupReducer;
