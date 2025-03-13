const UnderConstruction = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.text}>(◡︵◡)</h1>
            <h1 style={styles.heading}>Oops! This Site is Under Construction.</h1>
            <p style={styles.text}>Thanks for stopping by!</p>
            <p style={styles.text}>I'm adding a few new things, so check back soon.</p>
        </div>
    );
};

const styles = {
    container: {
        marginTop: "100px",
        maxWidth: "600px",
        margin: "auto",
        padding: "40px",
        textAlign: "center",
        fontFamily: "neue-haas-grotesk-display, sans-serif",
        fontWeight: "400",
        fontStyle: "normal",
        letterSpacing: "0.03rem"
    },
    heading: {
        fontSize: "28px",
        color: "#333",
    },
    text: {
        fontSize: "18px",
        color: "#555",
    },
    emoji: {
        fontSize: "40px",
    },
};

export default UnderConstruction;