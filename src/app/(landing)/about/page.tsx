"use client"
import React from 'react'
import { toast } from 'react-toastify'

const Login = () => {
  return (
    <div >
      <div onClick={()=>toast.error("hello")}>clik me</div>
    </div>
  )
}

export default Login