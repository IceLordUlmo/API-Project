import "./Logo.css"
import React from 'react'
import { Link } from 'react-router-dom'

export function Logo() {
    return (
        <div className='logo-container'>
            <Link exact to='/'>
                <p className='logo-text'>FleetUp</p>
            </Link>
        </div>
    )
}
