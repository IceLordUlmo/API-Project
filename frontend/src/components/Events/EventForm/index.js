import React, { useState, useEffect } from 'react';
import * as eventActions from '../../../store/event';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './EventForm.css';

export function EventForm({ preexistingEvent, isCreateForm })
{
    const dispatch = useDispatch();

    //
    const [name, setName] = useState(preexistingEvent ? preexistingEvent.name : '');
    const [about, setAbout] = useState(preexistingEvent ? preexistingEvent.about : '');
    const [type, setType] = useState(preexistingEvent ? preexistingEvent.type : '');
    const [isPrivate, setIsPrivate] = useState('false');
    const [location, setLocation] = useState(preexistingEvent ? preexistingEvent.city + ", " + preexistingEvent.state : '');
    const [image, setImage] = useState(preexistingEvent.EventImages[0] ? preexistingEvent.EventImages[0].url : '');
    const [canSubmit, setCanSubmit] = useState(false);
    const history = useHistory();

    console.log(preexistingEvent)

    useEffect(() =>
    {
        const errors = {};
        setCanSubmit(true);
        if (!name.length)
        {
            errors.name = 'Please enter a name';
        }
        if (about.length < 50)
        {
            errors.about = 'Please enter a description 50 characters or more';
        }
        console.log('in person', type !== 'In person', 'onlinxe', type !== 'Online', 'type', type)
        if (type !== 'In person' && type !== 'Online')
        {
            errors.type = 'Type must be In person or Online';
        }
        if (!location.length)
        {
            errors.location = 'Please enter a location';
        }
        if (!image.length)
        {
            errors.image = 'Please enter an image URL';
        }
        setErrors(errors)
        if (Object.keys(errors).length > 0)
        {
            setCanSubmit(false);
        }

    }, [name, about, location, image, type])

    const [errors, setErrors] = useState({});
    if (!isCreateForm)
    {
        if (Object.keys(preexistingEvent).length === 0) { return null; }
    }

    if (!isCreateForm)
    {
        const joinedLocation = preexistingEvent.city + ', ' + preexistingEvent.state;
        const imageURL = preexistingEvent.image ? preexistingEvent.image.url : '';

        // setName(preexistingEvent.name);
        // setAbout(preexistingEvent.about);
        // setType(preexistingEvent.type);
        // setIsPrivate(preexistingEvent.private);
        // setLocation(joinedLocation);
        // setImage(imageURL);
    }

    const handleSubmit = async (e) =>
    {
        console.log('start of handleSubmit');
        e.preventDefault();


        if (Object.keys(errors).length !== 0)
        {
            console.log('errors', errors)
            return errors;
        }
        console.log(location);
        const [city, state] = location.split(", ");
        const eventObject = {
            "name": name,
            "about": about,
            "type": type,
            "private": (isPrivate === 'true'),
            "city": city,
            "state": state
        }

        const imageObject = {
            "url": image,
            "preview": true
        }

        if (isCreateForm)
        {
            dispatch(eventActions.createEventThunk(eventObject)).then((event) =>
            {

                return dispatch(eventActions.createImageThunk(imageObject, event.id))
                    .then(history.push(`/events/${event.id}`))
                    .catch(async (res) =>
                    {
                        const data = await res.json();
                        if (data && data.errors)
                        {
                            setErrors(data.errors);
                        }
                    })
            });
        }

        // else
        // {
        //     console.log('about to dispatch', eventObject);
        //     dispatch(eventActions.updateEventThunk(eventObject, preexistingEvent.id)).then(history.push(`/events/${preexistingEvent.id}`))
        //         .catch(async (res) =>
        //         {
        //             const data = await res.json();
        //             if (data && data.errors)
        //             {
        //                 setErrors(data.errors);
        //             }
        //         })
        // };
    }


    const buttonText = isCreateForm ? 'Create Event' : 'Update Event'

    return (
        <>
            <h1>Create Event</h1>
            <form onSubmit={handleSubmit}>
                <label className='event-form-name-container'>
                    <p>{errors.name}</p>
                    <input type='text' value={name} onChange={(event) => setName(event.target.value)}
                        placeholder='Event name' />
                </label>
                <label className='event-form-about-container'>
                    <p>{errors.about}</p>
                    <input type='text' value={about} onChange={(event) => setAbout(event.target.value)}
                        placeholder='About the event' />
                </label>
                <label className='event-form-type-container'>
                    <p>{errors.type}</p>
                    <input type='text' value={type} onChange={(event) => setType(event.target.value)}
                        placeholder='Online or In person' />
                </label>
                <label className='event-form-is-private-container'>
                    <h3> Is this event private? </h3>
                    <select value={isPrivate} onChange={(event) => setIsPrivate(event.target.value === 'true')}>

                        <option value='false'>
                            Public
                        </option>
                        <option value='true'>
                            Private
                        </option>
                    </select>
                </label>
                <label className='event-form-location-container'>
                    <p>{errors.location}</p>
                    <input type='text' value={location} onChange={(event) => setLocation(event.target.value)}
                        placeholder='System, Region' />
                </label>
                <label className='event-form-image-container'>
                    <p>{errors.image}</p>
                    <input type='text' value={image} onChange={(event) => setImage(event.target.value)}
                        placeholder='Image URL' />
                </label>
                <button type='submit'
                    disabled={!canSubmit}
                    className={canSubmit ? 'event-form-button-active' : 'event-form-button-inactive'}>
                    {buttonText}
                </button>
            </form>
        </>
    )
}
