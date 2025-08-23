import React from 'react'
import { Outlet } from 'react-router'
import Footer from '../components/home/Footer'
import Navbar from '../components/home/Naver'

export default function RootLayout() {
  return (
    <>
    <Navbar></Navbar>
    <Outlet></Outlet>
    <Footer></Footer>
    </>
  )
}
