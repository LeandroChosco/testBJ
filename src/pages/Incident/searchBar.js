import React, { Component } from 'react'
import './style.css'
import { FaSearch, FaTimes } from 'react-icons/fa';
export default class searchBar extends Component {
    state = {
        filterData: [],
        searchSelect: '',
        filterActive: false,
        tagList: []
    }
    render() {
        const dataResult = this.props.data
        const { handleSearch, handleReset } = this.props
        const { filterData, searchSelect, filterActive, tagList } = this.state
        const handleFilter = (event) => {
            const searchWord = event.target.value
            if (searchWord === '') {
                this.setState({ filterData: 0 })
            }
            else {
                if (dataResult && dataResult.length > 0) {

                    const newFilter = dataResult.filter((value) => {
                        return value.toLowerCase().includes(searchWord.toLowerCase())
                    });
                    this.setState({ filterData: newFilter })
                }
            }
        }

        const handleSelector = (value) => {
            let auxArray = tagList;
            if (!tagList.includes(value)) {
                auxArray.push(value)
                this.setState({ tagList: auxArray })
            }
            this.props.handleSearch(tagList)
        }

        const handleDelete = (value) => {
            let auxArray = tagList;
            const data = auxArray.filter((item) => item !== value);
            if (data.length === 0) {
                this.setState({ filterActive: false, tagList: [] });
                handleReset();
            } else {
                this.setState({ tagList: data })
                this.props.handleSearch(data)
            }
        }

        const input = document.getElementById('input');

        return (
            <div className='search'>
                <div className='searchInputs'>
                    <input id='input' type='text' placeholder="Search.." onChange={handleFilter} name='input'></input>
                    <div className='searchIcon' > <FaSearch /> </div>
                </div>
                {searchSelect && filterActive && (
                    <div className='filterActive'>

                        {tagList.map((value, index) => {
                            return (
                                <button key={index} className='filterBtn' onClick={() => {
                                    handleDelete(value);
                                }}>
                                    <p style={{ color: 'white', marginLeft: '2px' }}>
                                        #{value}
                                        <FaTimes style={{ marginLeft: '5px' }} />
                                    </p>
                                </button>
                            )
                        })
                        }
                    </div>
                )}
                {filterData != 0 && (
                    input.value ?
                        <div className='dataResult' >
                            {filterData.map((data, index) => {
                                return (input.value ?
                                    <p key={index} className="datosTag" onClick={() => {
                                        handleSelector(data);
                                        this.setState({ searchSelect: data, filterActive: true });
                                        input.value = ''
                                    }} >#{data} </p>
                                    : null)
                            })}

                        </div> : null
                )}
            </div>
        )
    }
}
