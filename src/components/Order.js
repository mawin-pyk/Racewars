import React, { useEffect, useContext, useState } from 'react'
import { AuthContext } from './Auth'
import { firestore } from '../database/firebase'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import './Order.css'

export default function Order() {
    const [orderDataArray, setOrderDataArray] = useState([])

    const user = useContext(AuthContext)
    
    useEffect(() => {
        let cancel = false

        const orderRef = firestore.collection("orders")
        const orderQuery = orderRef.where("user", "==", user.uid ? user.uid : null)
        orderQuery.onSnapshot((snapshot) => {
            if (cancel) return
            let dataArray = []
            snapshot.forEach((doc) => {
                dataArray = [...dataArray, doc.data()]
            })
            setOrderDataArray(dataArray)
        })

        return () => {
            cancel = true
        }
    }, [user])

    return (
        <div className="Order">
            <div className="order__content">
                <h2>Order</h2>
                {orderDataArray.length !== 0 && <div className="order__table">
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 337.5 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order No.</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Total amount</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orderDataArray.map((orderData, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>{orderData.orderNumber}</TableCell>
                                        <TableCell>{orderData.date}</TableCell>
                                        <TableCell>{orderData.totalAmount}</TableCell>
                                        <TableCell>{orderData.status}</TableCell>
                                        <TableCell align="center"><button className="button--blue" type="button">More</button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>}
            </div>
        </div>
    )
}
