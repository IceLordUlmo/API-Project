import React, { useState, useEffect } from 'react';
import * as groupActions from '../../store/group';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './GroupForm.css';

export function GroupFormModal({ preexistingGroup, isCreateForm }) {
    const dispatch = useDispatch();

    //
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('');
    const [isPrivate, setIsPrivate] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState('');

    const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false);

    const joinedLocation = preexistingGroup.city + ', ' + preexistingGroup.state;
    const imageURL = preexistingGroup.image ? preexistingGroup.image.url : '';

    if (!isCreateForm) {
        setName(preexistingGroup.name);
        setAbout(preexistingGroup.about);
        setType(preexistingGroup.type);
        setIsPrivate(preexistingGroup.private);
        setLocation(joinedLocation);
        setImage(imageURL);
    }

    useEffect(() => {
        const errors = {};

        if (!name.length) {
            errors.name = 'Please enter a name';
        }
        if (about.length < 31) {
            errors.about = 'Please enter a description 30 characters or less';
        }
        if (!location.length) {
            errors.location = 'Please enter a location';
        }
        if (!image.length) {
            errors.image = 'Please enter an image URL';
        }

        setErrors(errors)
    }, [name, about, location, image])

    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasBeenSubmitted(true);


        if (Object.keys(errors).length !== 0) {
            return errors;
        }

        const [city, state] = location.split(", ");
        const groupObject = {
            name,
            about,
            type,
            private: isPrivate,
            city,
            state
        }

        const imageObject = {
            url: image,
            preview: true
        }

        const group = dispatch(groupActions.createGroupAction({ groupObject }))

        return dispatch(groupActions.createImageAction(imageObject, group))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
    }

    return (
        <>
            <h1>Create Group</h1>
            <form onSubmit={handleSubmit}>
                <label className='group-form-name-container'>
                    <input type='text' value={name} onChange={(event) => setName(event.target.value)} />
                </label>
                <label className='group-form-about-container'>
                    <input type='text' value={about} onChange={(event) => setAbout(event.target.value)} />
                </label>
                <label className='group-form-type-container'>
                    <input type='text' value={type} onChange={(event) => setType(event.target.value)} />
                </label>
                <label className='group-form-is-private-container'>
                    <select value={isPrivate} onChange={(event) => setIsPrivate(event.target.value === 'true')}>
                        <h3> Is this group private? </h3>
                        <option value='false'>
                            Public
                        </option>
                        <option value='true'>
                            Private
                        </option>
                    </select>
                </label>
                <label className='group-form-location-container'>
                    <input type='text' value={location} onChange={(event) => setLocation(event.target.value)} />
                </label>
                <label className='group-form-image-container'>
                    <input type='text' value={image} onChange={(event) => setImage(event.target.value)} />
                </label>
            </form>
        </>
    )
}
