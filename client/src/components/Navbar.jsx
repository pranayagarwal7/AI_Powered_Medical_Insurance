import { Link } from "react-router-dom"
function Navbar(){
    return(
        <header>
            <nav>
                <span>
                    <p>Medical Insurance</p>
                </span>
                <span className="nav-links">
                    <Link to={"/"}>Home</Link>
                    <Link to={"/about"}>About</Link>
                    <Link to={"/login"}>Login</Link>
                    <Link to={"/signup"}>Create Account</Link>
                </span>
            </nav>
        </header>
    )
}
export default Navbar