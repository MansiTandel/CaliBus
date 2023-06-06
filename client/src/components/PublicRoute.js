import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function PublicRoute({children}) {
    const navigate = useNavigate();
    // check if any user present in the local storage or not, yes->homepage
    useEffect(()=>{      
        if(localStorage.getItem('token')){
            navigate('/')
        }
    },[])
  return (
    <div>
      {children}
    </div>
  )
}

export default PublicRoute
