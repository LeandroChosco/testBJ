import React, { useEffect, useState } from 'react';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import { CircleSpinner } from "react-spinners-kit";
import { LANG } from '../../constants/token';

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

export default function CatAddress(props) {

    const { /*setShowModalCatCarrier,*/ carrier, columnsCatCarrier } = props;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (carrier && carrier.length > 0) {
            setTimeout(() => {
                setLoading(false);
            }, 500);
        };
    }, [carrier]);

    return (
        <div className="containerTable">
            <div className="row containerTitle">
                <div className="col">
                    {/* <div>
                        <input type="button" className="btn btnAdd" value={localStorage.getItem(LANG) === "english" ? "Add Cat Carrier" : "Agregar Cat Carrier"} style={{ marginRight: "50px" }} onClick={() => setShowModalCatCarrier("Agregar Cat Carrier")} />
                    </div> */}
                    <hr />
                    <h3 className="pt-2">{localStorage.getItem(LANG) === "english" ? "Cat Carrier List" : "Lista de Cat Carrier"}</h3>
                </div>
            </div>
            {
                loading ?
                    <div style={styles.spinner}>
                        <CircleSpinner size={30} color="#D7DBDD" loading={loading} />
                    </div>
                    :
                    carrier && carrier.length === 0 ?
                        <div className="row">
                            <div className="col">
                                <p>{localStorage.getItem(LANG) === "english" ? "No Cat Carrier to show" : "No hay Cat Carrier que mostrar"}</p>
                            </div>
                        </div>
                        :
                        <BootstrapTable className="styleTable" hover="true" keyField='id' data={carrier ? carrier : []} columns={columnsCatCarrier} pagination={paginationFactory()} filter={filterFactory()} />
            }
        </div>
    )
}