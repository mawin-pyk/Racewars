import React, { useEffect, useState, useRef, useContext } from 'react'
import { AuthContext } from './Auth'
import { CartContext } from './Cart'
import { Link, useNavigate } from 'react-router-dom'
import { firestore } from '../database/firebase'
import promotion from '../images/promotion.png'
import './Product.css'

export default function Product() {
    const [typeDataArray, setTypeDataArray] = useState([])
    const [brandDataArray, setBrandDataArray] = useState([])
    const [productDataArray, setProductDataArray] = useState([])
    const [allProductDataArray, setAllProductDataArray] = useState([])
    const [activeFilter, setActiveFilter] = useState("All")
    const [activeButton, setActiveButton] = useState(1)
    // eslint-disable-next-line
    const [itemPerPage, setItemPerPage] = useState(9)
    const [currentPage, setCurrentPage] = useState(1)

    const end = currentPage * itemPerPage
    const start = end - itemPerPage
    const currentProduct = productDataArray.slice(start, end)
    const countPage = Math.ceil(productDataArray.length / itemPerPage)
    const user = useContext(AuthContext)
    const { cartDispatch } = useContext(CartContext)
    const divRef = useRef()
    const navigate = useNavigate()

    useEffect(() => {
        let cancel = false

        const typeRef = firestore.collection("types")
        const typeQuery = typeRef.orderBy("type", "asc")
        typeQuery.onSnapshot((snapshot) => {
            if (cancel) return
            let dataArray = []
            snapshot.forEach((doc) => {
                dataArray = [...dataArray, doc.data()]
            })
            setTypeDataArray(dataArray)
        })

        const brandRef = firestore.collection("brands")
        const brandQuery = brandRef.orderBy("brand", "asc")
        brandQuery.onSnapshot((snapshot) => {
            if (cancel) return
            let dataArray = []
            snapshot.forEach((doc) => {
                dataArray = [...dataArray, doc.data()]
            })
            setBrandDataArray(dataArray)
        })

        const productRef = firestore.collection("products")
        const productQuery = productRef.orderBy("productName", "asc")
        productQuery.onSnapshot((snapshot) => {
            if (cancel) return
            let dataArray = []
            snapshot.forEach((doc) => {
                dataArray = [...dataArray, {
                    productName: doc.data().productName,
                    productType: doc.data().productType,
                    productBrand: doc.data().productBrand,
                    productPrice: doc.data().productPrice,
                    productSpec: doc.data().productSpec,
                    productImage: doc.data().productImage
                }]
            })
            setProductDataArray(dataArray)
            setAllProductDataArray(dataArray)
        })
        
        return () => {
            cancel = true
        }
    }, [])

    const allFilter = () => {
        setProductDataArray(allProductDataArray)
        setCurrentPage(1)
        setActiveButton(1)
    }

    const typeFilter = (typeData) => {
        const type = allProductDataArray.filter((productData) => productData.productType === typeData)
        setProductDataArray(type)
        setCurrentPage(1)
        setActiveButton(1)
    }

    const brandFilter = (brandData) => {
        const brand = allProductDataArray.filter((productData) => productData.productBrand === brandData)
        setProductDataArray(brand)
        setCurrentPage(1)
        setActiveButton(1)
    }

    const activeClassFilter = (data) => {
        setActiveFilter(data)
    }

    const activeClassButton = (page) => {
        setActiveButton(page)
    }

    const pageAction = () => {
        const button = []
        for (let i = 0; i < countPage; i++) {
            button.push(
                <button className={activeButton === i + 1 ? "activeButton" : ""} key={i}
                    onClick={() => {
                        setCurrentPage(i + 1)
                        activeClassButton(i + 1)
                        scrollToRef()
                    }}
                >{i + 1}</button>
            )
        }
        return button
    }

    const scrollToRef = () => {
        if (window.innerWidth < 768) divRef.current.scrollIntoView({ behavior: "smooth" })
    }

    const addToCart = (productData) => {
        cartDispatch({ type: "add", payload: productData })
    }

    return (
        <div className="Product">
            <div className="product-content">
                <div className="product-filter">
                    <div className="type__filter">
                        <h2>Types</h2>
                        <p className={activeFilter === "All" ? "activeFilter" : ""}
                            onClick={() => {
                                allFilter()
                                activeClassFilter("All")
                                scrollToRef()
                            }}
                        >All</p>
                        {typeDataArray.map((typeData, index) => (
                            <p className={activeFilter === typeData.type ? "activeFilter" : ""} key={index}
                                onClick={() => {
                                    typeFilter(typeData.type)
                                    activeClassFilter(typeData.type)
                                    scrollToRef()
                                }}
                            >{typeData.type}</p>
                        ))}
                    </div>
                    <div className="brand__filter">
                        <h2>Brands</h2>
                        {brandDataArray.map((brandData, index) => (
                            <p className={activeFilter === brandData.brand ? "activeFilter" : ""} key={index}
                                onClick={() => {
                                    brandFilter(brandData.brand)
                                    activeClassFilter(brandData.brand)
                                    scrollToRef()
                                }}
                            >{brandData.brand}</p>
                        ))}
                    </div>
                    <div className="promotion__area">
                        <img src={promotion} alt="" />
                    </div>
                </div>
                <div className="product__item" ref={divRef}>
                    <h2>Items</h2>
                    <div className="item-area">
                        {currentProduct.map((productData, index) => (
                            <div className="item__list" key={index}>
                                <div className="item-list__image">
                                    <Link to={`/detail/${productData.productName}`}><img src={productData.productImage[0]} alt="" /></Link>
                                </div>
                                <h3>{productData.productPrice} Baht</h3>
                                <p>{productData.productName}</p>
                                <button className="button--blue" type="button" onClick={() => user ? addToCart(productData) : navigate("/signin")}>Add to cart</button>
                            </div>
                        ))}            
                    </div>
                    <div className="page__action">
                        {pageAction()}
                    </div>
                </div>
            </div>
        </div>
    )
}
