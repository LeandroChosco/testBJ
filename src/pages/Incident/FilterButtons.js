import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa';
import { arrayWarnings } from './arrayWarnings';
import './style.css';

const FilterButtons = ({ handleSearch }) => {

    const [activeButton, setActiveButton] = useState(null);

    const filterByTag = (tag) => {
        handleSearch(tag);
        setActiveButton(tag);
    };

    return (
        <>
            {/* <h3>FILTROS POR TAG {activeButton && `(${activeButton})`}</h3> */}
            <div style={{ display: "flex" }}>
                {arrayWarnings.map((value, index) => {
                    return (
                        <button key={index} className={value.short_name === activeButton ? "btn btn-primary btnFilter" : "btn btn-outline-primary btnFilter"} onClick={() => {
                            filterByTag(value.short_name);
                        }}>
                            #{value.short_name}
                        </button>
                    )
                })
                }
                <button className='btn btn-outline-primary btnFilter' onClick={() => {
                    filterByTag(null);
                }}>
                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                </button>
            </div>
        </>
    )
}

export default FilterButtons