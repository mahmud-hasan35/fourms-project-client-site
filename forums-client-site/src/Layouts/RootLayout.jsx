import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../Pages/Share/Navbar/Navbar'

export default function RootLayout() {
  return (
    <>
    <Navbar></Navbar>
    <Outlet></Outlet>
    </>
  )
}
