import React, { useState, /*useEffect*/ } from 'react';
import { Tab } from 'semantic-ui-react'
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
// import firebaseSos from '../../constants/configSOS';
// import { POLICE_BINNACLE_COLLECTION } from '../../Api/sos'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import './style.css'
import ModalViewBinnacle from '../../components/ModalViewBinnacle';
import PoliceContentDashboard from '../../components/Dashboard/PoliceContentDashboard';
import dataFake from './dataFake.json';

const Policia = ({ showMatches }) => {
  // const [binnacles, setBinnacles] = useState([])
  const [showModal, actualizarShowModal] = useState(false);
  // const [detail, setDetail] = useState(null)

  // const getData = async () => {
  //   const { docs } = await firebaseSos.app('sos').firestore().collection(POLICE_BINNACLE_COLLECTION).get();
  //   const parserData = docs.map(item => (
  //     {
  //       id:item.id,
  //       ...item.data()
  //     }
  //   ))
  //   setBinnacles(parserData)
  // }

  // useEffect(() => {
  //   getData()
  // }, []);

  const panes = [
    {
      menuItem: 'Bitacora',
      render: () => <Tab.Pane attached={false}>{renderBinnancle()}</Tab.Pane>,
    },
    {
      menuItem: 'Dashboard',
      render: () => <PoliceContentDashboard data={dataFake} />,
    }
  ]

  const columnsBinnacle = [
    {
      dataField: "date",
      text: 'Fecha',
      filter: textFilter({
        placeholder: 'Buscar por fecha'
      })
    },
    {
      dataField: "hour",
      text: 'Hora',
      filter: textFilter({
        placeholder: 'Buscar por hora'
      })
    },
    {
      dataField: "incidentName",
      text: 'Incidencia',
      filter: textFilter({
        placeholder: 'Buscar incidencia'
      })
    },
    {
      dataField: "incidentNameOther",
      text: 'Incidencia alterna',
      filter: textFilter({
        placeholder: 'Buscar incidencia a.'
      })
    },
    {
      dataField: "sector",
      text: 'Sector',
      filter: textFilter({
        placeholder: 'Buscar sector'
      })
    },
    {
      dataField: "name",
      text: 'Nombre',
      filter: textFilter({
        placeholder: 'Buscar nombre'
      })
    },
    {
      dataField: "nameOficial",
      text: 'Oficial',
      filter: textFilter({
        placeholder: 'Buscar oficial'
      })
    },
  ]

  // const columnsSospechos = [{
  //   dataField: "id_match",
  //   text: 'Id Match',
  //   filter: textFilter({
  //     placeholder: 'Buscar Id'
  //   })
  // }, {
  //   dataField: "nombre",
  //   text: 'Nombre',
  //   filter: textFilter({
  //     placeholder: 'Buscar Nombre'
  //   })
  // }, {
  //   dataField: "edad",
  //   text: 'Edad',
  //   filter: textFilter({
  //     placeholder: 'Buscar Edad'
  //   })
  // }, {
  //   dataField: "sexo",
  //   text: 'Sexo',
  //   filter: textFilter({
  //     placeholder: 'Buscar Sexo'
  //   })
  // }, {
  //   dataField: "date",
  //   text: 'Fecha de Registro',
  //   filter: textFilter({
  //     placeholder: 'Buscar Fecha'
  //   })
  // }, {
  //   dataField: "señas_particulares",
  //   text: 'Señas particulares'
  // }, {
  //   dataField: "ultima_vez",
  //   text: 'Visto por ultima vez'
  // }, {
  //   dataField: "motivo",
  //   text: 'Motivo de busqueda'
  // }, {
  //   dataField: "comentario",
  //   text: 'Comentario'
  // }, {
  //   dataField: 'foto',
  //   formatter: (cel, row) => showImgs(cel, row),
  //   text: 'Fotografía',
  //   style: {
  //     textAlign: 'center'
  //   }
  // }];

  // const tableRowEvents = {
  //   onClick: (e, row, rowIndex) => {
  //     setDetail(row)
  //     actualizarShowModal(true)
  //   }
  // }

  // const showImgs = (cell, row) => {
  //   return (
  //     <img className="styleImg" src={row.foto} alt="img" />
  //   )
  // }


  const renderBinnancle = () => {
    return (
      <div className="containerTable">
        <div className="row containerTitle">
          <div className="col">
            <h3 className="pt-2">Bitacora Policia</h3>
          </div>
        </div>
        {dataFake.length === 0 ?
          <div className="row">
            <div className="col">
              <p>No hay bitacoras</p>
            </div>
          </div>
          : <BootstrapTable className="styleTable" keyField='id' data={dataFake} columns={columnsBinnacle} /*rowEvents={tableRowEvents}*/ pagination={paginationFactory()} filter={filterFactory()} />}
      </div>
    )
  }

  const hideModal = (accion) => {
    actualizarShowModal(false)
    // if (accion) {
    //   listarPersonas()
    // }
  }

  return (
    <>
      <div className={!showMatches ? "hide-matches" : "show-matches"}>
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />

        {showModal ?
          <ModalViewBinnacle modal={showModal} hide={(accion) => hideModal(accion)} /*row={detail}*/ ></ModalViewBinnacle>
          : null
        }
      </div>
    </>
  );
}

export default Policia;
