import React, { useEffect, useState } from 'react';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import { CircleSpinner } from "react-spinners-kit";

const styles = {
    spinner: {
        position: "relative",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "flex-end",
        display: "flex",
    },
};

export default function UrlApi(props) {

    const { setShowModalUrlApi, allApiUrl, columnsApi } = props;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (allApiUrl && allApiUrl.length > 0) {
            setTimeout(() => {
                setLoading(false);
            }, 500);
        };
    }, [allApiUrl]);

    return (
        <div className="containerTable">
            <div className="row containerTitle">
                <div className="col">
                    <div>
                        <input type="button" className="btn btnAdd" value="Agregar Url Api" style={{ marginRight: "50px" }} onClick={() => setShowModalUrlApi("Agregar Url Api")} />
                    </div>
                    <hr />
                    <h3 className="pt-2">Lista de Url Api</h3>
                </div>
            </div>
            {
                loading ?
                    <div style={styles.spinner}>
                        <CircleSpinner size={30} color="#D7DBDD" loading={loading} />
                    </div>
                    :
                    allApiUrl && allApiUrl.length === 0 ?
                        <div className="row">
                            <div className="col">
                                <p>No hay Url Api que mostrar</p>
                            </div>
                        </div>
                        :
                        <BootstrapTable className="styleTable" hover="true" keyField='id' data={allApiUrl} columns={columnsApi} pagination={paginationFactory()} filter={filterFactory()} />
            }
        </div>
    )
}