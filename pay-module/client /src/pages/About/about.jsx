import React from "react";
import "./about.scss";
import "./img-1.jpg";
import ceo from "./img-1.jpg";
import art from "./img-2.jpg";
import des from "./img-3.jpg";
import banner from "./Header.jpg";

const About = () => {
  return (
    <div className="">
      <div class="about-section">
        <h1>About Us Page</h1>
        <p>Some text about who we are and what we do.</p>
        <p>
          Resize the browser window to see that this page is responsive by the
          way.
        </p>
      </div>

      {/* <h2 >Our Team</h2> */}
      <h2 style={{textAlign:"center"}}>Meet Our Team</h2>

      <div class="row">
        <div class="column">
          <div class="card">
            <img src={des} alt="Jane" style={{width:"30"}}/>
            <div class="container">
              <h2>Jane Doe</h2>
              <p class="title">CEO Founder</p>
              <p>Some text that describes me lorem ipsum ipsum lorem.</p>
              <p>jane@example.com</p>
              <p>
                <button class="button">Contact</button>
              </p>
            </div>
          </div>
        </div>

        <div class="column">
          <div class="card">
          <img src={des} alt="Jane" style={{width:"30"}}/>
            <div class="container">
              <h2>Mike Ross</h2>
              <p class="title">Art Director</p>
              <p>Some text that describes me lorem ipsum ipsum lorem.</p>
              <p>mike@example.com</p>
              <p>
                <button class="button">Contact</button>
              </p>
            </div>
          </div>
        </div>

        <div class="column">
          <div class="card">
          <img src={des} alt="Jane" style={{width:"30"}}/>
            <div class="container">
              <h2>John Doe</h2>
              <p class="title">Designer</p>
              <p>Some text that describes me lorem ipsum ipsum lorem.</p>
              <p>john@example.com</p>
              <p>
                <button class="button">Contact</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
