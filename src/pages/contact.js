import '../App.css';
import React from 'react';
import Spline from '@splinetool/react-spline';
import { Analytics } from '@vercel/analytics/react';

function Contact() {
  return (
    <div>
      <Spline scene="https://prod.spline.design/fg-Sy3mBniEBiZVL/scene.splinecode" />
      <Analytics/>
    </div>
  );
}

export default Contact;
