import React from 'react'
import { Link } from 'react-router-dom'
import banner from '../images/banner.jpeg'
import './Home.css'

export default function Home() {
    return (
        <div className="Home">
            <div className="home-content">
                <div className="home-banner" style={{ backgroundImage: `url(${banner})`, backgroundSize: "cover", backgroundPosition: "bottom" }}>
                    <div className="banner__text">
                        <h1>Wheels & Tires</h1>
                        <h2>High Performance</h2>
                        <Link to="product">Shop Now</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
