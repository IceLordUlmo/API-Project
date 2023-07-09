import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import { Logo } from './Logo/index'
import { UpdateGroup } from '../Groups/UpdateGroup'
import { CreateGroup } from '../Groups/CreateGroup'
import OpenModalMenuItem from './OpenModalMenuItem'

function Navigation({ isLoaded })
{
    const sessionUser = useSelector(state => state.session.user);

    return (
        <div className='navigation-container'>
            <div className='navigation-logo'>
                <Logo />
            </div>
            <div className='navigation-top'>
                <ul className='navigation-top-right'>
                    {sessionUser && (
                        <li className='navigation-top-right-container'>
                            <NavLink to='/groups/new' className='navigation-top-right-link'>
                                Start a new group
                            </NavLink>
                        </li>
                    )}
                    {isLoaded && (
                        <li>
                            <ProfileButton user={sessionUser} />
                        </li>
                    )}
                </ul>

            </div>

        </div>
    );
}

export default Navigation;
