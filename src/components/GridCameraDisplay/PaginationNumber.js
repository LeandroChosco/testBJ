import React from 'react'
import './stylePagination.css'

function PaginationNumber(props) {

const {videos, totalVideos, paginate} = props
const pageNumbers = []
for (let i = 1; i <= Math.ceil(totalVideos / videos); i++) {
    pageNumbers.push(i)
}
  return (
    <nav>
        <ul className='pagination-number'>
            {/* eslint-disable jsx-a11y/anchor-is-valid */}
            {pageNumbers.map(number =>(
                <li key={number} className='page-item-number'>
                    
                    <a onClick={()=>{paginate(number)}}  
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