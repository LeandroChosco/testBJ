import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa';
import { arrayWarnings } from './arrayWarnings';

const FilterButtons = ({handleSearch}) => {

    const [activeButton, setActiveButton] = useState(null);

    const filterByTag = (tag) => {
        handleSearch(tag);
        setActiveButton(tag);
    };

    return (
        <>
            <h3>FILTROS POR TAG {activeButton && `(${activeButton})`}</h3>
            <div style={{ display: "flex" }}>
                {arrayWarnings.map((value, index) => {
                    return (
                        <button key={index} className='filterBtn' onClick={() => {
                            filterByTag(value.short_name);
                        }}>
                            <p style={{ color: 'white', marginLeft: '2px' }}>
                                #{value.short_name}
                                {/* <FaTimes style={{ marginLeft: '5px' }} /> */}
                            </p>
                        </button>
                    )
                })
                }
                <button className='filterBtn' onClick={() => {
                    filterByTag(null);
                }}>
                    <p style={{ color: 'white', marginLeft: '2px' }}>
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </p>
                </button>
            </div>
        </>
    )
}

export default FilterButtons