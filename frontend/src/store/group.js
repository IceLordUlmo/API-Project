// need for authentication
// import { csrfFetch } from "./csrf"; // don't need this yet

// consts for actions
const GET_ALL_GROUPS = "groups/getGroups"


// actions to export
export const getAllGroupsAction = groups => ({
    type: GET_ALL_GROUPS,
    groups
})

// thunk about it

export const getAllGroupsThunk = () => async (dispatch) => {

    const response = await fetch("/api/groups");

    const allGroupsJson = await response.json();

    if (response.ok) {
        await dispatch(getAllGroupsAction(allGroupsJson));
        console.log("groups thunk ok")
    } else {
        const error = await response.json();
        console.log("groups thunk definitely NOT ok")
        return error;
    }
}

const initialState = { allGroups: {} };
const groupReducer = (state = initialState, action) => {

    console.log("group Reducer")

    switch (action.type) {
        case GET_ALL_GROUPS:
            console.log("getting all groups in groups reducer")
            const allGroupsState = { ...state, allGroups: {} };

            action.groups.Groups.forEach(group => {
                allGroupsState.allGroups[group.id] = group;
            })

            return allGroupsState;


        default:
            return state;
    }
};

export default groupReducer;
