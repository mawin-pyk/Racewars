import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import './Account.css'

export default function Account() {
    return (
        <div className="Account">
            <div className="account-content">
                <div className="dropdown__icon">
                    <FontAwesomeIcon icon={faBars} size="2x" />
                    <div className="dropdown__menu">
                        <Link to="/account/profile">Profile</Link>
                        <Link to="/account/order">Order</Link>
                    </div>
                </div>
                <div className="account__menu">
                    <NavLink to="/account/profile">Profile</NavLink>
                    <NavLink to="/account/order">Order</NavLink>
                </div>
                <div className="account__layout">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
