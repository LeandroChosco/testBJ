import React from 'react';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';

export default function CatAddress(props) {

    const { setShowModalCatAddress, allCatAddress, columnsCatAddress } = props

    return (
        <div className="containerTable">
            <div className="row containerTitle">
                <div className="col">
                    <div>
                        <input type="button" className="btn btnAdd" value="Agregar Cat Address" style={{ marginRight: "50px" }} onClick={() => setShowModalCatAddress("Agregar Cat Address")} />
                    </div>
                    <hr />
                    <h3 className="pt-2">Lista de Cat Address</h3>
                </div>
            </div>
            {allCatAddress && allCatAddress.length === 0 ?
                <div className="row">
                    <div className="col">
                        <p>No hay Cat Address que mostrar</p>
                    </div>
                </div>
                :
                <BootstrapTable className="styleTable" hover="true" keyField='id' data={allCatAddress ? allCatAddress : []} columns={columnsCatAddress} pagination={paginationFactory()} filter={filterFactory()} />
            }
        </div>
    )
}