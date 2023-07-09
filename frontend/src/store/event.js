// need for authentication
import { csrfFetch } from "./csrf";

// consts for actions
const GET_ALL_EVENTS = "events/getEvents"
const GET_ONE_EVENT = "events/getOneEvent"
const CREATE_EVENT = "events/createOneEvent"
const CREATE_IMAGE = "events/newImage"
//const UPDATE_EVENT = "events/updateEvent"
const DELETE_EVENT = "events/deleteEvent"
const GET_ONE_GROUPS_EVENTS = "events/getOneGroupsEvents"
//const headers = { 'Content-Type': 'application/json' }
const headers = { 'Content-Type': 'application/json' }
// actions to export
export const getAllEventsAction = events => (
    {
        type: GET_ALL_EVENTS,
        events
    }
)

export const getOneGroupsEventsAction = events => (
    {
        type: GET_ONE_GROUPS_EVENTS,
        events
    }
)

export const getOneEventAction = (eventObject) => (
    {
        type: GET_ONE_EVENT,
        eventObject
    }
)
export const createEventAction = (eventObject) => (
    {
        type: CREATE_EVENT,
        eventObject
    }
)
export const createImageAction = (imageObject, eventObject) => (
    {
        type: CREATE_IMAGE,
        imageObject,
        eventObject
    }
)

// export const updateEventAction = (eventObject) => (
//     {
//         type: UPDATE_EVENT,
//         eventObject
//     }
// )

export const deleteEventAction = eventIdToDelete => (
    {
        type: DELETE_EVENT,
        eventIdToDelete
    }
)

// thunk about it

export const getAllEventsThunk = () => async (dispatch) =>
{

    const response = await fetch("/api/events");

    const allEventsJson = await response.json();

    if (response.ok)
    {
        await dispatch(getAllEventsAction(allEventsJson));
        console.log("events thunk ok")
    } else
    {
        const error = await response.json();
        console.log("events thunk definitely NOT ok")
        return error;
    }
}

export const getOneGroupsEventsThunk = (groupId) => async (dispatch) =>
{

    const response = await fetch(`/api/groups/${groupId}/events`);

    const oneGroupsEventsJson = await response.json();

    if (response.ok)
    {
        await dispatch(getOneGroupsEventsAction(oneGroupsEventsJson));
        console.log("one groups events thunk ok")
    } else
    {
        console.log("one groups events thunk definitely NOT ok")
        return { oneGroupsEventsJson };
    }
}

export const createEventThunk = (eventObject) => async (dispatch) =>
{

    console.log('we got to create event thunk: ', eventObject)
    const request = {
        method: 'POST',
        headers,
        body: JSON.stringify(eventObject)
    }
    console.log(request);
    const response = await csrfFetch('api/events', request)
    console.log('stage 2 of create event thunk')
    if (response.ok)
    {
        console.log('create event thunk response ok')
        const jsonResponse = await response.json();
        dispatch(createEventAction(eventObject));
        return jsonResponse;
    }
    else
    {
        console.log('create event thunk response NOT ok')
        return await response.json();
    }
}

export const createImageThunk = (imageObject, eventId) => async (dispatch) =>
{
    const createURL = `/api/events/${eventId}/images`
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

export const getOneEventThunk = (eventId) => async (dispatch) =>
{
    const getURL = "/api/events/" + eventId;

    console.log(getURL);

    const response = await csrfFetch(getURL);

    if (response.ok)
    {
        const jsonResponse = await response.json();
        dispatch(getOneEventAction(jsonResponse));
        return jsonResponse;
    }
    else
    {
        return await response.json();
    }
}

// export const updateEventThunk = (eventObject, eventId) => async (dispatch) =>
// {
//     const updateURL = "/api/events/" + eventId

//     console.log(updateURL);

//     const response = await csrfFetch(updateURL, {
//         method: 'PUT',
//         headers,
//         body: JSON.stringify(eventObject)
//     })

//     if (response.ok)
//     {
//         const jsonResponse = await response.json();
//         dispatch(updateEventAction(eventObject));
//         return jsonResponse;
//     }
//     else
//     {
//         return await response.json();
//     }
// }

export const deleteEventThunk = (eventIdToDelete) => async (dispatch) =>
{
    const deleteURL = "/api/events/" + eventIdToDelete

    console.log(deleteURL);

    const response = await csrfFetch(deleteURL, {
        method: 'DELETE',
    })

    if (response.ok)
    {
        const jsonResponse = await response.json();
        dispatch(deleteEventAction(eventIdToDelete));
        return jsonResponse;
    }
    else
    {
        return await response.json(); // why do I feel like this won't work
    }
}

const initialState = { allEvents: {}, singleEvent: {}, oneGroupsEvents: {} };
const eventReducer = (state = initialState, action) =>
{

    console.log("event Reducer")

    switch (action.type)
    {
        case GET_ALL_EVENTS:
            console.log("getting all events in events reducer")
            const allEventsState = { ...state, allEvents: {} };

            action.events.Events.forEach(event =>
            {
                allEventsState.allEvents[event.id] = event;
            })

            return allEventsState;
        case GET_ONE_EVENT:
            console.log("get one event reducer")
            const oneEventState = { ...state, oneEvent: {} }

            oneEventState.oneEvent = action.eventObject;
            return oneEventState;
        case GET_ONE_GROUPS_EVENTS:
            console.log("get one groups events reducer")
            const oneGroupsEventsState = { ...state, oneGroupsEvents: {} }

            oneGroupsEventsState.oneGroupsEvents = action.events;
            return oneGroupsEventsState;
        default:
            return state;
    }
};

export default eventReducer;
