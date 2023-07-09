import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

async function logout(userToken) {
  return await fetch('http://192.168.1.2:8000/api/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken,
    },
    body:{'withCredentials': true},
  }).then(data => data.json(), () =>{
  })
}

export default function Logout() {
  const navigate = useNavigate()
  const tokenString = sessionStorage.getItem('token')
  const userToken = JSON.parse(tokenString)

  const handleLogout = (userToken) => {
    logout(userToken)
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
  }

  useEffect(() => {
    navigate('/login')
  }, [])

  return handleLogout(userToken)
}
