import '../App.css';
import React from 'react';
import Spline from '@splinetool/react-spline';
import { Analytics } from '@vercel/analytics/react';

function Contact() {
  return (
    <div>
      <p>
        Here is my personal page! <a href="https://ycho1908.github.io/personal_page/" style={{ color: 'white', textDecoration: 'underline' }}> https://ycho1908.github.io/personal_page/ </a>
        <br/>
        Feel free to contact me through email or LinkedIn and check out my github!
        <br/>
      </p>
      <Spline scene="https://prod.spline.design/fg-Sy3mBniEBiZVL/scene.splinecode" />
    <Analytics/>
    </div>
  );
}

export default Contact;
