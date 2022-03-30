import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons'
import './Footer.css'

export default function Footer() {
    return (
        <div className="Footer">
            <div className="footer-content">
                <div className="footer__social">
                    <FontAwesomeIcon icon={faFacebook} size="lg" />
                    <FontAwesomeIcon icon={faInstagram} size="lg" />
                    <FontAwesomeIcon icon={faTwitter} size="lg" />
                    <FontAwesomeIcon icon={faYoutube} size="lg" />
                </div>
                <div className="footer__text">
                    <p>High Performance ▰ ▰ ▰ ▰ ▰</p>
                </div>
            </div>
        </div>
    )
}
