import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import fleetUpImage from './fleetup.jpg'
import groupImage from './group.png'
import startImage from './start.png'
import eventImage from './event.png'
import './Landing.css'
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem'
import SignupFormModal from '../SignupFormModal';

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
                    How FleetUp Works
                </h3>
                <p className='landing-div-two-caption'>Words about the workings of Fleetup</p>
            </div>
            <div className='landing-div-three'>
                <div className='landing-div-three-link' >
                    <div className='landing-div-three-image'>
                        <div>
                            <img src={groupImage} alt='image of a fleet in space'></img>
                        </div>
                    </div>
                    <Link to='/groups' className='landing-hover-link'>
                        See all groups
                    </Link>
                    <p>
                        Text about the warm fuzziness of finding a group.
                    </p>
                </div>
                <div className='landing-div-three-link' >
                    <div className='landing-div-three-image'>
                        <img src={eventImage} alt='image of a fleet battle in space'></img>
                    </div>
                    <Link to='/events' className='landing-hover-link'>
                        Find an event
                    </Link>
                    <p>
                        Events are wonderful and you should do them!
                    </p>
                </div>
                {sessionUser ? (
                    <div className='landing-div-three-link'>
                        <div className='landing-div-three-image'>
                            <img src={startImage} alt='image of two ships in space'></img>
                        </div>
                        <Link to='/groups/new' className='landing-hover-link'>
                            Start a new group
                        </Link>
                    </div>) : (<div className='landing-div-three-link'><div className='landing-div-three-image'>
                        <img src={startImage} alt='image of two ships in space'></img>
                    </div>
                        <div className='landing-disabled'>
                            Start a new group
                        </div>
                        <p>
                            Becoming a Fleet Commander for an Event is easier than you think!
                        </p>
                    </div>)

                }

            </div>
            {!sessionUser ? (
                <div className="landing-join-fleetup-button">
                    <OpenModalMenuItem
                        itemText="Join FleetUp"
                        modalComponent={<SignupFormModal />}

                    />
                </div>
            ) :
                <div className='landing-no-join-spacer'>
                </div>}
        </div>
    )
}
