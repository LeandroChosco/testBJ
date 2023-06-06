import React from 'react';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import { CAMERA_FILTER } from '../../graphql/queries';
import { useQuery } from '@apollo/client';
import { RADAR_ID } from '../../constants/token';
import conections from '../../conections';

export default function RenderCamaras(props) {

    const [setShowModalCamera, cameras, setCameras, columnsCameras, clientId, token] = props.data;
    let userId = parseInt(localStorage.getItem(RADAR_ID));

    const getAllCameras = () => {
        conections.getAllCams().then(response => {
            setCameras(response.data);
        });

        // let { data, loading } = useQuery(CAMERA_FILTER, {
        //     variables: {
        //         userId: userId,
        //         id_camara: 0,
        //         clientId: parseInt(clientId),
        //     },
        //     context: {
        //         headers: {
        //             "Authorization": token ? token : "",
        //         }
        //     }
        // })

        // if (!loading && data) {
        //     if (cameras !== data.getCamaraFilter.response) {
        //         setCameras(data.getCamaraFilter.response)
        //     }
        // }
    }
    getAllCameras();

    return (
        <div className="containerTable">
            <div className="row containerTitle">
                <div className="col">
                    <div>
                        <input type="button" className="btn btnAdd" value="Agregar cámara" style={{ marginRight: "50px" }} onClick={() => setShowModalCamera(true)} />
                    </div>
                    <hr />
                    <h3 className="pt-2">Lista de cámaras</h3>
                </div>
            </div>
            {cameras && cameras.length === 0 ?
                <div className="row">
                    <div className="col">
                        <p>No hay cámaras que mostrar</p>
                    </div>
                </div>
                :
                <BootstrapTable className="styleTable" hover="true" keyField='id' data={cameras ? cameras : []} columns={columnsCameras} pagination={paginationFactory()} filter={filterFactory()} />
            }
        </div>
    )
}