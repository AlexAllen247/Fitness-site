import React from "react";
import HumanAnatomy from "./HumanAnatomy";

const MuscleMap = () => {
  const styles = {
    training: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },
    header: {
      color: "#df0000",
      fontWeight: "bold",
      textDecoration: "underline",
      margin: 30,
    },
    paragraph: {
      color: "#df0000",
      fontSize: 20,
      margin: 30,
    },
    phrase: {
      color: "#df0000",
      fontSize: 26,
      margin: 10,
    },
    link: {
      textDecoration: "none",
      color: "#df0000",
    },
  };

  return (
    <section className="training" style={styles.training}>
      <div>
        <p style={styles.phrase}>
          You can build all aspects of fitness if you focus on muscle
        </p>
        <h1 style={styles.header}>Interactive Muscle Anatomy Chart</h1>
        <p style={styles.paragraph}>Click on a muscle to find out more</p>
      </div>
      <HumanAnatomy />
      <div>
        <p style={styles.paragraph}>
          Image downloaded from{" "}
          <a
            href="https://musclecharts.net/"
            target="_blank"
            rel="noreferrer"
            aria-label="Link to musclecharts.net"
            style={styles.link}
          >
            Muscle Charts.
          </a>
        </p>
      </div>
    </section>
  );
};

export default MuscleMap;
