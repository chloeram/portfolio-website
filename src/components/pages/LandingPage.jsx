import React from "react";
import "../../styles/LandingPage.css";
import LilyPondScene from "../scenes/LilyPondScene";

const LandingPage = () => {
    return (
        <div className="landing-container">

            <LilyPondScene />
            <div className="content">
                <div className="header-container">
                    <h1>hi. i'm chloe.</h1>
                    <p>i'm a creative developer with a background in computer science.</p>
                    <p>i blend creativity with tech, pretend 6am workouts will add structure to my life, and spend too much on tiny trivial things. always looking for new opportunities to build meaningful digital experiences, let's connect!</p>
                </div>

                <div className="links-container">
                    <a href="/about" className="nav-link">get to know me</a>
                    <a href="/portfolio" className="nav-link">i coded this lily pond! check out more of my work</a>
                    <a href="/resume" className="nav-link">see my experience</a>
                    <a href="/contact" className="nav-link">get in touch with me</a>
                </div>
            </div>

        </div>
    );
};

export default LandingPage;