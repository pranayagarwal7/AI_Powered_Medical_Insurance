function MedPage(){
    return(
        <>
            <h1>Med Page</h1>
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