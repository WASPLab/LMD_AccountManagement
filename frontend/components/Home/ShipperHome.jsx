import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const token = Cookies.get('token')
const type = Cookies.get("type")
const backend_url = "http://localhost:8000"


const ShipperHome = () => {
  const [user, setUser] = useState({})
  
  useEffect(async () => {
    if (token) {
      try {
        const data = await axios.get(`${backend_url}/task/getUser`, {
          params: {type},
          headers: { 'Authorization': `Bearer ${token}`}
        })
        setUser(data.data)
      } catch (error) {
        console.log(error)
      }
    }
  }, [])


  return (
    <div>Welcome, {`${user.first_name} ${user.last_name}`} </div>
  )
}

export default ShipperHome