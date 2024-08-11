import React, { useState } from 'react'
import Router from 'next/router';


import useRequest from '../../hooks/use-request'
const signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const {doRequest,errors}=useRequest({
        url:"/api/users/signup",
        method:"post",
        body:{
            email,
            password,
        },
        onSuccess:()=> {Router.push("/")}
    }) 

    const handleSubmit = async (e) => {
        e.preventDefault()
        doRequest();

    }
  return (
    <div>
        <h1>Sign Up</h1>
        <form onSubmit={(e)=>handleSubmit(e)}>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" className="form-control" id="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password"
                value={password} onChange={(e=>setPassword(e.target.value))}
                 />
            </div>
            {errors}
            <button type="submit" className="btn btn-primary">Sign up</button>

        </form>
            


    </div>
  )
}

export default signup