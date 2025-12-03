import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
function SignupPage(){
    const [newUser, setNewUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""

    })
    const [isLoggedIn, setLoggedIn] = useState(false)
    const handleChange = (e) =>{
        const { name, value } = e.target
        setNewUser({
            ...newUser,
            [name]: value

        }) 
    }
    const handleCreateNewUser = (e) => {
        e.preventDefault()

        try {
            const users = JSON.parse(localStorage.getItem("users") || "[]")
           const existingUser = users.find((u) => u.email === newUser.email);

            if(existingUser){
                alert("User already exists")
                setLoggedIn(false)
            return
        }

        users.push(newUser)
        localStorage.setItem("users", JSON.stringify(users))

        setLoggedIn(true)
        
        } catch (error) {
            console.error(error)
            setLoggedIn(false)
        }
    }

    useEffect(() => {
        console.log("isLoggedIn: ", isLoggedIn)
    }, [isLoggedIn])
    

    return(
        <section className="account-form-section">
            <h1>Create Your Account</h1>
                <p>Join MedInsure AI and start generating transparent insurance insights</p>
            <form onSubmit={handleCreateNewUser}>
                <div className="input-div">
                    <label htmlFor="firstName">First Name</label>
                    <input 
                    type="text" 
                    name="firstName"
                    id="firstName"
                    value={newUser.firstName}
                    onChange={handleChange}
                    required
                    />
                </div>
                
                <div className="input-div">
                    <label htmlFor="lastName">Last Name</label>
                    <input 
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={newUser.lastName}
                    onChange={handleChange}
                    required
                    />
                </div>
                <div className="input-div">
                    <label htmlFor="email">Email</label>
                    <input 
                    type="email" 
                    name="email"
                    id="email"
                    value={newUser.email}
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
                    value={newUser.password}
                    onChange={handleChange}
                    required
                    />
                </div>
                <div className="input-div">
                 <input type="submit" value={"Create Account"}/>
                    <p>Already have an account? <Link to={"/login"}>Login</Link></p>
                </div>
            </form>
        </section>
    )
}

export default SignupPage