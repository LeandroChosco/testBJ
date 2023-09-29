import React, { useEffect, useState } from 'react';
import ConectionCard from './ConectionCard';
import ReactPaginate from 'react-paginate';
import { LANG } from '../../constants/token';
import ModalDownloadCSV from './ModalDownloadCSV';

import './style.css'

const MockupConection = ({ info, searchHistorialConections, renderLoading, showNotification }) => {

    let { current_page, total_items } = info;

    const [actualPage, setActualPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [modalCSV, setModalCSV] = useState(false);

    function changePage(data) {
        setLoading(true);
        searchHistorialConections(current_page[0].camera.id, data.selected);
        setActualPage(data.selected);
    }

    useEffect(() => {
        setLoading(false);
    }, [current_page]);

    return (
        <>
            {
                modalCSV && <ModalDownloadCSV modal={modalCSV} hide={() => setModalCSV(false)} current_camera={current_page[0].camera.id} current_page={current_page} last_page={(Math.ceil(total_items / 10) - 1)} showNotification={showNotification} renderLoading={renderLoading} />
            }
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <button className='btn btn-outline-primary' onClick={() => {
                    setLoading(true);
                    searchHistorialConections(current_page[0].camera.id, actualPage)
                    setTimeout(() => {
                        setLoading(false);
                    }, 2500);
                }}>Actualizar</button>
                <button className='btn btn-outline-primary' onClick={() => {
                    setModalCSV(true);
                }}>Descargar CSV</button>
            </div>
            <hr />
            <h3>{`Network ID: ${current_page[0].camera.zerotier.zerotier_network}`}</h3>
            <ReactPaginate
                previousLabel={localStorage.getItem(LANG) === "english" ? "Previous" : 'Anterior'}
                nextLabel={localStorage.getItem(LANG) === "english" ? "Next" : 'Siguiente'}
                breakLabel={'...'}
                pageCount={Math.ceil(total_items / 10)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={changePage}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
            />
            {loading ?
                <>
                    <br />
                    <br />
                    {renderLoading()}
                </>
                :
                current_page.map((el, idx) => {
                    return (
                        <ConectionCard info={el} index={idx} key={idx} />
                    )
                })}
        </>
    );
};

export default MockupConection;