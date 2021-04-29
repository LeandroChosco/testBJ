import React, { useState, useEffect } from 'react';
import { Tab } from 'semantic-ui-react'
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import './style.css'
import ModalAddSospechoso from '../../components/ModalAddSospechoso';
import conections from '../../conections';
import moment from 'moment';
// import * as moment from 'moment';

const Sospechosos = ({ showMatches }) => {
  const [sospechosos, actualizarSospechosos] = useState([]);
  const [empleados, actualizarEmpleados] = useState([]);
  const [desconocidos, actualizarDesconocidos] = useState([]);
  const [matches, actualizarMatches] = useState([]);

  useEffect(() => {
    listarPersonas()
    listarDesconocidos()
    listarMatches()
  }, []);

  const panes = [
    {
      menuItem: 'Personas de Interes',
      render: () => <Tab.Pane attached={false}>{renderSospechosos()}</Tab.Pane>,
    },
    {
      menuItem: 'Personal',
      render: () => <Tab.Pane attached={false}>{renderEmpleados()}</Tab.Pane>,
    },
    {
      menuItem: 'Desconocidos',
      render: () => <Tab.Pane attached={false}>{renderDesconocidos()}</Tab.Pane>,
    },
    {
      menuItem: 'Detecciones',
      render: () => <Tab.Pane attached={false}>{renderMatches()}</Tab.Pane>,
    }
  ]
  const [showModal, actualizarShowModal] = useState(false);
  const columnsSospechos = [{
    dataField: "id_match",
    text: 'Id Match',
    filter: textFilter({
      placeholder: 'Buscar Id'
    })
  }, {
    dataField: "nombre",
    text: 'Nombre',
    filter: textFilter({
      placeholder: 'Buscar Nombre'
    })
  }, {
    dataField: "edad",
    text: 'Edad',
    filter: textFilter({
      placeholder: 'Buscar Edad'
    })
  }, {
    dataField: "sexo",
    text: 'Sexo',
    filter: textFilter({
      placeholder: 'Buscar Sexo'
    })
  }, {
    dataField: "date",
    text: 'Fecha de Registro',
    filter: textFilter({
      placeholder: 'Buscar Fecha'
    })
  }, {
    dataField: "señas_particulares",
    text: 'Señas particulares'
  }, {
    dataField: "ultima_vez",
    text: 'Visto por ultima vez'
  }, {
    dataField: "motivo",
    text: 'Motivo de busqueda'
  }, {
    dataField: "comentario",
    text: 'Comentario'
  }, {
    dataField: 'foto',
    formatter: (cel, row) => showImgs(cel, row),
    text: 'Fotografía',
    style: {
      textAlign: 'center'
    }
  }];

  const columnsEmpleados = [{
    dataField: "id_match",
    text: 'Id Match',
    filter: textFilter({
      placeholder: 'Buscar Id'
    })
  }, {
    dataField: "nombre",
    text: 'Nombre',
    filter: textFilter({
      placeholder: 'Buscar Nombre'
    })
  }, {
    dataField: "edad",
    text: 'Edad',
    filter: textFilter({
      placeholder: 'Buscar Edad'
    })
  }, {
    dataField: "sexo",
    text: 'Sexo',
    filter: textFilter({
      placeholder: 'Buscar Sexo'
    })
  }, {
    dataField: "date",
    text: 'Fecha de Registro',
    filter: textFilter({
      placeholder: 'Buscar Fecha'
    })
  }, {
    dataField: "puesto",
    text: 'Puesto',
    filter: textFilter({
      placeholder: 'Buscar Puesto'
    })
  }, {
    dataField: "comentario",
    text: 'Comentario'
  }, {
    dataField: 'foto',
    formatter: (cel, row) => showImgs(cel, row),
    text: 'Fotografía',
    style: {
      textAlign: 'center'
    }
  }];

  const columnsDesconocidos = [{
    dataField: "Age",
    text: 'Edad',
    filter: textFilter({
      placeholder: 'Buscar Edad'
    })
  }, {
    dataField: 'Gender',
    text: 'Sexo',
    filter: textFilter({
      placeholder: 'Buscar Sexo'
    })
  }, {
    dataField: "DwellTime",
    text: 'Fecha detección',
    filter: textFilter({
      placeholder: 'Buscar Fecha'
    })
  }, {
    dataField: 'faceImage',
    formatter: (cel, row) => showImgsDesconocidos(cel, row),
    text: 'Fotografía',
    style: {
      textAlign: 'center'
    }
  }];

  const columnsMatches = [{
    dataField: "Age",
    text: 'Edad',
    filter: textFilter({
      placeholder: 'Buscar Edad'
    })
  }, {
    dataField: 'Gender',
    text: 'Sexo',
    filter: textFilter({
      placeholder: 'Buscar Sexo'
    })
  }, {
    dataField: "DwellTime",
    text: 'Fecha detección',
    filter: textFilter({
      placeholder: 'Buscar Fecha'
    })
  }, {
    dataField: 'faceImage',
    formatter: (cel, row) => showImgsDesconocidos(cel, row),
    text: 'Fotografía',
    style: {
      textAlign: 'center'
    }
  }]

  const listarPersonas = () => {
    conections.getPersons().then(res => {
      if (res.status === 200) {
        let resPersons = res.data
        if (resPersons.success) {
          if (resPersons.data.sospechosos.length > 0) {
            resPersons.data.sospechosos.forEach(so => {
              so.date = moment(so.date).format("DD-MM-YYYY, HH:mm:ss")
            })
          }

          if (resPersons.data.empleados.length > 0) {
            resPersons.data.empleados.forEach(em => {
              em.date = moment(em.date).format("DD-MM-YYYY, HH:mm:ss")
            })
          }
          actualizarSospechosos(resPersons.data.sospechosos);
          actualizarEmpleados(resPersons.data.empleados);
        }
      }
    })
  }

  const listarDesconocidos = () => {
    conections.getDesconocidos().then(res => {
      if (res.status === 200) {
        let resDesconocidos = res.data
        //console.log('resDesconocidos',resDesconocidos)
        if (resDesconocidos.success) {
          resDesconocidos.data.desconocidos.forEach(item => {
            if (item.Gender === 'Male')
              item.Gender = 'masculino'
            else
              item.Gender = 'femenino'
          });

          actualizarDesconocidos(resDesconocidos.data.desconocidos);
        }
      }
    })
  }

  const listarMatches = () => {
    conections.getDetecciones().then(res => {
      if (res.status === 200) {
        let resMatches = res.data
        //console.log('resMatches',resMatches)
        if (resMatches.success) {
          resMatches.data.matches.map(item => {
            if (item.Gender === 'Male')
              item.Gender = 'masculino'
            else
              item.Gender = 'femenino'
          })
          actualizarMatches(resMatches.data.matches);
        }
      }
    })
  }

  const showImgs = (cell, row) => {
    return (
      <img className="styleImg" src={row.foto} alt="img" />
    )
  }

  const showImgsDesconocidos = (cell, row) => {
    return (
      <img className="styleImg" src={'data:image/jpeg;base64,' + row.faceImage} alt="img" />
    )
  }

  const renderSospechosos = () => {
    return (
      <div className="containerTable">
        <div className="row containerTitle">
          <div className="col">
            <h3 className="pt-2">Lista de personas de interes</h3>
          </div>
        </div>
        {sospechosos.length === 0 ?
          <div className="row">
            <div className="col">
              <p>No hay personas de interes que mostrar</p>
            </div>
          </div>
          : <BootstrapTable className="styleTable" keyField='id' data={sospechosos} columns={columnsSospechos} pagination={paginationFactory()} filter={filterFactory()} />}
      </div>
    )
  }

  const renderEmpleados = () => {
    return (
      <div className="containerTable">
        <div className="row containerTitle">
          <div className="col">
            <h3 className="pt-2">Lista de Personal</h3>
          </div>
        </div>
        {empleados.length === 0 ?
          <div className="row">
            <div className="col">
              <p>No hay personal que mostrar</p>
            </div>
          </div>
          : <BootstrapTable className="styleTable" keyField='id' data={empleados} columns={columnsEmpleados} pagination={paginationFactory()} filter={filterFactory()} />}


      </div>
    )
  }

  const renderDesconocidos = () => {
    return (
      <div className="containerTable">
        <div className="row containerTitle">
          <div className="col">
            <h3 className="pt-2">Lista de Desconocidos</h3>
          </div>
        </div>
        {desconocidos.length === 0 ?
          <div className="row">
            <div className="col">
              <p>No hay desconocidos que mostrar</p>
            </div>
          </div>
          : <BootstrapTable className="styleTable" keyField='id' data={desconocidos} columns={columnsDesconocidos} pagination={paginationFactory()} filter={filterFactory()} />}


      </div>
    )
  }

  const renderMatches = () => {
    return (
      <div className="containerTable">
        <div className="row containerTitle">
          <div className="col">
            <h3 className="pt-2">Lista de Detecciones</h3>
          </div>
        </div>
        {matches.length === 0 ?
          <div className="row">
            <div className="col">
              <p>No hay detecciones que mostrar</p>
            </div>
          </div>
          : <BootstrapTable className="styleTable" keyField='id' data={empleados} columns={columnsMatches} pagination={paginationFactory()} filter={filterFactory()} />}


      </div>
    )
  }

  const hideModal = (accion) => {
    actualizarShowModal(false)
    if (accion) {
      listarPersonas()
    }

  }

  return (
    <div className={!showMatches ? "hide-matches" : "show-matches"}>
      <div className="col containerBtn" style={{ paddingRight: !showMatches ? '40px' : '0px' }}>
        <input type="button" className="btn btnAdd" value="Agregar Nuevo" onClick={() => actualizarShowModal(true)} />
      </div>

      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />

      {showModal ?
        <ModalAddSospechoso modal={showModal} hide={(accion) => hideModal(accion)} ></ModalAddSospechoso>
        : null
      }
    </div>
  );
}

export default Sospechosos;
