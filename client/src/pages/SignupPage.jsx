import { Link } from "react-router-dom"
function SignupPage(){
    return(
        <section className="account-form-section">
            <h1>Create Your Account</h1>
                <p>Join MedInsure AI and start generating transparent insurance insights</p>
            <form>
                <div className="input-div">
                    <label htmlFor="firstName">First Name</label>
                    <input 
                    type="text" 
                    name="firstName"
                    />
                </div>
                
                <div className="input-div">
                    <label htmlFor="lastName">Last Name</label>
                    <input 
                    type="text"
                    name="LastName"
                    />
                </div>
                <div className="input-div">
                    <label htmlFor="email">Email</label>
                    <input 
                    type="email" 
                    name="email"
                    />
                </div>
                <div className="input-div">
                    <label htmlFor="password">Password</label>
                    <input 
                    type="password" 
                    name="password"
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