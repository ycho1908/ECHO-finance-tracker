import '../App.css';
import React from 'react';
import MovingComponent from 'react-moving-text';

function Main() {
    return (
        <div>
            <MovingComponent
                type="zoomIn"
                duration="1000ms"
                delay="0s"
                direction="normal"
                timing="ease"
                iteration="1"
                fillMode="none"
                className="main-text"
                style={{fontSize: '150px', fontWeight: "bold" }}>
                Echo.
            </MovingComponent>
            <p className="main-sub-text" style={{fontSize: '100px', fontStyle: "italic" }}>Echo your life</p>
        </div>
    )
}

export default Main;