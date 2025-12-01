import { useState } from "react"
function ResultsPage(){
    const [predResults, setPredResults] = useState({
        predictedAnnualPremium: 0,
        riskScore: 0
    })
    const [xAI, setXAi] = useState(null)

  
    return(
        <section className="results-section">
            <h1>Your AI Generated Estimate</h1>
            {/* <p className="results-subtext">Based on your submitted information, here are your 
   predicted medical insurance insights.</p> */}
            <div className="results-container">
                premium score: 1000
            </div>

            <div className="pred-btn-container">
                <button className="pred-ai-btn">Prediction Results</button>
                <button className="pred-xai-btn">AI Explanation</button>
            </div>
  
        </section>
        
    )
}

export default ResultsPage