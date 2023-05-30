import React from 'react';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';

export default function UrlStorage(props) {

    const { setShowModalUrlStorage, storageUrl, columnsStorage } = props

    return (
        <div className="containerTable">
            <div className="row containerTitle">
                <div className="col">
                    <div>
                        <input type="button" className="btn btnAdd" value="Agregar Url Storage" style={{ marginRight: "50px" }} onClick={() => setShowModalUrlStorage("Agregar Url Storage")} />
                    </div>
                    <hr />
                    <h3 className="pt-2">Lista de Url Storage</h3>
                </div>
            </div>
            {storageUrl && storageUrl.length === 0 ?
                <div className="row">
                    <div className="col">
                        <p>No hay Url Storage que mostrar</p>
                    </div>
                </div>
                :
                <BootstrapTable className="styleTable" hover="true" keyField='id' data={storageUrl ? storageUrl : []} columns={columnsStorage} pagination={paginationFactory()} filter={filterFactory()} />
            }
        </div>
    )
}