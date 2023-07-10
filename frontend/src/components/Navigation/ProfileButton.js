import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../Modals/LoginFormModal';
import SignupFormModal from '../Modals/SignupFormModal';
import { useHistory, NavLink } from "react-router-dom";

function ProfileButton({ user })
{
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const history = useHistory();

    const openMenu = () =>
    {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() =>
    {
        if (!showMenu) return;

        const closeMenu = (e) =>
        {
            if (!ulRef.current.contains(e.target))
            {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    const logout = (e) =>
    {
        e.preventDefault();
        dispatch(sessionActions.logout());
        closeMenu();
        history.push('/');
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <>
            <button onClick={openMenu}>
                <i className="fas fa-user-circle" />
            </button>
            <ul className={ulClassName} ref={ulRef}>
                {user ? (
                    <>
                        <div className='profile-button-welcome'>
                            <li>Hello, {user.firstName}</li>
                            <li>{user.email}</li>
                        </div>
                        <div className='profile-button-see-all'>
                            <li>
                                <NavLink to="/groups">See All Groups</NavLink>
                            </li><li>
                                <NavLink to="/events">See All Events</NavLink>
                            </li>
                        </div>
                        <li>
                            <button className='profile-button-logout' onClick={logout}>Log Out</button>
                        </li>

                    </>
                ) : (
                    <>
                        <OpenModalMenuItem
                            itemText="Log In"
                            onItemClick={closeMenu}
                            modalComponent={<LoginFormModal />}
                        />
                        <OpenModalMenuItem
                            itemText="Sign Up"
                            onItemClick={closeMenu}
                            modalComponent={<SignupFormModal />}
                        />
                        <div className='profile-button-see-all'>
                            <li>
                                <NavLink to="/groups">See All Groups</NavLink>
                            </li><li>
                                <NavLink to="/events">See All Events</NavLink>
                            </li>
                        </div>
                    </>
                )}

            </ul>
        </>
    );
}

export default ProfileButton;
