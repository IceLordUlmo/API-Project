import "./Logo.css"
import React from 'react'
import { Link } from 'react-router-dom'

export function Logo() {
    return (
        <div className='logo-container'>
            <Link exact to='/'>
                <h1 className='logo-text'>FleetUp</h1>
            </Link>
        </div>
    )
}
