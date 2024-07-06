import { useEffect, useState, createContext, useContext, useRef } from "react";
import { FaAngleDown } from 'react-icons/fa';
import './accordian.css';

const AccordianContext = createContext()

export function Accordian({children, value, onChange, ...props}) {
    const [selected, setSelected] = useState(value);

    useEffect(() => {
        onChange?.(selected);
    }, [selected])

    return (
        <ul {...props}>
            <AccordianContext.Provider value={{selected, setSelected}}>
                {children}
            </AccordianContext.Provider>
        </ul>
    )
}

export function AccordianItem({children, value, trigger, ...props}) {
    const {selected, setSelected} = useContext(AccordianContext);
    const open = selected === value;

    const ref =useRef(null);

    return (
        <li className="border-b" {...props}>
            <header role="button" onClick={() => setSelected(open ? null : value)} className="flex justify-between items-center p-4 font-medium">
                {trigger}
                <FaAngleDown size={16} 
                className={`transition-transform ${open ? "rotate-180": ""}`}/>
            </header>
            <div className="accordion-content" style={{height: open? ref.current?.scrollHeight || 0  : 0}}>
                <div className="accordion-inner" ref={ref}>
                    {children}
                </div>
            </div>
        </li>
    )
}