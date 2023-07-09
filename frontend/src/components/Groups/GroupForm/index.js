import React, { useState, useEffect } from 'react';
import * as groupActions from '../../../store/group';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './GroupForm.css';

export function GroupForm({ preexistingGroup, isCreateForm })
{
    const types = ['In Person', 'Online']
    const dispatch = useDispatch();

    //

    const [name, setName] = useState(preexistingGroup ? preexistingGroup.name : '');
    const [about, setAbout] = useState(preexistingGroup ? preexistingGroup.about : '');
    const [type, setType] = useState(preexistingGroup ? preexistingGroup.type : '');
    const [isPrivate, setIsPrivate] = useState('false');

    // the variables previously known as location
    const [city, setCity] = useState(preexistingGroup ? preexistingGroup.city : '');
    const [state, setState] = useState(preexistingGroup ? preexistingGroup.state : '');

    const groupImages = preexistingGroup ? preexistingGroup.GroupImages : null;
    const groupImagesURL = groupImages ? preexistingGroup.GroupImages[0].url : '';
    const [image, setImage] = useState(groupImagesURL);

    const [canSubmit, setCanSubmit] = useState(false);
    const history = useHistory();

    console.log(preexistingGroup)

    useEffect(() =>
    {
        const errors = {};
        setCanSubmit(true);
        if (!name.length)
        {
            errors.name = 'Please enter a name';
        }
        if (about.length < 30)
        {
            errors.about = 'Please enter a description 30 characters or more';
        }
        console.log('in person', type !== 'In Person', 'online', type !== 'Online', 'type', type)
        // if (!location.length)
        // {
        //     errors.location = 'Please enter a location';
        // }
        if (!city.length)
        {
            errors["city"] = "City is required.";
        }
        if (!state.length)
        {
            errors["state"] = "State is required.";
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

    }, [name, about, city, state, image, type])

    const [errors, setErrors] = useState({});
    if (!isCreateForm)
    {
        if (Object.keys(preexistingGroup).length === 0) { return null; }
    }

    if (!isCreateForm)
    {
        const joinedLocation = preexistingGroup.city + ', ' + preexistingGroup.state;
        const imageURL = preexistingGroup.image ? preexistingGroup.image.url : '';

        // setName(preexistingGroup.name);
        // setAbout(preexistingGroup.about);
        // setType(preexistingGroup.type);
        // setIsPrivate(preexistingGroup.private);
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
        const groupObject = {
            ...preexistingGroup,
            "name": name,
            "about": about,
            "type": type,
            "private": isPrivate,
            "city": city,
            "state": state
        }

        const imageObject = {
            "url": image,
            "preview": true
        }

        if (isCreateForm)
        {
            dispatch(groupActions.createGroupThunk(groupObject)).then((group) =>
            {

                return dispatch(groupActions.createImageThunk(imageObject, group.id))
                    .then(history.push(`/groups/${group.id}`))
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

        else
        {
            console.log('about to dispatch', groupObject);
            dispatch(groupActions.updateGroupThunk(groupObject, preexistingGroup.id)).then(history.push(`/groups/${preexistingGroup.id}`))
                .catch(async (res) =>
                {
                    const data = await res.json();
                    if (data && data.errors)
                    {
                        setErrors(data.errors);
                    }
                })
        };
    }


    const buttonText = isCreateForm ? 'Create Group' : 'Update Group'

    return (
        <>
            {isCreateForm ? <h1>Start A New Group</h1> : <h1>Update Group</h1>}
            <form onSubmit={handleSubmit}>
                <label className='group-form-location-container'>
                    <h3>Set your group's location</h3>
                    <h4>Fleetup groups meet locally, in person, and online. We'll connect you with people in your area.</h4>

                    <p>{errors.city}</p>
                    <input type='text' value={city} onChange={(event) => setCity(event.target.value)}
                        placeholder='City' />
                    <p>{errors.state}</p>
                    <input type='text' value={state} onChange={(event) => setState(event.target.value)}
                        placeholder='STATE' />
                </label>
                <label className='group-form-name-container'>
                    <h3>What will your group's name be?</h3>
                    <h4>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</h4>

                    <p>{errors.name}</p>
                    <input type='text' value={name} onChange={(event) => setName(event.target.value)}
                        placeholder='What is your group name?' />
                </label>
                <label className='group-form-about-container'>
                    <h3>Describe the purpose of your group.</h3>
                    <h4>People will see this when we promote your group, but you'll be able to add to it later, too.
                        <ol>
                            <li>What's the purpose of the group?</li>
                            <li>Who should join?</li>
                            <li>What will you do at your events?</li>
                        </ol>
                    </h4>

                    <p>{errors.about}</p>
                    <input type='text' value={about} onChange={(event) => setAbout(event.target.value)}
                        placeholder='Please write at least 30 characters' />
                </label>
                <div className='group-form-section-four'>
                    <label className='group-form-type-container'>
                        <h3>Is this an in-person or online group?</h3>

                        <select value={type} onChange={(event) => setType(event.target.value)}>
                            <option value='' disabled>(select one)</option>
                            {types.map(singleType => (
                                <option key={singleType} value={singleType}>
                                    {singleType}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className='group-form-is-private-container'>
                        <h3>Is this group private or public?</h3>

                        <select value={isPrivate} onChange={(event) => setIsPrivate(event.target.value)}>

                            <option value='false'>
                                Public
                            </option>
                            <option value='true'>
                                Private
                            </option>
                        </select>
                    </label>

                    <label className='group-form-image-container'>
                        <h3>Please add an image URL for your group below:</h3>
                        <p>{errors.image}</p>
                        <input type='text' value={image} onChange={(event) => setImage(event.target.value)}
                            placeholder='Image Url' />
                    </label>
                </div>
                <button type='submit'
                    disabled={!canSubmit}
                    className={canSubmit ? 'group-form-button-active' : 'group-form-button-inactive'}>
                    {buttonText}
                </button>
            </form>
        </>
    )
}
