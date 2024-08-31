import '../App.css';
import React from 'react';
import { Accordian, AccordianItem } from "../components/accordian";

function About() {
  return (
    <div>
      <br/>
      <h1 style={{ textAlign: 'center' }}>Warm welcome from Echo</h1> 
      <p style={{ padding: '0 250px' }}>Echo is designed to become a financial tracker for an individual.</p>
    
      <br/>
      <br/>
      <h2 style={{ textAlign: 'center' }}>Frequently Asked Questions</h2> 
      <Accordian style={{ padding: '0 300px'}} className="max-w-lg">
        <AccordianItem value="1" trigger="FAQ 1: What is Echo?">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Fermentum posuere urna nec tincidunt. Cursus turpis massa tincidunt dui ut ornare lectus sit amet. Cursus euismod quis viverra nibh cras pulvinar mattis. Suspendisse faucibus interdum posuere lorem. Ut aliquam purus sit amet luctus venenatis lectus magna fringilla. Fames ac turpis egestas maecenas pharetra convallis posuere morbi leo. Facilisis mauris sit amet massa vitae. Mattis enim ut tellus elementum sagittis vitae. Semper eget duis at tellus at urna condimentum mattis pellentesque. Pellentesque habitant morbi tristique senectus. Tincidunt vitae semper quis lectus nulla at volutpat diam. Ac felis donec et odio pellentesque diam volutpat. Malesuada fames ac turpis egestas integer. Pellentesque adipiscing commodo elit at imperdiet dui accumsan sit. Ullamcorper sit amet risus nullam eget felis eget. Ut venenatis tellus in metus.
        <br/>
        </AccordianItem>
        <AccordianItem value="2" trigger="FAQ 2: Who can use Echo?">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Fermentum posuere urna nec tincidunt. Cursus turpis massa tincidunt dui ut ornare lectus sit amet. Cursus euismod quis viverra nibh cras pulvinar mattis. Suspendisse faucibus interdum posuere lorem. Ut aliquam purus sit amet luctus venenatis lectus magna fringilla. Fames ac turpis egestas maecenas pharetra convallis posuere morbi leo. Facilisis mauris sit amet massa vitae. Mattis enim ut tellus elementum sagittis vitae. Semper eget duis at tellus at urna condimentum mattis pellentesque. Pellentesque habitant morbi tristique senectus. Tincidunt vitae semper quis lectus nulla at volutpat diam. Ac felis donec et odio pellentesque diam volutpat. Malesuada fames ac turpis egestas integer. Pellentesque adipiscing commodo elit at imperdiet dui accumsan sit. Ullamcorper sit amet risus nullam eget felis eget. Ut venenatis tellus in metus.
        </AccordianItem>
        <AccordianItem value="3" trigger="FAQ 3: What is the purpose of Echo?">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Fermentum posuere urna nec tincidunt. Cursus turpis massa tincidunt dui ut ornare lectus sit amet. Cursus euismod quis viverra nibh cras pulvinar mattis. Suspendisse faucibus interdum posuere lorem. Ut aliquam purus sit amet luctus venenatis lectus magna fringilla. Fames ac turpis egestas maecenas pharetra convallis posuere morbi leo. Facilisis mauris sit amet massa vitae. Mattis enim ut tellus elementum sagittis vitae. Semper eget duis at tellus at urna condimentum mattis pellentesque. Pellentesque habitant morbi tristique senectus. Tincidunt vitae semper quis lectus nulla at volutpat diam. Ac felis donec et odio pellentesque diam volutpat. Malesuada fames ac turpis egestas integer. Pellentesque adipiscing commodo elit at imperdiet dui accumsan sit. Ullamcorper sit amet risus nullam eget felis eget. Ut venenatis tellus in metus.
        </AccordianItem>
      </Accordian>
      <br/>
      <br/>
      <p style={{padding: '0 250px'}}>Have any other questions? Feel free to reach out to us at: <a href="mailto:yehyeoncho@gmail.com" style={{ color: 'white'}}>yehyeoncho@gmail.com</a></p>
      </div>
  );
}

export default About;