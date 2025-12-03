import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
function LoginPage(){
    const [verifyUser, setVerifyUser] = useState({
            email: "",
            password: ""
    
        })
    
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const handleChange = (e) => {
        const {name, value} = e.target

        setVerifyUser({
            ...verifyUser,
            [name]: value
        })
    }

    const handleVerifyUser = (e) => {
        e.preventDefault()

        try {
            const users = JSON.parse(localStorage.getItem("users") || "[]")
            const existingUser = users.find((u) => u.email === verifyUser.email)

            if(existingUser){
                setIsLoggedIn(true)
            } else{
                alert("User does not exist. Please create an account")
                setIsLoggedIn
            }
            
        } catch (error) {
            console.error(error)
            setIsLoggedIn(false)
        }
    }

    useEffect(() => {
        console.log("isLoggedIn: ", isLoggedIn)
    }, [isLoggedIn])
    return(
         <section className="account-form-section">
            <h1>Medical Insurance Login</h1>
            <p>Welcome back. Sign in to continue.</p>
            <form onSubmit={handleVerifyUser}>
                <div className="input-div">
                    <label htmlFor="email">Email</label>
                    <input 
                    type="email" 
                    name="email"
                    id="email"
                    value={verifyUser.email}
                    onChange={handleChange}
                    required
                    />
                </div>
                <div className="input-div">
                    <label htmlFor="password">Password</label>
                    <input 
                    type="password" 
                    name="password"
                    id="password"
                    value={verifyUser.password}
                    onChange={handleChange}
                    required
                    />
                    <input type="submit" value={"Create Account"}/>
                    <p>Don't have an account? <Link to={"/signup"}>Create account</Link></p>
                </div>
            </form>
        </section>
    )
}

export default LoginPage