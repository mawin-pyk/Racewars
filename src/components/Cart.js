import React, { createContext, useReducer } from 'react'

export const CartContext = createContext()

const initialState = JSON.parse(sessionStorage.getItem("cart")) ? JSON.parse(sessionStorage.getItem("cart")) : []

const reducer = (state, action) => {
    if (action.type === "add") {
        const productDataArray = state
        const index = productDataArray.findIndex((productData) => productData.productName === action.payload.productName)
        if (index < 0) {
            return [...productDataArray, {
                productName: action.payload.productName,
                productPrice: action.payload.productPrice,
                productImage: action.payload.productImage,
                productQuantity: 1,
                totalPrice : action.payload.productPrice
            }]
        } else {
            productDataArray[index] = {
                productName: action.payload.productName,
                productPrice: action.payload.productPrice,
                productImage: action.payload.productImage,
                productQuantity: productDataArray[index].productQuantity,
                totalPrice: productDataArray[index].total
            }
            return [...productDataArray]
        }
    }

    if (action.type === "remove") {
        const productDataArray = state
        const productData = productDataArray.find((productData) => productData.productName === action.payload)
        if (productData) {
            return productDataArray.filter((x) => x.productName !== productData.productName)
        }
    }

    if (action.type === "increment") {
        const productDataArray = state
        const updateCart = productDataArray.map((productData) => {
            if (productData.productName === action.payload) {
                return {...productData, productQuantity: productData.productQuantity + 1, totalPrice: productData.productPrice * (productData.productQuantity + 1)}
            }
            return productData
        })
        return updateCart
    }

    if (action.type === "decrement") {
        const productDataArray = state
        const updateCart = productDataArray.map((productData) => {
            if (productData.productName === action.payload) {
                return {...productData, productQuantity: productData.productQuantity - 1, totalPrice: productData.productPrice * (productData.productQuantity - 1)}
            }
            return productData
        })
        return updateCart
    }

    if (action.type === "clear") {
        state = []
        return state
    }
    
    return state
}

export default function Cart({ children }) {
    const [cartState, cartDispatch] = useReducer(reducer, initialState)

    return (
        <CartContext.Provider value={{ cartState, cartDispatch }}>
            {children}
        </CartContext.Provider>
    )
}
