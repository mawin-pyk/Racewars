import React from 'react'
import './Contact.css'

export default function Contact() {
    return (
        <div className="Contact">
            <div className="contact-content">
                <div className="contact__map">
                    <iframe title="Google map" src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2304.0975641947275!2d100.56078843528873!3d13.777983125961999!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29e9d8144beb9%3A0x66e0f2c1ee23aa2d!2z4Lih4Lir4Liy4Lin4Li04LiX4Lii4Liy4Lil4Lix4Lii4Lir4Lit4LiB4Liy4Lij4LiE4LmJ4Liy4LmE4LiX4Lii!5e0!3m2!1sth!2sth!4v1630460715889!5m2!1sth!2sth" width="100%" height="100%"></iframe>
                </div>
                <div className="contact__bottom">
                    <form>
                        <h2>Send a message</h2>
                        <label>Name</label>
                        <input type="text" placeholder="Enter name" />
                        <label>Email</label>
                        <input type="text" placeholder="Enter email" />
                        <label>Message</label>
                        <textarea cols="30" rows="10" placeholder="Enter message"></textarea>
                        <button className="button--blue" type="submit" disabled={true}>Send</button>
                    </form>
                    <div className="contact__address">
                        <h2>Address</h2>
                        <p>Racewars</p>
                        <p>126/1 Vibhavadi Rangsit 2</p>
                        <p>Ratchadaphisek</p>
                        <p>Din Daeng Bangkok 10400</p>
                        <p>Phone: 02 697 6000</p>
                        <p>Email: racewars@gmail.com</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
