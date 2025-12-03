import { Link } from "react-router-dom"
function FapPage(){
    return(
        <>
              <Link to={"/med"}>
                <button>View Premium Calculator</button>
            </Link>
               <iframe
                    src="http://localhost:8502"
                    style={{
                    width: "100%",
                    height: "900px",
                    border: "none"
                    }}
                />
        </>
    )
}

export default FapPage