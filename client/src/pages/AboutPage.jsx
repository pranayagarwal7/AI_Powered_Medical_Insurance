import { Link } from "react-router-dom"
import { useState } from "react"

function AboutPage(){
    const [index, setIndex] = useState(0)
    const slides = [
    {
        title: "Explainable AI",
        subtitle: "Transparent, understandable decisions",
        points: [
            "Shows which factors influence risk and premiums",
            "Supports regulatory compliance and ethical standards",
            "Helps detect errors and mitigate bias"
        ]
    },
    {
        title: "Predictive Modelling",
        subtitle: "Using historical data to forecast outcomes",
        points: [
            "Assess claim risk and guides premium settting",
            "Flags potential fraud for further review",
            "Helps forecast claim volume and resource needs"
        ]
    },
    {
        title: "Generative AI Summaries",
        subtitle: "Plain-language explanations",
        points: [
            "Turns model outputs into clear written summaries",
            "Makes complex statistics easier to understand",
            'Supports faster, more confident decision-making'
        ]
    }
]

 const goTo = (n) => {
    if(n < 0) n = slides.length -1
    if (n >= slides.length) n = 0
    setIndex(n)
}

const next = () => goTo(index + 1)
const prev = () => goTo(index - 1)
    return(
        <section className="slideshow-container">
            <h1>Transparent AI, Explained</h1>
            <p className="subtitle">Learn how our Explainable AI, predictive modeling, and generative summaries work together to provide clear insurance insights.</p>
      {slides.map((slide, i) => (
        <div
          key={slide.title}
          className={`mySlide fade ${i === index ? "active-slide" : ""}`}
        >
          <div className="numbertext">
            {/* {i + 1} / {slides.length} */}
            OUR APPROACH
          </div>

          <div className="slide-content">
            <h2>{slide.title}</h2>
            <p className="slide-subtitle">{slide.subtitle}</p>
            <ul>
              {slide.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {/* Prev / Next */}
      <button className="prev" onClick={prev}>
        &#10094;
      </button>
      <button className="next" onClick={next}>
        &#10095;
      </button>

      {/* Dots */}
      <div className="dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
      <Link to={"/signup"}>
        <button className="slideshow-cta-btn">Get Started</button>
      </Link>
      {/* <Link to={"/signup"} className="slideshow-cta-btn">Get Started</Link> */}
    </section>
    )
}
  

export default AboutPage 