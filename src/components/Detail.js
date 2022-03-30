import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from './Auth'
import { CartContext } from './Cart'
import { useParams, useNavigate } from 'react-router-dom'
import { firestore } from '../database/firebase'
import Product from './Product'
import './Detail.css'

export default function Detail() {
    const [productData, setProductData] = useState("")
    const [mainImage, setMainImage] = useState("")

    const user = useContext(AuthContext)
    const { cartDispatch } = useContext(CartContext)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        let cancel = false
        
        const productRef = firestore.collection("products")
        const productWhere = productRef.where("productName", "==", params.productName)
        productWhere.onSnapshot((snapshot) => {
            if (cancel) return
            snapshot.forEach((doc) => {
                setProductData(doc.data())
                setMainImage(doc.data().productImage[0])
            })
        })

        return () => {
            cancel = true
        }
    }, [params])

    const addToCart = (productData) => {
        cartDispatch({ type: "add", payload: productData })
    }

    return (
        <div className="Detail">
            <div className="detail-content">
                <div className="detail-product">
                    <div className="detail-image">
                        <div className="sub__image">
                            {productData && productData.productImage.map((image, index) => (
                                <li key={index} onClick={() => setMainImage(image)}><img src={image} alt="" /></li>
                            ))}
                        </div>
                        <div className="main__image">
                            <img src={mainImage} alt="" />
                        </div>
                    </div>
                    <div className="detail__text">
                        <h2>{productData.productName}</h2>
                        <p><span>Type : </span>{productData.productType}</p>
                        <p><span>Brand : </span>{productData.productBrand}</p>
                        <p><span>Spec : </span>{productData.productSpec}</p>
                        <h3>{productData.productPrice} Baht</h3>
                        <button className="button--blue" type="button" onClick={() => user ? addToCart(productData) : navigate("/signin")}>Add to cart</button>
                    </div>
                </div>
                <Product />
            </div>
        </div>
    )
}
