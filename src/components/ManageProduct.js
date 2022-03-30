import React, { useState, useEffect } from 'react'
import { firestore, storage } from '../database/firebase'
import { useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCamera, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
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
import './ManageProduct.css'

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export default function ManageProduct() {
    const [typeDataArray, setTypeDataArray] = useState([])
    const [brandDataArray, setBrandDataArray] = useState([])
    const [productDataArray, setProductDataArray] = useState([])
    const [type, setType] = useState("")
    const [brand, setBrand] = useState("")
    const [productName, setProductName] = useState("")
    const [productBrand, setProductBrand] = useState("")
    const [productType, setProductType] = useState("")
    const [productPrice, setProductPrice] = useState("")
    const [productSpec, setProductSpec] = useState("")
    const [productImage, setProductImage] = useState([])
    const [productImageLink, setProductImageLink] = useState([])
    const [editProductImage, setEditProductImage] = useState([])
    const [message, setMessage] = useState("")
    const [path, setPath] = useState([])
    const [modalAddType, setModalAddType] = useState(false)
    const [modalAddBrand, setModalAddBrand] = useState(false)
    const [modalAddProduct, setModalAddProduct] = useState(false)
    const [modalEditProduct, setModalEditProduct] = useState(false)
    const [modalDelete, setModalDelete] = useState(false)
    const [modalData, setModalData] = useState([])
    const [alert, setAlert] = useState(false)

    const { handleSubmit, register, formState: { errors }, reset } = useForm()
    const { handleSubmit: handleSubmit2, register: register2, formState: { errors: errors2 }, reset: reset2 } = useForm()
    const { handleSubmit: handleSubmit3, register: register3, formState: { errors: errors3 }, reset: reset3 } = useForm()
    const { handleSubmit: handleSubmit4, register: register4, formState: { errors: errors4 }, reset: reset4 } = useForm()

    useEffect(() => {
        let cancel = false

        const typeRef = firestore.collection("types")
        const typeQuery = typeRef.orderBy("type", "asc")
        typeQuery.onSnapshot((snapshot) => {
            if (cancel) return
            let dataArray = []
            snapshot.forEach((doc) => {
                dataArray = [...dataArray, {
                    collection: "types",
                    id: doc.id,
                    type: doc.data().type
                }]
            })
            setTypeDataArray(dataArray)
        })

        const brandRef = firestore.collection("brands")
        const brandQuery = brandRef.orderBy("brand", "asc")
        brandQuery.onSnapshot((snapshot) => {
            if (cancel) return
            let dataArray = []
            snapshot.forEach((doc) => {
                dataArray = [...dataArray, {
                    collection: "brands",
                    id: doc.id,
                    brand: doc.data().brand
                }]
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
                    collection: "products",
                    id: doc.id,
                    productName: doc.data().productName,
                    productType: doc.data().productType,
                    productBrand: doc.data().productBrand,
                    productPrice: doc.data().productPrice,
                    productSpec: doc.data().productSpec,
                    productImage: doc.data().productImage
                }]
            })
            setProductDataArray(dataArray)
        })
        
        return () => {
            cancel = true
        }
    }, [])
    
    const addType = () => {
        const exist = typeDataArray.find((typeData) => typeData.type === type)
        if (!exist) {
            const typeRef = firestore.collection("types")
            typeRef.add({ type: type })
            .then(() => {
                modalAddTypeClose()
                setAlert(true)
            })
            .catch((error) => {
                console.log(error)
            })
        } else {
            setMessage(`มีประเภทสินค้า "${type}" แล้ว`)
        }
    }

    const addBrand = () => {
        const exist = brandDataArray.find((brandData) => brandData.brand === brand)
        if (!exist) {
            const brandRef = firestore.collection("brands")
            brandRef.add({ brand: brand })
            .then(() => {
                modalAddBrandClose()
                setAlert(true)
            })
            .catch((error) => {
                console.log(error)
            })
        } else {
            setMessage(`มีแบรนด์สินค้า "${brand}" แล้ว`)
        }
    }

    const previewFile = (e) => {
        if (e.target.files) {
            const linkDataArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
            setProductImageLink((imageLink) => imageLink.concat(linkDataArray))
            if (!productImage) {
                setProductImage(e.target.files)
            } else {
                setProductImage([...productImage, ...e.target.files])
            }
        }
    }

    const filterFile = (index) => {
        const fileDataArray = Array.from(productImage).filter((file, x) => x !== index)
        setProductImage(fileDataArray)
        setProductImageLink(productImageLink.filter((imageLink, x) => x !== index))
    }

    const uploadFile = () => {
        const exist = productDataArray.find((productData) => productData.productName === productName)
        if (!exist) {
            const imageDataArray = []
            for (let i = 0; i < productImage.length; i++) {
                const fileName = productImage[i].name
                const productRef = storage.child("mainBucket/products")
                const productQuery = productRef.child(`${productName}/${fileName}`)
                productQuery.put(productImage[i])
                .then((result) => {
                    result.ref.getDownloadURL()
                    .then((productImageURL) => {
                        imageDataArray.push(`${productImageURL},mainBucket/products/${productName}/${fileName}`)
                        if (imageDataArray.length === productImage.length) addProduct(imageDataArray)
                    })
                })
            }
        } else {
            setMessage(`มีชื่อสินค้า "${productName}" แล้ว`)
        }
    }

    const addProduct = (imageDataArray) => {
        const productRef = firestore.collection("products")
        productRef.add({
            productName: productName,
            productType: productType,
            productBrand: productBrand,
            productPrice: productPrice,
            productSpec: productSpec,
            productImage: imageDataArray
        })
        .then(() => {
            modalAddProductClose()
            setAlert(true)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const previewFileForEdit = (e) => {
        if (e.target.files) {
            const linkDataArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
            setProductImageLink((imageLink) => imageLink.concat(linkDataArray))
            if (!editProductImage) {
                setEditProductImage(e.target.files)
            } else {
                setEditProductImage([...editProductImage, ...e.target.files])
            }
        }
    }

    const filterFileForEdit = (index) => {
        const fileDataArray = Array.from(productImage).filter((file, x) => x !== index)
        setProductImage(fileDataArray)
        setProductImageLink(productImageLink.filter((imageLink, x) => x !== index))
        setPath([...path, productImageLink.filter((imageLink, x) => x === index)])
    }

    const uploadFileForEdit = () => {
        if (editProductImage.length !== 0) {
            const imageDataArray = []
            for (let i = 0; i < editProductImage.length; i++) {
                const fileName = editProductImage[i].name
                const productRef = storage.child("mainBucket/products")
                const productQuery = productRef.child(`${productName}/${fileName}`)
                productQuery.put(editProductImage[i])
                .then((result) => {
                    result.ref.getDownloadURL()
                    .then((productImageURL) => {
                        imageDataArray.push(`${productImageURL},mainBucket/products/${productName}/${fileName}`)
                        if (imageDataArray.length === editProductImage.length) editProduct([...productImage, ...imageDataArray])
                    })
                })
            }
        } else {
            editProduct(productImage)
        }
        if (path.length !== 0) deleteProductImage()
    }

    const editProduct = (imageDataArray) => {
        const productRrf = firestore.collection("products")
        const productQuery = productRrf.doc(modalData)
        productQuery.update({
            productType: productType,
            productBrand: productBrand,
            productPrice: productPrice,
            productSpec: productSpec,
            productImage: imageDataArray
        })
        .then(() => {
            modalEditProductClose()
            setAlert(true)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const deleteProductImage = () => {
        for (let i = 0; i < path.length; i++) {
            storage.child(path[i].toString().substring(path[i].toString().indexOf(",") + 1, path[i].toString().length)).delete()
        }
    }

    const deleteDocument = (data) => {
        const documentRef = firestore.collection(data.collection).doc(data.id)
        documentRef.delete()
        .then(() => {
            modalDeleteClose()
            setAlert(true)
        })
        .catch((error) => {
            console.log(error)
        })
        if (data.collection === "products") deleteAllProductImage(data.productName)
    }

    const deleteAllProductImage = (productName) => {
        const productRef = storage.child("mainBucket/products")
        const productQuery = productRef.child(productName)
        productQuery.listAll()
        .then((result) => {
            result.items.forEach((file) => {
                file.delete()
            })
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const modalAddTypeOpen = () => {
        setModalAddType(true)
    }

    const modalAddTypeClose = () => {
        setModalAddType(false)
        setType("")
        setMessage("")
        reset()
    }

    const modalAddBrandOpen = () => {
        setModalAddBrand(true)
    }

    const modalAddBrandClose = () => {
        setModalAddBrand(false)
        setBrand("")
        setMessage("")
        reset2()
    }

    const modalAddProductOpen = () => {
        setModalAddProduct(true)
    }

    const modalAddProductClose = () => {
        setModalAddProduct(false)
        setProductName("")
        setProductType("")
        setProductBrand("")
        setProductPrice("")
        setProductSpec("")
        setProductImage([])
        setProductImageLink([])
        setMessage("")
        reset3()
    }

    const modalEditProductOpen = (productData) => {
        setModalEditProduct(true)
        setModalData(productData.id)
        setProductName(productData.productName)
        setProductType(productData.productType)
        setProductBrand(productData.productBrand)
        setProductPrice(productData.productPrice)
        setProductSpec(productData.productSpec)
        setProductImage(productData.productImage)
        setProductImageLink(productData.productImage)
    }

    const modalEditProductClose = () => {
        setModalEditProduct(false)
        setModalData([])
        setProductName("")
        setProductType("")
        setProductBrand("")
        setProductPrice("")
        setProductSpec("")
        setProductImage([])
        setProductImageLink([])
        setEditProductImage("")
        setMessage("")
        setPath("")
        reset4()
    }

    const modalDeleteOpen = (data) => {
        setModalDelete(true) 
        setModalData(data)  
    }

    const modalDeleteClose = () => {
        setModalDelete(false)
        setModalData([])
    }

    const alertClose = (event, reason) => {
        if (reason === 'clickaway') return
        setAlert(false)
    }

    return (
        <div className="ManageProduct">
            <div className="manage-product-content">
                <div className="manage-product__add">
                    <button className="button--blue" type="button" onClick={modalAddTypeOpen}><FontAwesomeIcon icon={faPlus} /> Type</button>
                    <button className="button--blue" type="button" onClick={modalAddBrandOpen}><FontAwesomeIcon icon={faPlus} /> Brand</button>
                    <button className="button--blue" type="button" onClick={modalAddProductOpen}><FontAwesomeIcon icon={faPlus} /> Product</button>
                </div>
                <div className="manage-product__type">
                    <h2>Types</h2>
                    {typeDataArray.map((typeData, index) => (
                        <div className="type__list" key={index}>
                            <p>{typeData.type}</p>
                            <button className="button--red" type="button" onClick={() => modalDeleteOpen(typeData)}>Delete</button>
                        </div>
                    ))}
                </div>
                <div className="manage-product__brand">
                    <h2>Brands</h2>
                    {brandDataArray.map((brandData, index) => (
                        <div className="brand__list" key={index}>
                            <p>{brandData.brand}</p>
                            <button className="button--red" type="button" onClick={() => modalDeleteOpen(brandData)}>Delete</button>
                        </div>
                    ))}
                </div>
                <div className="manage-product__product">
                    <h2>Products</h2>
                    {productDataArray.map((productData, index) => (
                        <div className="product__list" key={index}>
                            <div className="product-list__image">
                                <img src={productData.productImage[0]} alt="" />
                            </div>
                            <div className="product-list__text">
                                <h3>{productData.productName}</h3>
                                <p><span>Type : </span>{productData.productType}</p>
                                <p><span>Brand : </span>{productData.productBrand}</p>
                                <p><span>Price : </span>{productData.productPrice}</p>
                                <p><span>Spec : </span>{productData.productSpec}</p>
                                <button className="button--blue" type="button" onClick={() => modalEditProductOpen(productData)}>Edit</button>
                                <button className="button--red" type="button" onClick={() => modalDeleteOpen(productData)}>Delete</button>
                            </div>
                        </div>
                    ))}
                    <div className="product__table">
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 337.5 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Image</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Brand</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Spec</TableCell>
                                        <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {productDataArray.map((productData, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row" align="center">
                                                <div className="product-table__image">
                                                    <img src={productData.productImage[0]} alt="" />
                                                </div>
                                            </TableCell>
                                            <TableCell>{productData.productName}</TableCell>
                                            <TableCell>{productData.productType}</TableCell>
                                            <TableCell>{productData.productBrand}</TableCell>
                                            <TableCell>{productData.productPrice}</TableCell>
                                            <TableCell>{productData.productSpec}</TableCell>
                                            <TableCell align="center">
                                                <button className="button--blue" type="button" onClick={() => modalEditProductOpen(productData)}>Edit</button>
                                                <button className="button--red" type="button" onClick={() => modalDeleteOpen(productData)}>Delete</button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
            <Modal
                open={modalAddType}
                onClose={modalAddTypeClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="modal-box">
                    <div className="modal__add">
                        <form onSubmit={handleSubmit(addType)}>
                            <h2>Add type</h2>
                            <input type="text" placeholder="Enter type" name="type"
                                {...register("type", {
                                    required: "กรุณากรอกข้อมูล",
                                    minLength: { value: 2, message: "ความยาวระหว่าง 2 ถึง 20 ตัวอักษร" },
                                    maxLength: { value: 20, message: "ความยาวระหว่าง 2 ถึง 20 ตัวอักษร" },
                                    onChange: (e) => setType(e.target.value)
                                })}
                                value={type}
                            />
                            <p>{message}</p>
                            <p>{errors.type && errors.type.message}</p>
                            <div className="modal__action">
                                <button className="button--blue" type="submit">Add</button>
                                <button className="button--red" type="button" onClick={modalAddTypeClose}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
            <Modal
                open={modalAddBrand}
                onClose={modalAddBrandClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="modal-box">
                    <div className="modal__add">
                        <form onSubmit={handleSubmit2(addBrand)}>
                            <h2>Add brand</h2>
                            <input type="text" placeholder="Enter brand" name="brand"
                                {...register2("brand", {
                                    required: "กรุณากรอกข้อมูล",
                                    minLength: { value: 2, message: "ความยาวระหว่าง 2 ถึง 20 ตัวอักษร" },
                                    maxLength: { value: 20, message: "ความยาวระหว่าง 2 ถึง 20 ตัวอักษร" },
                                    onChange: (e) => setBrand(e.target.value)
                                })}
                                value={brand}
                            />
                            <p>{message}</p>
                            <p>{errors2.brand && errors2.brand.message}</p>
                            <div className="modal__action">
                                <button className="button--blue" type="submit">Add</button>
                                <button className="button--red" type="button" onClick={modalAddBrandClose}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
            <Modal
                open={modalAddProduct}
                onClose={modalAddProductClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="modal-box">
                    <div className="modal__add">
                        <form onSubmit={handleSubmit3(uploadFile)}>
                            <h2>Add product</h2>
                            <input type="text" placeholder="Enter name" name="productName"
                                {...register3("productName", {
                                    required: "กรุณากรอกข้อมูล",
                                    minLength: { value: 2, message: "ความยาวระหว่าง 2 ถึง 20 ตัวอักษร" },
                                    maxLength: { value: 20, message: "ความยาวระหว่าง 2 ถึง 20 ตัวอักษร" },
                                    onChange: (e) => setProductName(e.target.value)
                                })}
                                value={productName}
                            />
                            <p>{message}</p>
                            <p>{errors3.productName && errors3.productName.message}</p>
                            <select name="productType"
                                {...register3("productType", {
                                    required: "กรุณาเลือกข้อมูล",
                                    onChange: (e) => setProductType(e.target.value)
                                })}
                                value={productType}
                            >
                                <option value="">―Select type―</option>
                                {typeDataArray.map((typeData, index) => (
                                    <option key={index}>{typeData.type}</option>
                                ))}
                            </select>
                            <p>{errors3.productType && errors3.productType.message}</p>
                            <select name="productBrand"
                                {...register3("productBrand", {
                                    required: "กรุณาเลือกข้อมูล",
                                    onChange: (e) => setProductBrand(e.target.value)
                                })}
                                value={productBrand}
                            >
                                <option value="">―Select brand―</option>
                                {brandDataArray.map((brandData, index) => (
                                    <option key={index}>{brandData.brand}</option>
                                ))}
                            </select>
                            <p>{errors3.productBrand && errors3.productBrand.message}</p>
                            <input type="number" placeholder="Enter price" name="productPrice"
                                {...register3("productPrice", {
                                    required: "กรุณากรอกข้อมูล",
                                    minLength: { value: 2, message: "ความยาวระหว่าง 2 ถึง 20 ตัวอักษร" },
                                    maxLength: { value: 20, message: "ความยาวระหว่าง 2 ถึง 20 ตัวอักษร" },
                                    onChange: (e) => setProductPrice(e.target.value)
                                })}
                                value={productPrice}
                            />
                            <p>{errors3.productPrice && errors3.productPrice.message}</p>
                            <textarea type="text" cols="30" rows="10" placeholder="Enter spec" name="productSpec"
                                {...register3("productSpec", {
                                    required: "กรุณากรอกข้อมูล",
                                    minLength: { value: 2, message: "ความยาวระหว่าง 2 ถึง 20 ตัวอักษร" },
                                    maxLength: { value: 20, message: "ความยาวระหว่าง 2 ถึง 20 ตัวอักษร" },
                                    onChange: (e) => setProductSpec(e.target.value)
                                })}
                                value={productSpec}
                            >
                            </textarea>
                            <p>{errors3.productSpec && errors3.productSpec.message}</p>
                            <label htmlFor="productImage"><FontAwesomeIcon icon={faCamera} /> Image</label>
                            <input type="file" id="productImage" name="productImage"
                                {...register3("productImage", {
                                    required: "กรุณาเลือกรูปภาพ",
                                    onChange: previewFile
                                })}
                                multiple
                                onClick={(e) => (e.target.value = null)}
                                style={{ display: "none" }}
                            />
                            <p>{errors3.productImage && errors3.productImage.message}</p>
                            <div className="modal-image">
                                {productImageLink.map((imageLink, index) => (
                                    <div className="modal-image__link" key={index}>
                                        <img src={imageLink} alt="" />
                                        <FontAwesomeIcon icon={faTimesCircle} size="lg" onClick={() => filterFile(index)} />
                                    </div>
                                ))}
                            </div>
                            <div className="modal__action">
                                <button className="button--blue" type="submit">Add</button>
                                <button className="button--red" type="button" onClick={modalAddProductClose}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
            <Modal
                open={modalEditProduct}
                onClose={modalEditProductClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="modal-box">
                    <div className="modal__add">
                        <form onSubmit={handleSubmit4(uploadFileForEdit)}>
                            <h2>Edit "{productName}"</h2>
                            <select name="editProductType"
                                {...register4("editProductType", {
                                    required: "กรุณาเลือกข้อมูล",
                                    onChange: (e) => setProductType(e.target.value)
                                })}
                                value={productType}
                            >
                                <option value="">―Select type―</option>
                                {typeDataArray.map((typeData, index) => (
                                    <option key={index}>{typeData.type}</option>
                                ))}
                            </select>
                            <p>{errors4.editProductType && errors4.editProductType.message}</p>
                            <select name="editProductBrand"
                                {...register4("editProductBrand", {
                                    required: "กรุณาเลือกข้อมูล",
                                    onChange: (e) => setProductBrand(e.target.value)
                                })}
                                value={productBrand}
                            >
                                <option value="">―Select brand―</option>
                                {brandDataArray.map((brandData, index) => (
                                    <option key={index}>{brandData.brand}</option>
                                ))}
                            </select>
                            <p>{errors4.editProductBrand && errors4.editProductBrand.message}</p>
                            <input type="number" placeholder="Enter price" name="editProductPrice"
                                {...register4("editProductPrice", {
                                    required: "กรุณากรอกข้อมูล",
                                    minLength: { value: 2, message: "ความยาวระหว่าง 2 ถึง 20 ตัวอักษร" },
                                    maxLength: { value: 20, message: "ความยาวระหว่าง 2 ถึง 20 ตัวอักษร" },
                                    onChange: (e) => setProductPrice(e.target.value)
                                })}
                                value={productPrice}
                            />
                            <p>{errors4.editProductPrice && errors4.editProductPrice.message}</p>
                            <textarea type="text" cols="30" rows="10" placeholder="Enter spec" name="editProductSpec"
                                {...register4("editProductSpec", {
                                    required: "กรุณากรอกข้อมูล",
                                    minLength: { value: 2, message: "ความยาวระหว่าง 2 ถึง 20 ตัวอักษร" },
                                    maxLength: { value: 20, message: "ความยาวระหว่าง 2 ถึง 20 ตัวอักษร" },
                                    onChange: (e) => setProductSpec(e.target.value)
                                })}
                                value={productSpec}
                            >
                            </textarea>
                            <p>{errors4.editProductSpec && errors4.editProductSpec.message}</p>
                            <label htmlFor="editProductImage"><FontAwesomeIcon icon={faCamera} /> Image</label>
                            <input type="file" id="editProductImage"
                                onChange={previewFileForEdit}
                                multiple
                                onClick={(e) => (e.target.value = null)}
                                style={{ display: "none" }}
                            />
                            <div className="modal-image">
                                {productImageLink.map((imageLink, index) => (
                                    <div className="modal-image__link" key={index}>
                                        <img src={imageLink} alt="" />
                                        <FontAwesomeIcon icon={faTimesCircle} size="lg" onClick={() => filterFileForEdit(index)} />
                                    </div>
                                ))}
                            </div>
                            <div className="modal__action">
                                <button className="button--blue" type="submit">Edit</button>
                                <button className="button--red" type="button" onClick={modalEditProductClose}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
            <Modal
                open={modalDelete}
                onClose={modalDeleteClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="modal-box">
                    <div className="modal__delete">
                        <h2>Delete "{modalData.type || modalData.brand || modalData.productName}"</h2>
                        <div className="modal__action">
                            <button className="button--red" type="button" onClick={() => deleteDocument(modalData)}>Delete</button>
                            <button className="button--blue" type="button" onClick={modalDeleteClose}>Cancel</button>
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
