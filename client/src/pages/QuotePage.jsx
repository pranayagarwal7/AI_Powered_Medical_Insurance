function QuotePage(){
    return(
        <section className="quote-section">
            <h1>Get Your Estimate</h1>
            <p>Provide a few details below to generate your AI-powered
              medical insurance prediction.</p>

              <form>
                <div className="input-div">
                    <label htmlFor="age">Age</label>
                    <input 
                    type="number" 
                    name="age"
                    />
                </div>
                <div className="input-div">
                    <label htmlFor="bmi">BMI</label>
                    <input 
                    type="number" 
                    name="bmi"
                    />
                </div>
                <div>
                   <div>Smoker</div>
                    <input
                    type="radio"
                    id="smoker_yes"
                    name="smoker_yes"
                    value="yes" 
                    />
                    <label htmlFor="smoker_yes">Yes</label>

                    <input 
                    type="radio" 
                    id="smoker_no" 
                    name="smoker_no" 
                    value="no" />
                    <label htmlFor="smoker_no">No</label>
                </div>

                <div className="input-div">
                    <label htmlFor="exercise_level">Exercise Level (hrs/week)</label>
                    <input 
                    type="number" 
                    name="exercise_level" 
                    id="exercise_level"
                    />
                </div>
                <div className="input-div">
                    <label htmlFor="alcohol_consumption">Alcohol Consumption (drinks/week)</label>
                    <input 
                    type="number" 
                    name="alcohol_consumption"
                    id="alcohol_consumption"
                    />
                </div>

                <div className="input-div">
                    <label htmlFor="family_med_history">Family Medical History</label>
                    <input 
                    type="inpput" 
                    name="family_med_history"
                    id="family_med_history"
                    />
                </div>
                <input type="submit" value={"Get My Estimate"}/>
              </form>
        </section>
    )
}

export default QuotePage