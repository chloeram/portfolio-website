const UnderConstruction = () => {
    return (
        <div style={styles.container}>
            <span style={styles.emoji}>🚧</span>
            <h1 style={styles.heading}>Oops! This Site is Under Construction.</h1>
            <p style={styles.text}>Thanks for stopping by! I'm adding a few new items, so check back soon for something cool :)</p>
        </div>
    );
};

const styles = {
    container: {
        marginTop: "15%",
        maxWidth: "600px",
        margin: "auto",
        padding: "40px",
        textAlign: "center",
        backgroundColor: "white",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
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