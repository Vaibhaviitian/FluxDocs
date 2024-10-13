import React from 'react'
import Navbar from './Elements/Navbar.jsx'
import Footer from './Elements/Footer.jsx'
import {Outlet} from 'react-router-dom'

function Layout() {
  return (
    <>
    <Navbar/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default Layout
