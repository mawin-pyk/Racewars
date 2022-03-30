import React, { useContext, useEffect } from 'react'
import { AuthContext } from './Auth'
import { CartContext } from './Cart'
import { Link } from 'react-router-dom'
import { auth } from '../database/firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons'
import logo from '../images/logo.png'
import './Header.css'

export default function Header() {
    const user = useContext(AuthContext)
    const { cartState, cartDispatch } = useContext(CartContext)
    const admin = user && user.role === "admin"

    useEffect(() => {
        const setCart = async () => {
            const cart = await cartState
            sessionStorage.setItem("cart", JSON.stringify(cart))
        }
        setCart()
    }, [cartState])
    
    const emailSignOut = () => {
        auth.signOut()
        .then(() => {
            sessionStorage.removeItem("cart")
            cartDispatch({ type: "clear" })
        })
        .catch((error) => {
            console.log(error.code)
        })
    }

    return (
        <div className="Header">
            <div className="header-content">
                <div className="header__logo">
                    <Link to="/"><img src={logo} alt="" /></Link>
                </div>
                <div className="header__menu">
                    <Link to="product">Product</Link>
                    <Link to="cart">Cart{cartState.length !== 0 && <span>{cartState.length}</span>}</Link>
                    {admin && <Link to="admin/manageproduct">Admin</Link>}
                    <Link to="contact">Contact</Link>
                    {user ? <p onClick={emailSignOut}>Sign out</p> : <Link to="signin">Sign in</Link>}
                    {user && <Link to="account/profile"><FontAwesomeIcon icon={faUser} size="lg" /></Link>}
                </div>
                <div className="header-bottom">
                    <div className="dropdown__icon">
                        <FontAwesomeIcon icon={faBars} size="2x" />
                        <div className="dropdown__menu">
                            <Link to="product">Product</Link>
                            <Link to="cart">Cart {cartState.length !== 0 && <span>{cartState.length}</span>}</Link>
                            {user && <Link to="account/profile">Account</Link>}
                            {admin && <Link to="admin/manageproduct">Admin</Link>}
                            <Link to="contact">Contact</Link>
                            {user ? <p onClick={emailSignOut}>Sign out</p> : <Link to="signin">Sign in</Link>}
                        </div>
                    </div>
                    <div className="header__search">
                        <input type="search" placeholder="search" />
                    </div>
                </div>
            </div>
        </div>
    )
}
