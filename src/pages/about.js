import '../App.css';
import React from 'react';
import { Accordian, AccordianItem } from "../components/accordian";
import Spline from '@splinetool/react-spline';

function About() {
  return (
    <div>
      <br/>
      <div style={{
        // border: '2px solid #ddd',
        padding: '20px',
        width: '50%',
        margin: '0 auto', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px'
      }}>
        <Spline scene="https://prod.spline.design/SPwTJcZuLodxnAqp/scene.splinecode" />
      </div>
      <h1 style={{ textAlign: 'center' }}>Warm welcome from Echo</h1> 
      <p style={{ padding: '0 250px', fontSize: '20px' }}>Echo is designed to become a financial tracker for an individual. You can input your goal amount of money that you would like to spend. You can log your expense to keep track of it, along with your goal displayed in your profile. This finance tracker is personalized, so you would have to log into your account, either signing up or through google.
      </p>
    
      <br/>
      <br/>
      <h2 style={{ textAlign: 'center' }}>Frequently Asked Questions</h2> 
      <Accordian style={{ padding: '0 300px'}} className="max-w-lg">
        <AccordianItem value="1" trigger="FAQ 1: Is Echo safe?">
        We do not connect it to your bank account, so your finance log is manually inputted by yourself. Therefore, Echo is a safe financial tracker.
        <br/>
        <br/>
        </AccordianItem>
        <AccordianItem value="2" trigger="FAQ 2: Who can use Echo?">
        Anyone is eligible to use Echo! Anyone who would like to keep track of their finance would be the best fit to use Echo! However, you need to create an account, signing up or connecting it with your email.
        <br/>
        <br/>
        </AccordianItem>
        <AccordianItem value="3" trigger="FAQ 3: What is the purpose of Echo?">
        It is to guide you in terms of taking ownership in your own finance. If you would like to visually see all your expenses and keep track of it, Echo is exactly the perfect fit for you.
        <br/>
        <br/>
        </AccordianItem>
      </Accordian>
      <br/>
      <br/>
      <p style={{padding: '0 250px'}}>Have any other questions? Feel free to reach out to me at: <a href="mailto:yehyeoncho@gmail.com" style={{ color: 'white'}}>yehyeoncho@gmail.com</a></p>
      </div>
  );
}

export default About;
