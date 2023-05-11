// need for authentication
// import { csrfFetch } from "./csrf"; // don't need this yet

// consts for actions
const GET_ALL_GROUPS = "groups/getGroups"
const initialState = { groups: {} };

// actions to export
export const getAllGroupsAction = groups => ({
    type: GET_ALL_GROUPS,
    groups
})

// thunk about it

export const getAllGroupsThunk = () => async (dispatch) => {
    const response = await fetch("/api/groups");

    const allGroupsJson = await response.json();

    console.log("groups Thunk")

    if (response.ok) {
        await dispatch(getAllGroupsAction(allGroupsJson));

    } else {
        const error = await response.json();
        return error;
    }
}

const groupReducer = (state = initialState, action) => {

    console.log("group Reducer")

    switch (action.type) {
        case GET_ALL_GROUPS:
            const allGroupsState = { ...state, groups: {} };

            const allGroups = action.groups.Groups.forEach(group => {
                allGroupsState[group.id] = group;
            })

            return allGroups;

        default:
            return state;
    }
};

export default groupReducer;
