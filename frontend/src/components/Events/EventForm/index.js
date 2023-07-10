import React, { useState, useEffect } from 'react';
import * as eventActions from '../../../store/event';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './EventForm.css';

export function EventForm({ event, group, isCreateForm })
{

    const [errors, setErrors] = useState({});
    const types = ['In Person', 'Online']
    const dispatch = useDispatch();
    const preexistingEvent = event;
    //
    const [name, setName] = useState(preexistingEvent.name);
    const [description, setDescription] = useState(preexistingEvent.description);
    const [type, setType] = useState(preexistingEvent.type);
    const [price, setPrice] = useState(preexistingEvent.price);
    const [startDate, setStartDate] = useState(preexistingEvent.startDate);
    const [endDate, setEndDate] = useState(preexistingEvent.endDate);
    //const [isPrivate, setIsPrivate] = useState('false');
    //const [location, setLocation] = useState(preexistingEvent ? preexistingEvent.city + ", " + preexistingEvent.state : '');
    const eventImages = preexistingEvent ? preexistingEvent.EventImages : null;
    const eventImagesURL = eventImages ? preexistingEvent.EventImages[0].url : '';
    const [image, setImage] = useState(eventImagesURL);
    const [canSubmit, setCanSubmit] = useState(false);
    const history = useHistory();

    const dateNow = new Date();
    const dateStartDate = new Date(startDate);
    const dateEndDate = new Date(endDate);

    console.log('pre existing ', preexistingEvent);
    console.log('dates ', dateStartDate, dateEndDate);

    useEffect(() =>
    {
        const errors = {};
        setCanSubmit(true);
        if (name.length < 5)
        {
            errors.name = 'Please enter a name of at least 5 characters';
        }

        if (!image.length)
        {
            errors.image = 'Please enter an image URL';
        }

        if (price === '')
        {
            errors.price = 'Price is required (but can be zero).'
        }

        if (type != 'Online' && type != 'In Person')
        {
            errors.type = 'Choose a type.'
        }

        if (startDate === '')
        {
            errors.startDate = 'Start date is required';
        }

        if (endDate === '')
        {
            errors.endDate = 'End date is required';
        }

        if (isNaN(+price))
        {
            errors.price = 'Price must be a number'
        }

        if (dateStartDate == 'Invalid Date')
        {
            errors.startDate = 'Start date is invalid';
        }

        if (dateEndDate == 'Invalid Date')
        {
            errors.endDate = 'End date is invalid';
        }

        if (dateStartDate < dateNow)
        {
            errors.startDate = 'Start date must be after current date.'
        }

        if (dateEndDate < dateStartDate)
        {
            errors.endDate = 'End date must be after start date.'
        }

        if (description.length < 30)
        {
            errors.description = 'Description must be at least 30 characters.'
        }

        setErrors(errors)

        if (Object.keys(errors).length > 0)
        {
            setCanSubmit(false);
        }

    }, [name, description, price, image, type, startDate, endDate])

    if (!isCreateForm)
    {
        if (Object.keys(preexistingEvent).length === 0)
        {
            console.log('returning because null in Event Form')
            return null;
        }
    }

    const handleSubmit = async (e) =>
    {
        console.log('start of handleSubmit in EventForm');
        e.preventDefault();

        if (Object.keys(errors).length !== 0)
        {
            console.log('errors', errors)
            return errors;
        }

        const eventObject = {
            ...preexistingEvent,
            "name": name,
            "description": description,
            "price": price,
            "type": type,
            "startDate": startDate,
            "endDate": endDate
        }

        const imageObject = {
            "url": image,
            "preview": true
        }

        if (isCreateForm)
        {
            dispatch(eventActions.createEventThunk(eventObject, group.id)).then((event) =>
            {
                console.log('event created');
                return dispatch(eventActions.createImageThunk(imageObject, event.id))
                    .then(history.push(`/events/${event.id}`))
                    .catch(async (res) =>
                    {
                        console.log('mysterious error');
                        const data = await res.json();
                        if (data && data.message)
                        {
                            setErrors(data.message);
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
    console.log('got this far loop test');
    return (
        <>
            <h1>Create a new event for {group.name}</h1>
            <form onSubmit={handleSubmit}>
                <label className='event-form-name-container'>
                    <h3>What is the name of your event?</h3>
                    <p>{errors.name}</p>
                    <input type='text' value={name} onChange={(event) => setName(event.target.value)}
                        placeholder='Event Name' />
                </label>
                <div>
                    <h3>Is this an in-person or online group?</h3>
                    <p>{errors.type}</p>
                    <select value={type} onChange={(event) => setType(event.target.value)}>

                        <option value='' disabled>(select one)</option>
                        {types.map(singleType => (
                            <option key={singleType} value={singleType}>
                                {singleType}
                            </option>
                        ))}
                    </select>
                </div>
                <label className='event-form-name-container'>
                    <h3>What is the price for your event?</h3>
                    <p>{errors.price}</p>
                    <input type='text' value={price} onChange={(event) => setPrice(event.target.value)}
                        placeholder='0' />
                </label>

                <label className='event-form-start-container'>
                    <h3>When does your event start?</h3>
                    <p>{errors.startDate}</p>
                    <input type='text' value={startDate} onChange={(event) => setStartDate(event.target.value)}
                        placeholder='MM/DD/YYYY, HH/mm AM' />
                </label>
                <label className='event-form-end-container'>
                    <h3>When does your event end?</h3>
                    <p>{errors.endDate}</p>
                    <input type='text' value={endDate} onChange={(event) => setEndDate(event.target.value)}
                        placeholder='MM/DD/YYYY, HH/mm PM' />
                </label>

                <label className='event-form-image-container'>
                    <h3>Please add an image url for your event below:</h3>
                    <p>{errors.image}</p>
                    <input type='text' value={image} onChange={(event) => setImage(event.target.value)}
                        placeholder='Image URL' />
                </label>

                <label className='event-form-description-container'>
                    <h3>Please describe your event</h3>
                    <p>{errors.description}</p>
                    <input type='text' value={description} onChange={(event) => setDescription(event.target.value)}
                        placeholder='Please include at least 30 characters' />
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
