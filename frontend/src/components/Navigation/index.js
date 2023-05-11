import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import { Logo } from './Logo/index'

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <div className='navigation-container'>
            <div className='navigation-top'>
                <Logo />
                <ul className='navigation-top-right'>
                    {isLoaded && (
                        <li>
                            <ProfileButton user={sessionUser} />
                        </li>
                    )}
                </ul>

            </div>
            <div>
                <NavLink to="/groups">See All Groups</NavLink>
            </div>
            <div>
                <NavLink to="/groups/new">Create a Group</NavLink>
            </div>
            <div>
                <NavLink to="/groups/update">Update a Group</NavLink>
            </div>
            <div>
                <NavLink to="/groups/delete">Delete a Group</NavLink>
            </div>
        </div>
    );
}

export default Navigation;
