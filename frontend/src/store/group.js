// need for authentication
import { csrfFetch } from "./csrf"; // don't need this yet

// consts for actions
const GET_ALL_GROUPS = "groups/getGroups"
const GET_ONE_GROUP = "groups/getOneGroup"
const CREATE_GROUP = "groups/createOneGroup"
const CREATE_IMAGE = "groups/newImage"
const UPDATE_GROUP = "groups/updateGroup"
const DELETE_GROUP = "groups/deleteGroup"
const headers = { 'Content-Type': 'application/json' }
// actions to export
export const getAllGroupsAction = groups => (
    {
        type: GET_ALL_GROUPS,
        groups
    }
)

export const getOneGroupAction = (groupObject) => (
    {
        type: GET_ONE_GROUP,
        groupObject
    }
)
export const createGroupAction = (groupObject) => (
    {
        type: CREATE_GROUP,
        groupObject
    }
)
export const createImageAction = (imageObject, groupObject) => (
    {
        type: CREATE_IMAGE,
        imageObject,
        groupObject
    }
)

export const updateGroupAction = (groupObject) => (
    {
        type: UPDATE_GROUP,
        groupObject

    }
)

export const deleteGroupAction = groupIdToDelete => (
    {
        type: DELETE_GROUP,
        groupIdToDelete
    }
)

// thunk about it

export const getAllGroupsThunk = () => async (dispatch) =>
{

    const response = await fetch("/api/groups");

    const allGroupsJson = await response.json();

    if (response.ok)
    {
        await dispatch(getAllGroupsAction(allGroupsJson));
        console.log("groups thunk ok")
    } else
    {
        const error = await response.json();
        console.log("groups thunk definitely NOT ok")
        return error;
    }
}

export const createGroupThunk = (groupObject) => async (dispatch) =>
{

    console.log('we got to create group thunk: ', groupObject)
    const request = {
        method: 'POST',
        headers,
        body: JSON.stringify(groupObject)
    }
    console.log(request);
    const response = await csrfFetch('/api/groups', request)
    console.log('stage 2 of create group thunk')
    if (response.ok)
    {
        console.log('create group thunk response ok')
        const jsonResponse = await response.json();
        dispatch(createGroupAction(groupObject));
        return jsonResponse;
    }
    else
    {
        console.log('create group thunk response NOT ok')
        return await response.json();
    }
}

export const createImageThunk = (imageObject, groupId) => async (dispatch) =>
{
    const createURL = `/api/groups/${groupId}/images`
    console.log('start of image thunk ', createURL);
    const response = await csrfFetch(createURL, {
        method: 'POST',
        headers,
        body: JSON.stringify(imageObject)
    })
    console.log('what about here')
    if (response.ok)
    {
        const jsonResponse = await response.json();
        dispatch(createImageAction(imageObject));
        return jsonResponse;
    }
    else
    {
        return await response.json();
    }
}

export const getOneGroupThunk = (groupId) => async (dispatch) =>
{
    const getURL = "/api/groups/" + groupId;

    console.log('get one group thunk', getURL);

    const response = await csrfFetch(getURL);

    if (response.ok)
    {
        const jsonResponse = await response.json();
        dispatch(getOneGroupAction(jsonResponse));
        return jsonResponse;
    }
    else
    {
        return await response.json();
    }
}

export const updateGroupThunk = (groupObject, groupId) => async (dispatch) =>
{
    const updateURL = "/api/groups/" + groupId

    console.log(updateURL);

    const response = await csrfFetch(updateURL, {
        method: 'PUT',
        headers,
        body: JSON.stringify(groupObject)
    })

    if (response.ok)
    {
        const jsonResponse = await response.json();
        dispatch(updateGroupAction(groupObject));
        return jsonResponse;
    }
    else
    {
        return await response.json();
    }
}

export const deleteGroupThunk = (groupIdToDelete) => async (dispatch) =>
{
    const deleteURL = "/api/groups/" + groupIdToDelete

    console.log(deleteURL);

    const response = await csrfFetch(deleteURL, {
        method: 'DELETE',
    })

    if (response.ok)
    {
        const jsonResponse = await response.json();
        dispatch(deleteGroupAction(groupIdToDelete));
        return jsonResponse;
    }
    else
    {
        return await response.json();
    }
}

const initialState = { allGroups: {}, oneGroup: {} };
const groupReducer = (state = initialState, action) =>
{

    console.log("group Reducer")

    switch (action.type)
    {
        case GET_ALL_GROUPS:
            console.log("getting all groups in groups reducer")
            const allGroupsState = { ...state, allGroups: {} };

            action.groups.Groups.forEach(group =>
            {
                allGroupsState.allGroups[group.id] = group;
            })

            return allGroupsState;
        case GET_ONE_GROUP:
            console.log("get one group reducer")
            const oneGroupState = { ...state, oneGroup: {} }

            oneGroupState.oneGroup = action.groupObject;
            return oneGroupState;
        default:
            return state;
    }
};

export default groupReducer;
