import React from 'react'
import { CurveDash,DonoutDash, HeatMapChart} from './graphic'
import SummaryCount from './summaryCount'
import TableD from './table'
import { Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
const Placas =()=>{
    return(
        <div className="container-fluid py-4">
       <SummaryCount />
        <Row>
        <Col xl={12} lg={12} md={12}>
          <Card>
            <CardHeader>Total de Detecciones por Hora</CardHeader>
            <CardBody>
            <CurveDash/>
            </CardBody>
          </Card>
        </Col>

     
        </Row>
        <Row>
        <Col xl={8} lg={12} md={12}>
          <Card>
            <CardHeader>Vista Unica por tiempo y dia</CardHeader>
            <CardBody>
            <HeatMapChart/>
            </CardBody>
          </Card>
        </Col>
        <Col className='' xl={4} lg={12} md={12}>
            <div className='hfull card '>
            <div className="card-header">
              Tipo de Alerta
            </div>
            <div className='w-100 center'>
            <DonoutDash/>
            </div>
            </div>
        </Col>
        </Row>

    
       <TableD/>
       </div>

    )
}

export default Placas