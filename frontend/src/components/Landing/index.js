import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import './Landing.css'


export function Landing() {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <div className='landing-container'>
            <div className='landing-div-one'>
                <div className='landing-div-one-texts'>
                    <h2 className='landing-div-one-header'>
                        Find a fleet group to join or a fleet event today!
                    </h2>
                    <p className='landing-div-one-p'>In EVE Online it can be tough to know who to fleet up with or what opportunities there are.
                        Join a group with similar goals or find an event that matches your skills </p>

                </div>
                <div className='landing-div-one-image'>
                    coming soon
                </div>
            </div>
            <div className='landing-div-two'>
                <h3 className='landing-div-two-subtitle'>
                    Subtitle
                </h3>
                <p className='landing-div-two-caption'>
                    Caption
                </p>
            </div>
            <div className='landing-div-three'>
                <Link className='landing-div-three-link' to='/groups'>
                    See all groups
                </Link>
                <Link className='landing-div-three-link' to='/event'>
                    Find an event
                </Link>
                <Link className='landing-div-three-link' to='/event'>
                    Start a group
                </Link>
            </div>
            <div className='landing-div-four'>
                <div className='join-fleetup'>

                </div>
            </div>
        </div>
    )
}
