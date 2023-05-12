import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import { Logo } from './Logo/index'
import { UpdateGroup } from '../Groups/UpdateGroup'
import { CreateGroup } from '../Groups/CreateGroup'
import OpenModalMenuItem from './OpenModalMenuItem'

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
                <OpenModalMenuItem
                    itemText="Create a Group"
                    modalComponent={<CreateGroup />}
                />
            </div>

        </div>
    );
}

export default Navigation;
