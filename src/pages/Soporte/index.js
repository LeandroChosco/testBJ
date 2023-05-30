import React, { useState } from 'react';
import { useQuery } from '@apollo/client'
import conections from '../../conections';
import constants from '../../constants/constants'
import { TOKEN_FIX } from '../../constants/token'
import { CAT_ADDRESS, GET_CARRIER, GET_API_URL, GET_STORAGE_URL, GET_STREAM_URL } from '../../graphql/queries'

import UrlApi from './UrlApi';
import UrlStream from './UrlStream';
import UrlStorage from './UrlStorage';
import CatCarrier from './CatCarrier';
import CatAddress from './CatAddress';
import Actions from './Actions';
import ModalCatAddress from '../../components/ModalSoporte/modalCatAddress';
import ModalCatCarrier from '../../components/ModalSoporte/modalCatCarrier';
import ModalUrlApi from '../../components/ModalSoporte/modalUrlApi';
import ModalUrlStream from '../../components/ModalSoporte/modalUrlStream';
import ModalUrlStorage from '../../components/ModalSoporte/modalUrlStorage';

import { Tab } from 'semantic-ui-react'
import { ToastsContainer, ToastsStore } from "react-toasts";
import { textFilter } from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import './style.css'



const Soporte = (props, { showMatches }) => {

  const token = TOKEN_FIX;

  const panes = [
    {
      menuItem: 'URL API',
      render: () => <Tab.Pane attached={false}><UrlApi setShowModalUrlApi={setShowModalUrlApi} allApiUrl={allApiUrl} columnsApi={columnsApi} /></Tab.Pane>,
    },
    {
      menuItem: 'URL STREAM',
      render: () => <Tab.Pane attached={false}><UrlStream setShowModalUrlStream={setShowModalUrlStream} streamUrl={streamUrl} columnsStream={columnsStream} /></Tab.Pane>,
    },
    {
      menuItem: 'URL STORAGE',
      render: () => <Tab.Pane attached={false}><UrlStorage setShowModalUrlStorage={setShowModalUrlStorage} storageUrl={storageUrl} columnsStorage={columnsStorage} /></Tab.Pane>,
    },
    {
      menuItem: 'CAT CARRIER',
      render: () => <Tab.Pane attached={false}><CatCarrier setShowModalCatCarrier={setShowModalCatCarrier} carrier={carrier} columnsCatCarrier={columnsCatCarrier} /></Tab.Pane>,
    },
    {
      menuItem: 'CAT ADDRESS',
      render: () => <Tab.Pane attached={false}><CatAddress setShowModalCatAddress={setShowModalCatAddress} allCatAddress={allCatAddress} columnsCatAddress={columnsCatAddress} /></Tab.Pane>,
    },

  ]

  const [clientId, setClientId] = useState("")

  //   const [showModalUser, setShowModalUser] = useState(false);
  //   const [showModalResetPassword, setShowModalResetPassword] = useState(false);
  //   const [showModalUserUpdate, setShowModalUserUpdate] = useState(false);
  //   const [showModalUserDelete, setShowModalUserDelete] = useState(false);

  //   const [showModalCamera, setShowModalCamera] = useState(false);
  //   const [showModalCameraDetail, setShowModalCameraDetail] = useState(false);
  //   const [showModalCameraUpdate, setShowModalCameraUpdate] = useState(false);
  //   const [showModalCameraDelete, setShowModalCameraDelete] = useState(false);

  //   const [showModalCameraInputs, setShowModalCameraInputs] = useState(false);

  const [showModalCatAddress, setShowModalCatAddress] = useState(false)
  const [showModalCatCarrier, setShowModalCatCarrier] = useState(false)
  const [showModalUrlApi, setShowModalUrlApi] = useState(false)
  const [showModalUrlStorage, setShowModalUrlStorage] = useState(false)
  const [showModalUrlStream, setShowModalUrlStream] = useState(false)

  const [currentData, setCurrentData] = useState("")


  const getClient = () => {
    conections.getClients().then(res => {
      if (clientId !== res.data.data.getClients.filter(el => el.name === constants.client)[0].id) {
        setClientId(res.data.data.getClients.filter(el => el.name === constants.client)[0].id)
      }
    })
  }
  getClient();



  const getCatAddress = () => {
    let { data, loading } = useQuery(CAT_ADDRESS, {
      variables: {
        userId: 1,
      },
      context: {
        headers: {
          "Authorization": token ? token : "",
        }
      }
    })

    if (!loading && data) {
      return data.getCatAddress.response
    }
  }
  const allCatAddress = getCatAddress();


  const getCarrier = () => {
    let { data, loading } = useQuery(GET_CARRIER, {
      variables: { userId: 1 },
      context: {
        headers: {
          "Authorization": token ? token : "",
        }
      }
    })
    if (!loading && data) {
      return data.getCatCarrier.response
    }
  }
  const carrier = getCarrier();


  const getApiUrl = () => {
    let { data, loading } = useQuery(GET_API_URL, {
      variables: { userId: 1 },
      context: {
        headers: {
          "Authorization": token ? token : "",
        }
      }
    })
    if (!loading && data) {
      return data.getCatUrlApi.response
    }
  }
  const allApiUrl = getApiUrl();


  const getStorageUrl = () => {
    let { data, loading } = useQuery(GET_STORAGE_URL, {
      variables: { userId: 1 },
      context: {
        headers: {
          "Authorization": token ? token : "",
        }
      }
    })
    if (!loading && data) {
      return data.getCatUrlStorage.response
    }
  }
  const storageUrl = getStorageUrl();


  const getStreamUrl = () => {
    let { data, loading } = useQuery(GET_STREAM_URL, {
      variables: { userId: 1 },
      context: {
        headers: {
          "Authorization": token ? token : "",
        }
      }
    })
    if (!loading && data) {
      return data.getCatUrlStream.response
    }
  }
  const streamUrl = getStreamUrl();



  const actions = (cell, row, rowIndex, formatExtraData) => {
    return (
      <Actions row={row} setCurrentData={setCurrentData} setShowModalCatAddress={setShowModalCatAddress} setShowModalCatCarrier={setShowModalCatCarrier} setShowModalUrlApi={setShowModalUrlApi} setShowModalUrlStorage={setShowModalUrlStorage} setShowModalUrlStream={setShowModalUrlStream} />
    )
  }
  // data={[row, setCurrentData, setShowModalResetPassword, setShowModalCameraDetail, setShowModalUserUpdate, setShowModalCameraUpdate, setShowModalUserDelete, setShowModalCameraDelete]}

  const columnsCatAddress = [{
    dataField: "d_cp",
    text: 'Código Postal',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "d_estado",
    text: 'Estado',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "d_ciudad",
    text: 'Ciudad',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "actions",
    text: '',
    formatter: actions,
  }];


  const columnsCatCarrier = [{
    dataField: "carrier",
    text: 'Nombre Carrier',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "description",
    text: 'Descripción',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "active",
    text: 'Activa?',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "actions",
    text: '',
    formatter: actions,
  }]


  const columnsApi = [{
    dataField: "name_instance",
    text: 'Nombre',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "dns_ip",
    text: 'DNS',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "active",
    text: 'Activa?',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "type",
    text: 'Tipo',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "actions",
    text: '',
    formatter: actions,
  }]


  const columnsStorage = [{
    dataField: "ip_url",
    text: 'IP',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "dns_bold",
    text: 'DNS',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "bucket_bold",
    text: 'Bucket',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "client_bucket_bold",
    text: 'Cliente',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "region_bold",
    text: 'Region',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "actions",
    text: '',
    formatter: actions,
  }]


  const columnsStream = [{
    dataField: "name",
    text: 'Nombre',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "ip_url_ms",
    text: 'DNS',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "active",
    text: 'Activa?',
    filter: textFilter({
      placeholder: "🔎"
    })
  }, {
    dataField: "actions",
    text: '',
    formatter: actions,
  }]

  const hideModal = (type) => {
    switch (type) {
      case "Cat Address":
        setShowModalCatAddress(false);
        setCurrentData(false)
        break;
      case "Cat Carrier":
        setShowModalCatCarrier(false);
        setCurrentData(false)
        break;
      case "Url Api":
        setShowModalUrlApi(false);
        setCurrentData(false)
        break;
      case "Url Stream":
        setShowModalUrlStream(false);
        setCurrentData(false)
        break;
      case "Url Storage":
        setShowModalUrlStorage(false);
        setCurrentData(false)
        break;
      default:
        break;
    }
  }

  //   const hideModalCameraInputs = () => {
  //     setShowModalCameraInputs(false)
  //   }

  return (
    <div className={!showMatches ? "hide-matches" : "show-matches"}>
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      <ToastsContainer store={ToastsStore} />
      {
        showModalCatAddress ?
          <ModalCatAddress showModalCatAddress={showModalCatAddress} setShowModalCatAddress={setShowModalCatAddress} hide={() => hideModal("Cat Address")} currentData={currentData} setCurrentData={setCurrentData} />
          :
          showModalCatCarrier ?
            <ModalCatCarrier showModalCatCarrier={showModalCatCarrier} setShowModalCatCarrier={setShowModalCatCarrier} hide={() => hideModal("Cat Carrier")} currentData={currentData} setCurrentData={setCurrentData} />
            :
            showModalUrlApi ?
              <ModalUrlApi showModalUrlApi={showModalUrlApi} setShowModalUrlApi={setShowModalUrlApi} hide={() => hideModal("Url Api")} currentData={currentData} setCurrentData={setCurrentData} />
              :
              showModalUrlStream ?
                <ModalUrlStream showModalUrlStream={showModalUrlStream} setShowModalUrlStream={setShowModalUrlStream} hide={() => hideModal("Url Stream")} currentData={currentData} setCurrentData={setCurrentData} />
                :
                showModalUrlStorage ?
                  <ModalUrlStorage showModalUrlStorage={showModalUrlStorage} setShowModalUrlStorage={setShowModalUrlStorage} hide={() => hideModal("Url Storage")} currentData={currentData} setCurrentData={setCurrentData} />
                  :
                  null
      }
    </div>
  );
}

export default Soporte;