import { Link } from 'react-router-dom'
function MedPage(){

    return(
        <>
            {/* <h1>Med Page</h1> */}
            <Link to={"/fap"}>
                <button>View Premium Forecasting</button>
            </Link>
          
           <iframe
                src="http://localhost:8501"
                style={{
                width: "100%",
                height: "900px",
                border: "none"
                }}
            />
        </>
    )
}

export default MedPage