import React, { useEffect } from 'react'
import './stylePagination.css'

function PaginationNumber(props) {

    const { videos, allVideos, totalVideos, paginate, currentPage } = props
    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(totalVideos / videos); i++) {
        pageNumbers.push(i)
    }

    // if(!pageNumbers.includes(currentPage)){
    //     paginate(pageNumbers[0])
    // }

    useEffect(() => {
        paginate(pageNumbers[0])
    }, [allVideos])


    return (
        <nav>
            <ul className='pagination-number'>
                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                {pageNumbers.map(number => (
                    <li key={number} className='page-item-number' style={{ background: number === currentPage && "lightgray", transition: "all 0.25s linear" }}>

                        <a onClick={() => { paginate(number) }}
                            className='page-link-number' >
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default PaginationNumber