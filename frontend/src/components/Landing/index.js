import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import fleetUpImage from './fleetup.jpg'
import groupImage from './group.png'
import startImage from './start.png'
import eventImage from './event.png'
import './Landing.css'


export function Landing()
{
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
                    <img src={fleetUpImage} alt='image of a fleet'></img>
                </div>
            </div>
            <div className='landing-div-two'>
                <h3 className='landing-div-two-subtitle'>
                    How Fleetup Works
                </h3>
                <p className='landing-div-two-caption'>Words about the workings of Fleetup</p>
            </div>
            <div className='landing-div-three'>
                <Link className='landing-div-three-link' to='/groups'>
                    <div className='landing-div-three-image'>
                        <div>
                            <img src={groupImage} alt='image of a fleet in space'></img>
                        </div>
                    </div>
                    <div>
                        See all groups
                    </div>
                </Link>
                <Link className='landing-div-three-link' to='/event'>
                    <div className='landing-div-three-image'>
                        <img src={eventImage} alt='image of a fleet battle in space'></img>
                    </div>
                    <div>Find an event
                    </div>
                </Link>
                <Link className='landing-div-three-link' to='/groups/new'>
                    <div className='landing-div-three-image'>
                        <img src={startImage} alt='image of two ships in space'></img>
                    </div>
                    <div>
                        Start a group
                    </div>
                </Link>
            </div>
            <div className='landing-div-four'>
                <div className='join-fleetup'>

                </div>
            </div>
        </div>
    )
}
