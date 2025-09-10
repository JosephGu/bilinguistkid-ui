import RotatingEarth from "./RotatingEarth";
import "./aboutme.scss";
import Image from "next/image";

function About() {
  return (
    <div className="about-me">
      <div className="about-me-header">
        <div className="about-me-title">
          <span className="about-me-title1">Joseph </span>
          <span className="about-me-title2">Gu</span>
        </div>
        <div className="about-me-nav">
          <span className="about-me-nav-item">Hire Me</span>
          <span className="about-me-nav-item">Rotating Earth</span>
        </div>
      </div>

      <div className="about-me-content">
        <div className="about-me-left-panel">
        </div>
        <div className="about-me-right-panel">
          <span className="about-me-hello">Hello, I&apos;m</span>
          <span className="about-me-name"> Joseph Gu</span>
          <h2>Senior Software Engineer</h2>
          <p>
            I built a large-scale web application for a financial institution,
            which is used by millions of users. <br />
            Deep knowledge of React ecosystem and skilled in performance
            enhancement, troubleshooting and cybersecurity. <br />
            Good at data visualization with D3.js and Highcharts. Adopted
            micro-frontend with Module Federation. <br />
            Extensive project delivery experience, successfully completed eight
            commercial banking-level projects.
            <br />
            Familiar with back-end technologies and capable of independently
            developing small sized websites. <br />
            Experienced in large language model prompt engineering, built a
            requirements generation tool with LLM APIs. <br />
          </p>
        </div>
      </div>

      {/* <RotatingEarth /> */}
    </div>
  );
}

export default About;
