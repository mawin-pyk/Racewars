import React, { useEffect, useContext } from 'react'
import { AuthContext } from './Auth'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import './Admin.css'

export default function Admin() {
    const user = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (user.role === "user") navigate("/")
    }, [user, navigate])
    
    return (
        <div className="Admin">
            <div className="admin-content">
                <div className="dropdown__icon">
                    <FontAwesomeIcon icon={faBars} size="2x" />
                    <div className="dropdown__menu">
                        <Link to="/admin/manageproduct">Product</Link>
                        <Link to="/admin/manageorder">Order</Link>
                    </div>
                </div>
                <div className="admin__menu">
                    <NavLink to="/admin/manageproduct">Product</NavLink>
                    <NavLink to="/admin/manageorder">Order</NavLink>
                </div>
                <div className="admin__layout">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
