import React, {Fragment, useState} from 'react';
import { Modal } from 'react-bootstrap';
import { Button, Form, Select } from 'semantic-ui-react';
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import './style.css';
import conections from '../../conections';
import axios from 'axios';
import { CircleSpinner	} from "react-spinners-kit";
import  FormData  from 'form-data';
import Pdfview from './PdfView';

const access = {
  "ApiKey": "A33317CF-6751-4803-8F92-B0F8DE840B1A",
  "ApiSecret": "FVXqUdLtWaED/qb/i6Te++zklBwYJ8wvfAjmDmlXuLkdgULJ6m1RSGBoEDAGclGqmmjm4T6pLC9OzkeP594GOQ==",
  "CustomerId": "f99222d6-a2c6-420d-b87e-b605fadd836b"
}

const styles = {
  spinner:{
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center', 
    display:"flex"
  }
}
const ModalViewBinnacle = ({modal, hide, row}) => {
    console.log('desde el modal', row);
    const [img64, actualizarImg64] = useState(null);
    const [typePersona, actualizaTypePersona] = useState('sospechoso');
    const [dataForm, actualizarDataForm] = useState({
        nombre: '',
        edad: '',
        sexo: '',
        señas_particulares: '',
        ultima_vez: '',
        motivo:'',
        puesto: '',
        comentario:''
    });
    const [imageInfo, setImageInfo]= useState();
    const [isLoading, setIsloading]= useState(false);

    const sexOptions = [
        { key: 'masculino', value: 'masculino', text: 'Masculino' },
        { key: 'feminino', value: 'femenino', text: 'Femenino'}
    ];

    const changeFile = e =>{
        let imgUpload = e.target.files[0]
        let reader = new FileReader();
        setImageInfo(imgUpload);
        reader.readAsDataURL(imgUpload);
        reader.onloadend = () => {
            actualizarImg64(reader.result);
          };
    }

    const changeType = (event, data) =>{
        actualizaTypePersona(data.value);
    }

    const changeInfo = (event, data) =>{
        if(data){
            actualizarDataForm({
                ...dataForm,
                [data.name]: data.value
            })

        }else{
            actualizarDataForm({
                ...dataForm,
                [event.target.name]: event.target.value
            })
        }
        
    }

    return ( 
        <Modal size="md" backdrop={'static'} show={modal} onHide={hide}>
            <Modal.Header closeButton>                      
                <PDFDownloadLink
                    document={<Pdfview data={row} />}
                    fileName={`${row.id}.pdf`}
                    style={{
                        textDecoration: "none",
                        padding: "10px",
                        color: "#fff",
                        backgroundColor: "#186dad",
                        border: "1px solid #4a4a4a"
                    }}
                    >
                    {({ blob, url, loading, error }) =>
                    loading ? "Cargando..." : "Detalle Bitacora PDF"
                    // <a href={url} target="_blank">
                    //     Detalle Bitacora PDF
                    // </a>
                    }
                </PDFDownloadLink>
            </Modal.Header>
            <Modal.Body className="styleContent">
            <Form>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Nombre</label>
                        <input 
                            name="nombre" 
                            type="text"
                            value={row.name || '-'}
                            contentEditable={false}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Oficial</label>
                        <input 
                            name="oficial" 
                            type="text"
                            value={row.nameOficial || '-'}
                            contentEditable={false}
                        />
                    </Form.Field>
                </Form.Group>   
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Fecha</label>
                        <input 
                            name="edad"
                            type="text" 
                            value={row.date || '-'}
                            contentEditable={false}
                        />  
                    </Form.Field>
                    <Form.Field>
                        <label>Hora</label>
                        <input 
                            name="hora"
                            type="text" 
                            value={row.hour || '-'}
                            contentEditable={false}
                        />  
                    </Form.Field>
                    <Form.Field>
                        <label>Sector</label>
                        <input 
                            name="sector"
                            type="text" 
                            value={row.sector || '-'}
                            contentEditable={false}
                        />  
                    </Form.Field>
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Incidencia</label>
                        <input 
                            name="Incidencia" 
                            type="text"
                            value={row.incidentName || '-'}
                            contentEditable={false}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Incidencia Alterna</label>
                        <input 
                            name="Incidenciab" 
                            type="text"
                            value={row.incidentNameOther || '-'}
                            contentEditable={false}
                        />
                    </Form.Field>
                </Form.Group>   
                <Form.Field>
                    {row.images.length > 0 
                    ? row.images.map(d => <img key={d.key} className="styleFoto" src={d.uri} alt="Imagen" /> )                    
                    :null}
                </Form.Field>
                </Form>
                </Modal.Body>
                </Modal>

     );
}
 
export default ModalViewBinnacle;
