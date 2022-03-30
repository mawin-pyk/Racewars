import Auth from './components/Auth'
import Cart from './components/Cart'
import ScrollToTop from './components/ScrollToTop'
import Header from './components/Header'
import Home from './components/Home'
import Product from './components/Product'
import CartPage from './components/CartPage'
import Detail from './components/Detail'
import Account from './components/Account'
import Profile from './components/Profile'
import Order from './components/Order'
import Admin from './components/Admin'
import ManageProduct from './components/ManageProduct'
import ManageOrder from './components/ManageOrder'
import Contact from './components/Contact'
import SignIn from './components/SignIn'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Auth>
                    <Cart>
                        <ScrollToTop />
                        <Header />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="product" element={<Product />} />
                            <Route path="cart" element={<CartPage />} />
                            <Route path="detail/:productName" element={<Detail />} />
                            <Route path="account" element={<PrivateRoute><Account /></PrivateRoute>}>
                                <Route path="profile" element={<Profile />} />
                                <Route path="order" element={<Order />} />
                            </Route>
                            <Route path="admin" element={<PrivateRoute><Admin /></PrivateRoute>}>
                                <Route path="manageproduct" element={<ManageProduct />} />
                                <Route path="manageorder" element={<ManageOrder />} />
                            </Route>
                            <Route path="contact" element={<Contact />} />
                            <Route path="signin" element={<SignIn />} />
                            <Route path="*" element={<Home />} />
                        </Routes>
                        <Footer />
                    </Cart>
                </Auth>
            </BrowserRouter>
        </div>
    )
}

export default App
