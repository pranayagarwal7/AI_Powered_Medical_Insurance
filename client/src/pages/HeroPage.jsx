function LandingPage(){
    return(
        <section className="hero-section">
            <article className="hero-container">
                <div className="hero-text">
                    <div className="inner-hero-div">
                         <h1>Your Coverage. Clear. Fair. Transparent.</h1>
                        <h2>See the data behind your premiums and claims</h2>
                        <p>We combine advanced analytics and clear visuals to give policyholders a full breakdown of risk scores, claim factors, and pricing so you’re not in the dark about your insurance.</p>
                        <button class="primary-hero-btn">Get Your Transparency Report</button>
                        <button class="secondary-hero-btn">See the Technology</button>
                    </div>
                </div>
                <div className="hero-text">
                    <img src="./src/images/hero_img.jpg" alt="ai image" className="hero-img" />
                </div>
            </article>
        </section>
    )
}

export default LandingPage