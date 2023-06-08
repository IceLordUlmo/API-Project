import React, { useState, useEffect } from 'react';
import * as groupActions from '../../../store/group';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './GroupForm.css';

export function GroupForm({ preexistingGroup, isCreateForm })
{
    const dispatch = useDispatch();

    //
    const [name, setName] = useState(preexistingGroup ? preexistingGroup.name : '');
    const [about, setAbout] = useState(preexistingGroup ? preexistingGroup.about : '');
    const [type, setType] = useState(preexistingGroup ? preexistingGroup.type : '');
    const [isPrivate, setIsPrivate] = useState('false');
    const [location, setLocation] = useState(preexistingGroup ? preexistingGroup.city : '');
    const [image, setImage] = useState(preexistingGroup ? preexistingGroup.GroupImages[0].url : '');
    const history = useHistory();

    console.log(preexistingGroup)

    useEffect(() =>
    {
        const errors = {};

        if (!name.length)
        {
            errors.name = 'Please enter a name';
        }
        if (about.length < 50)
        {
            errors.about = 'Please enter a description 50 characters or more';
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
    }, [name, about, location, image])

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
        console.log(location);
        const [city, state] = location.split(", ");
        const groupObject = {
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
            dispatch(groupActions.updateGroupThunk(groupObject)).then((group) => { history.push(`/groups/${group.id}`) })
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
            <h1>Create Group</h1>
            <form onSubmit={handleSubmit}>
                <label className='group-form-name-container'>
                    <input type='text' value={name} onChange={(event) => setName(event.target.value)}
                        placeholder='Group name' />
                </label>
                <label className='group-form-about-container'>
                    <input type='text' value={about} onChange={(event) => setAbout(event.target.value)}
                        placeholder='About the group' />
                </label>
                <label className='group-form-type-container'>
                    <input type='text' value={type} onChange={(event) => setType(event.target.value)}
                        placeholder='Online or In-Person' />
                </label>
                <label className='group-form-is-private-container'>
                    <h3> Is this group private? </h3>
                    <select value={isPrivate} onChange={(event) => setIsPrivate(event.target.value === 'true')}>

                        <option value='false'>
                            Public
                        </option>
                        <option value='true'>
                            Private
                        </option>
                    </select>
                </label>
                <label className='group-form-location-container'>
                    <input type='text' value={location} onChange={(event) => setLocation(event.target.value)}
                        placeholder='System, Region' />
                </label>
                <label className='group-form-image-container'>
                    <input type='text' value={image} onChange={(event) => setImage(event.target.value)}
                        placeholder='Image URL' />
                </label>
                <button type='submit'>
                    {buttonText}
                </button>
            </form>
        </>
    )
}
