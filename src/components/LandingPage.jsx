import "../styles/LandingPage.css";

const LandingPage = () => {
    return (
        <div className="landing-container">

            <div className="header-container">
                <h1>hi. i'm chloe.</h1>
                <p>i'm a creative developer with a background in computer science.</p>
                <p>(because every family needs a weird cousin, and every asian family needs an engineer)</p>
                <p>i blend creativity with tech, pretend 6am workouts will fix my life, and collect trivial trinkets.</p>
                <p>always open to new opportunities, let's connect!</p>
            </div>

            <div className="links-container">
                <a href="/about" className="nav-link">get to know me</a>
                <a href="/portfolio" className="nav-link">see some of my work</a>
                <a href="/resume" className="nav-link">see my experience</a>
                <a href="/contact" className="nav-link">get in touch with me</a>
            </div>

        </div>
    );
};

export default LandingPage;