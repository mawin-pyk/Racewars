import React, { useContext, useState } from 'react'
import { AuthContext } from './Auth'
import { firestore, storage } from '../database/firebase'
import { useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faPen } from '@fortawesome/free-solid-svg-icons'
import Modal from '@mui/material/Modal'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import background from '../images/background.jpg'
import avatar from '../images/avatar.png'
import './Profile.css'

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export default function Profile() {
    const [displayName, setDisplayName] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [address, setAddress] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [modalEditDisplayName, setModalEditDisplayName] = useState(false)
    const [modalAddAddress, setModalAddAddress] = useState(false)
    const [modalDeleteAddress, setModalDeleteAddress] = useState(false)
    const [alert, setAlert] = useState(false)

    const user = useContext(AuthContext)
    const { handleSubmit, register, formState: { errors }, reset } = useForm()
    const { handleSubmit: handleSubmit2, register: register2, formState: { errors: errors2 }, reset: reset2 } = useForm()

    const uploadFile = (file) => {
        const userRef = storage.child("mainBucket/users")
        const userQuery = userRef.child(`${user.uid}/profile`)
        userQuery.put(file)
        .then((result) => {
            result.ref.getDownloadURL()
            .then((imageURL) => {
                const userRef = firestore.collection("users").doc(user.uid)
                userRef.update({ image: imageURL })
                .then(() => {
                    setAlert(true)
                })
                .catch((error) => {
                    console.log(error)
                })
            })
        })
    }

    const editDisplayName = () => {
        const userRef = firestore.collection("users")
        userRef.doc(user.uid).update({ displayName: displayName })
        .then(()=> {
            modalEditDisplayNameClose()
            setAlert(true)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const addAddress = () => {
        const userRef = firestore.collection("users")
        userRef.doc(user.uid).update({
            firstName: firstName,
            lastName: lastName,
            address: address,
            phoneNumber: phoneNumber
        })
        .then(() => {
            modalAddAddressClose()
            setAlert(true)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const deleteAddress = () => {
        const userRef = firestore.collection("users")
        userRef.doc(user.uid).update({
            firstName: "",
            lastName: "",
            address: "",
            phoneNumber: ""
        })
        .then(() => {
            modalDeleteAddressClose()
            setAlert(true)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const modalEditDisplayNameOpen = () => {
        setModalEditDisplayName(true)
        setDisplayName(user.displayName)
    }

    const modalEditDisplayNameClose = () => {
        setModalEditDisplayName(false)
        setDisplayName("")
        reset()
    }

    const modalAddAddressOpen = () => {
        setModalAddAddress(true)
        if (user.address) {
            setFirstName(user.firstName)
            setLastName(user.lastName)
            setAddress(user.address)
            setPhoneNumber(user.phoneNumber)
        }
    }

    const modalAddAddressClose = () => {
        setModalAddAddress(false)
        setFirstName("")
        setLastName("")
        setAddress("")
        setPhoneNumber("")
        reset2()
    }

    const modalDeleteAddressOpen = () => {
        setModalDeleteAddress(true)
    }

    const modalDeleteAddressClose = () => {
        setModalDeleteAddress(false)
    }

    const alertClose = (event, reason) => {
        if (reason === 'clickaway') return
        setAlert(false)
    }

    return (
        <div className="Profile">
            <div className="profile-content">
                <div className="profile-background" style={{ backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
                <div className="profile-area">
                    <div className="profile__image">
                        <div className="profile-image__link">
                            <img src={user.image ? user.image : avatar} alt="" />
                        </div>
                        <label htmlFor="userImage"><FontAwesomeIcon icon={faCamera} size="lg" /></label>
                        <input type="file" id="userImage"
                            onChange={(e) => uploadFile(e.target.files[0])}
                            onClick={(e) => (e.target.value = null)}
                            style={{ display: "none" }}
                        />
                        <h2>{user.displayName} <FontAwesomeIcon icon={faPen} size="xs" onClick={modalEditDisplayNameOpen} /></h2>
                    </div>
                    <div className="profile__text">
                        <h3>{user.email}</h3>
                        <hr />
                        <p><span>First name : </span>{user.firstName}</p>
                        <p><span>Last name : </span>{user.lastName}</p>
                        <p><span>Address : </span>{user.address}</p>
                        <p><span>Phone number : </span>{user.phoneNumber}</p>
                        <button className="button--blue" type="button" onClick={modalAddAddressOpen}>{user.address ? "Edit" : "Add"}</button>
                        {user.address && <button className="button--red" type="button" onClick={modalDeleteAddressOpen}>Delete</button>}
                    </div>
                </div>
            </div>
            <Modal
                open={modalEditDisplayName}
                onClose={modalEditDisplayNameClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="modal-box">
                    <div className="modal__add">
                        <form onSubmit={handleSubmit(editDisplayName)}>
                            <h2>Edit display name</h2>
                            <input type="text" placeholder="Enter display name" name="displayName"
                                {...register("displayName", {
                                    required: "กรุณากรอกข้อมูล",
                                    minLength: { value: 2, message: "ความยาวระหว่าง 2 ถึง 20 ตัวอักษร" },
                                    maxLength: { value: 20, message: "ความยาวระหว่าง 2 ถึง 20 ตัวอักษร" },
                                    onChange: (e) => setDisplayName(e.target.value)
                                })}
                                value={displayName}
                            />
                            <p>{errors.displayName && errors.displayName.message}</p>
                            <div className="modal__action">
                                <button className="button--blue" type="submit">Edit</button>
                                <button className="button--red" type="button" onClick={modalEditDisplayNameClose}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
            <Modal
                open={modalAddAddress}
                onClose={modalAddAddressClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="modal-box">
                    <div className="modal__add">
                        <form onSubmit={handleSubmit2(addAddress)}>
                            <h2>{user && user.address ? "Edit address" : "Add address"}</h2>
                            <input type="text" placeholder="Enter first name" name="firstName"
                                {...register2("firstName", {
                                    required: "กรุณากรอกข้อมูล",
                                    minLength: { value: 2, message: "ความยาวระหว่าง 2 ถึง 20 ตัวอักษร" },
                                    maxLength: { value: 20, message: "ความยาวระหว่าง 2 ถึง 20 ตัวอักษร" },
                                    onChange: (e) => setFirstName(e.target.value)
                                })}
                                value={firstName}
                            />
                            <p>{errors2.firstName && errors2.firstName.message}</p>
                            <input type="text" placeholder="Enter last name" name="lastName"
                                {...register2("lastName", {
                                    required: "กรุณากรอกข้อมูล",
                                    minLength: { value: 2, message: "ความยาวระหว่าง 2 ถึง 20 ตัวอักษร" },
                                    maxLength: { value: 20, message: "ความยาวระหว่าง 2 ถึง 20 ตัวอักษร" },
                                    onChange: (e) => setLastName(e.target.value)
                                })}
                                value={lastName}
                            />
                            <p>{errors2.lastName && errors2.lastName.message}</p>
                            <textarea type="text" cols="30" rows="10" placeholder="Enter address" name="address"
                                {...register2("address", {
                                    required: "กรุณากรอกข้อมูล",
                                    minLength: { value: 10, message: "ความยาวระหว่าง 10 ถึง 60 ตัวอักษร" },
                                    maxLength: { value: 60, message: "ความยาวระหว่าง 10 ถึง 60 ตัวอักษร" },
                                    onChange: (e) => setAddress(e.target.value)
                                })}
                                value={address}
                            >
                            </textarea>
                            <p>{errors2.address && errors2.address.message}</p>
                            <input type="text" placeholder="Enter phone number" name="phoneNumber"
                                {...register2("phoneNumber", {
                                    required: "กรุณากรอกข้อมูล",
                                    minLength: { value: 4, message: "ความยาวระหว่าง 4 ถึง 10 ตัวอักษร" },
                                    maxLength: { value: 10, message: "ความยาวระหว่าง 4 ถึง 10 ตัวอักษร" },
                                    onChange: (e) => setPhoneNumber(e.target.value)
                                })}
                                value={phoneNumber}
                            />
                            <p>{errors2.phoneNumber && errors2.phoneNumber.message}</p>
                            <div className="modal__action">
                                <button className="button--blue" type="submit">{user && user.address ? "Edit" : "Add"}</button>
                                <button className="button--red" type="button" onClick={modalAddAddressClose}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
            <Modal
                open={modalDeleteAddress}
                onClose={modalDeleteAddressClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="modal-box">
                    <div className="modal__delete">
                        <h2>Delete address</h2>
                        <div className="modal__action">
                            <button className="button--red" type="button" onClick={deleteAddress}>Delete</button>
                            <button className="button--blue" type="button" onClick={modalDeleteAddressClose}>Cancel</button>
                        </div>
                    </div>
                </div>
            </Modal>
            <Snackbar open={alert} autoHideDuration={3000} onClose={alertClose}>
                <Alert onClose={alertClose} severity="success" sx={{ width: '100%' }}>
                    Success
                </Alert>
            </Snackbar>
        </div>
    )
}
