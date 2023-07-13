import React, { useEffect } from "react"
import {  useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

async function logout(userToken) {
  var data =  await fetch('http://localhost:8000/api/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken,
    },
    body:{'withCredentials': true},
  }).then(data => data.json())
  Swal.fire({
    icon: "success",
    text: data.message,
    timer: 3000,
  })
}

export default function Logout() {
  const navigate = useNavigate()
  const tokenString = localStorage.getItem('token')
  const userToken = JSON.parse(tokenString)
  localStorage.clear()

  const handleLogout = (userToken) => {
    logout(userToken)
  }

  useEffect(() => {
    return navigate('/login')
  }, [])

  return (
  
    handleLogout(userToken)

  )
}
