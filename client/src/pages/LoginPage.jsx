import { Link } from "react-router-dom"
function LoginPage(){
    return(
         <section className="account-form-section">
            <h1>Medical Insurance Login</h1>
            <p>Welcome back. Sign in to continue.</p>
            <form>
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
                    <input type="submit" value={"Create Account"}/>
                    <p>Don't have an account? <Link to={"/signup"}>Create account</Link></p>
                </div>
            </form>
        </section>
    )
}

export default LoginPage