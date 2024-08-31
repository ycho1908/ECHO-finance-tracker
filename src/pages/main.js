// CREDIT: https://app.spline.design/community/file/51a750cb-f6a9-4207-94dc-ea793196df32
import { useNavigate } from 'react-router-dom';
import '../App.css';
import Spline from '@splinetool/react-spline';

export default function Main() {
    const navigate = useNavigate();
    
    const handleScreenClick = () => {
        navigate('/nav');
    };

    return (
        <div className="spline-container" onClick={handleScreenClick}>
            <Spline scene="https://prod.spline.design/3eAMxAFtIJxgGAv1/scene.splinecode" />
        </div>
    );
}

// // PREV MAIN PAGE IMPLEMENTATION
// import '../App.css';
// import Spline from '@splinetool/react-spline';

// export default function Main() {
//   return (
//     <div className="spline-container">
//         <Spline scene="https://prod.spline.design/GBtpi5xIlukbac9L/scene.splinecode" />
//     </div>
//   );
// }


// // PREV PREV MAIN PAGE IMPLEMENTATION
// import '../App.css';
// import React from 'react';
// import MovingComponent from 'react-moving-text';

// function Main() {
//     return (
//         <div>
//             <MovingComponent
//                 type="zoomIn"
//                 duration="1000ms"
//                 delay="0s"
//                 direction="normal"
//                 timing="ease"
//                 iteration="1"
//                 fillMode="none"
//                 className="main-text"
//                 style={{fontSize: '150px', fontWeight: "bold" }}>
//                 Echo.
//             </MovingComponent>
//             <p className="main-sub-text" style={{fontSize: '50px', fontStyle: "italic" }}>Echo your life <br/> Your personal finance journal</p>
//         </div>
//     )
// }

// export default Main;