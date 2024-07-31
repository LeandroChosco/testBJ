import React, { useEffect, useState } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import conections from './../../../conections'

const TableD = () =>{
  const [dataQuery, setDataQuery] = useState([])
  useEffect(() => {
   initialState()
  }, [])
  

  const initialState = async () =>{

    const dataTable = await conections.getLPRTableList();

    if(dataTable.data && dataTable.data.msg ==='ok' && dataTable.data.success && Object.keys(dataTable.data.data).length > 0){
      const auxDataTable = []
      dataTable.data.data.forEach((element,) => {
        auxDataTable.push({
          place: element.plate_full || 'NA'  ,
          timestamp:  `${element.timestamp.split(".")[0].split("T")[0].replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3')} ${element.timestamp.split(".")[0].split("T")[1].replace(/(\d{2})(\d{2})(\d{2})/g, '$1:$2:$3')}`|| 'NA',
          // typeevents: element.event_type || 'NA',
          camera: element.cam_id || 'NA',
          id: index
          // geolocalization:element.id
        });
      });
      setDataQuery(auxDataTable);
    };
  }
    const columns = [{
        dataField: "place",
        text: 'Placa',
        filter: textFilter({
            placeholder: 'Buscar placa'
        })
      },
      {
        dataField: "timestamp",
        text: 'Fecha/Hora',
        filter: textFilter({
            placeholder: 'Buscar fecha'
        })
      },
      {
        dataField: "camera",
        text: 'Cámara',
        filter: textFilter({
            placeholder: 'Buscar cámara'
        })
      },
      // {
      //   dataField: "follow",
      //   text: "",
      //   formatter: ()=>( <button type="button" className="btn btn-primary" style={{marginLeft: "43%"}}>Ver</button>),
      //   sort: true
      // }
      ]
    


    return(
      (dataQuery && dataQuery.length > 0) &&
        <>
            <BootstrapTable keyField='id' data={ dataQuery } columns={ columns } pagination={paginationFactory()} filter={filterFactory()} />
        </>
    )

}

export default TableD