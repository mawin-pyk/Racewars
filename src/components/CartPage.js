import React, { useContext, useState } from 'react'
import { AuthContext } from './Auth'
import { CartContext } from './Cart'
import { Link } from 'react-router-dom'
import { firestore, storage } from '../database/firebase'
import { useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Modal from '@mui/material/Modal'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import './CartPage.css'

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export default function CaerPage() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [address, setAddress] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [slipImage, setSlipImage] = useState("")
    const [slipImageLink, setSlipImageLink] = useState("")
    const [message, setMessage] = useState("")
    const [modalAddAddress, setModalAddAddress] = useState(false)
    const [modalDeleteAddress, setModalDeleteAddress] = useState(false)
    const [alert, setAlert] = useState(false)

    const user = useContext(AuthContext)
    const { cartState, cartDispatch } = useContext(CartContext)
    const { handleSubmit, register, formState: { errors }, reset } = useForm()

    const remove = (productName) => {
        cartDispatch({ type: "remove", payload: productName })
    }

    const increment = (productName) => {
        cartDispatch({ type: "increment", payload: productName })
    }

    const decrement = (productName) => {
        cartDispatch({ type: "decrement", payload: productName })
    }

    const totalAmount = () => {
        const totalAmount = cartState.reduce((sum, productData) => {
            const price = productData.productPrice
            const quantity = productData.productQuantity
            const updateTotalAmount = price * quantity
            sum += updateTotalAmount
            return sum
        }, 0)
        return totalAmount
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

    const uploadFile = () => {
        if (slipImage) {
            const orderNumber = new Date().getTime()
            const fileName = slipImage.name
            const orderRef = storage.child("mainBucket/orders")
            const orderQuery = orderRef.child(`${orderNumber}/${fileName}`)
            orderQuery.put(slipImage)
            .then((result) => {
                result.ref.getDownloadURL()
                .then((slipImageURL) => {
                    addOrder(orderNumber, slipImageURL)
                })
            })
        } else {
            setMessage("????????????????????????????????????")
        }
    }

    const addOrder = (orderNumber, slipImageURL) => {
        const orderRef = firestore.collection("orders")
        orderRef.add({
            user: user.uid,
            orderNumber: orderNumber,
            date: new Date().toLocaleString("en-GB"),
            cart: cartState,
            totalAmount: totalAmount(),
            slipImage: slipImageURL,
            status: "????????????????????????????????????????????????????????????"
        })
        .then(() => {
            cartDispatch({ type: "clear" })
            setAlert(true)
        })
        .catch((error) => {
            console.log(error)
        })
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
        reset()
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
        <div className="CartPage">
            <div className="cart-page__content">
                {cartState.length === 0 && <div className="cart-page__text">
                    <h2>Your shopping cart is empty</h2>
                    <Link to="/product">Shop Now</Link>
                </div>}
                {cartState.length !== 0 && <div className="cart-page__table">
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 337.5 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Image</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Total</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cartState.map((productData, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="center">
                                            <div className="cart-page-table__image">
                                                <img src={productData.productImage[0]} alt="" />
                                            </div>
                                        </TableCell>
                                        <TableCell>{productData.productName}</TableCell>
                                        <TableCell>{productData.productPrice}</TableCell>
                                        <TableCell>
                                            <div className="cart-page-table__quantity">
                                                <button type="button" onClick={() => increment(productData.productName)}>+</button>
                                                <p>{productData.productQuantity}</p>
                                                <button type="button" disabled={productData.productQuantity === 1} onClick={() => decrement(productData.productName)}>-</button>
                                            </div>
                                        </TableCell>
                                        <TableCell>{productData.totalPrice}</TableCell>
                                        <TableCell align="center"><button className="button--red" type="button" onClick={() => remove(productData.productName)}>Delete</button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className="cart-page__total">
                        <h3>Total amount <span>{totalAmount()}</span></h3>
                    </div>
                </div>}
                {user && <div className="cart-page__address">
                    <h2>Address</h2>
                    <p><span>First name : </span>{user.firstName}</p>
                    <p><span>Last name : </span>{user.lastName}</p>
                    <p><span>Address : </span>{user.address}</p>
                    <p><span>Phone number : </span>{user.phoneNumber}</p>
                    <button className="button--blue" type="button" onClick={modalAddAddressOpen}>{user.address ? "Edit" : "Add"}</button>
                    {user.address && <button className="button--red" type="button" onClick={modalDeleteAddressOpen}>Delete</button>}
                </div>}
                <div className="cart-page__payment">
                    <h2>Payment</h2>
                    <p><span>K Bank : </span>017-3-4017X-X</p>
                    <p><span>SCB Bank : </span>169-2-6712X-X</p>
                    {cartState.length !== 0 && <div className="cart-page__order">
                        <label htmlFor="slip"><FontAwesomeIcon icon={faCamera} /> Slip transfer</label>
                        <input type="file" id="slip"
                            onChange={(e) => {
                                setSlipImage(e.target.files[0])
                                setSlipImageLink(URL.createObjectURL(e.target.files[0]))
                            }}
                            onClick={(e) => (e.target.value = null)}
                            style={{ display: "none" }}
                        />
                        {slipImageLink && <div className="slip-image__link">
                            <img src={slipImageLink} alt="" />
                            <FontAwesomeIcon icon={faTimesCircle} size="lg"
                                onClick={() => {
                                    setSlipImage("")
                                    setSlipImageLink("")
                                }}
                            />
                        </div>}
                        {message && <p>{message}</p>}
                        <button className="button--blue" type="button" onClick={uploadFile}>Order Now</button>
                    </div>}
                </div>
            </div>
            <Modal
                open={modalAddAddress}
                onClose={modalAddAddressClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="modal-box">
                    <div className="modal__add">
                        <form onSubmit={handleSubmit(addAddress)}>
                            <h2>{user && user.address ? "Edit address" : "Add address"}</h2>
                            <input type="text" placeholder="Enter first name" name="firstName"
                                {...register("firstName", {
                                    required: "?????????????????????????????????????????????",
                                    minLength: { value: 2, message: "?????????????????????????????????????????? 2 ????????? 20 ????????????????????????" },
                                    maxLength: { value: 20, message: "?????????????????????????????????????????? 2 ????????? 20 ????????????????????????" },
                                    onChange: (e) => setFirstName(e.target.value)
                                })}
                                value={firstName}
                            />
                            <p>{errors.firstName && errors.firstName.message}</p>
                            <input type="text" placeholder="Enter last name" name="lastName"
                                {...register("lastName", {
                                    required: "?????????????????????????????????????????????",
                                    minLength: { value: 2, message: "?????????????????????????????????????????? 2 ????????? 20 ????????????????????????" },
                                    maxLength: { value: 20, message: "?????????????????????????????????????????? 2 ????????? 20 ????????????????????????" },
                                    onChange: (e) => setLastName(e.target.value)
                                })}
                                value={lastName}
                            />
                            <p>{errors.lastName && errors.lastName.message}</p>
                            <textarea type="text" cols="30" rows="10" placeholder="Enter address" name="address"
                                {...register("address", {
                                    required: "?????????????????????????????????????????????",
                                    minLength: { value: 10, message: "?????????????????????????????????????????? 10 ????????? 60 ????????????????????????" },
                                    maxLength: { value: 60, message: "?????????????????????????????????????????? 10 ????????? 60 ????????????????????????" },
                                    onChange: (e) => setAddress(e.target.value)
                                })}
                                value={address}
                            >
                            </textarea>
                            <p>{errors.address && errors.address.message}</p>
                            <input type="text" placeholder="Enter phone number" name="phoneNumber"
                                {...register("phoneNumber", {
                                    required: "?????????????????????????????????????????????",
                                    minLength: { value: 4, message: "?????????????????????????????????????????? 4 ????????? 10 ????????????????????????" },
                                    maxLength: { value: 10, message: "?????????????????????????????????????????? 4 ????????? 10 ????????????????????????" },
                                    onChange: (e) => setPhoneNumber(e.target.value)
                                })}
                                value={phoneNumber}
                            />
                            <p>{errors.phoneNumber && errors.phoneNumber.message}</p>
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
