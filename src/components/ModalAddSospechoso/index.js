import React, {Fragment, useState} from 'react';
import { Modal } from 'react-bootstrap';
import { Button, Form, Select } from 'semantic-ui-react';
import './style.css';
import conections from '../../conections';

const ModalAddSospechoso = ({modal, hide}) => {
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
    })

    const sexOptions = [
        { key: 'masculino', value: 'masculino', text: 'Masculino' },
        { key: 'feminino', value: 'femenino', text: 'Femenino'}
    ];

    const changeFile = e =>{
        let imgUpload = e.target.files[0]
        let reader = new FileReader();
        reader.readAsDataURL(imgUpload);
        reader.onloadend = () => {
            actualizarImg64(reader.result);
          };
    }

    const changeType = (event, data) =>{
        actualizaTypePersona(data.value);
    }

    const addPersona = event =>{
        event.preventDefault();
        let data = {
            type: typePersona,
            nombre: dataForm.nombre,
            edad: dataForm.edad,
            sexo: dataForm.sexo,
            comentario: dataForm.comentario,
            foto: img64,
            date: new Date()
        }
        if(typePersona === 'sospechoso'){
            data.señas_particulares = dataForm.señas_particulares
            data.ultima_vez = dataForm.ultima_vez
            data.motivo = dataForm.motivo
        }else{
            data.puesto = dataForm.puesto
        }

        conections.createPersons(data).then(res =>{
            if(res.status === 200){
                let resCreate = res.data;
                if(resCreate.success){
                    hide('crear')
                }
            }
        })
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
                <h3>Nueva Persona</h3>
            </Modal.Header>
            <Modal.Body className="styleContent">
            <Form onSubmit={addPersona}>
                <Form.Group inline>
                    <Form.Radio
                        label='Sopechoso'
                        value='sospechoso'
                        checked={typePersona === 'sospechoso'}
                        onChange={changeType}
                    />
                    <Form.Radio
                        label='Empleado'
                        value='empleado'
                        checked={typePersona === 'empleado'}
                        onChange={changeType}
                    />
                    {/* <Form.Radio
                        label='Desconocido'
                        value='desconocido'
                        checked={typePersona === 'desconocido'}
                        onChange={changeType}
                    /> */}
                </Form.Group>
                <Form.Field>
                    <label>Nombre completo</label>
                    <input 
                        placeholder='Ingrese nombre...'
                        name="nombre" 
                        type="text"
                        value={dataForm.nombre} 
                        onChange={changeInfo}
                    />
                </Form.Field>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Edad</label>
                        <input 
                            placeholder='Ingrese edad...'
                            name="edad"
                            type="number" 
                            value={dataForm.edad} 
                            onChange={changeInfo} 
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Sexo</label>
                        <Select 
                            placeholder='Seleccione...' 
                            name="sexo" 
                            value={dataForm.sexo} 
                            options={sexOptions} 
                            onChange={changeInfo}
                        />
                    </Form.Field>
                </Form.Group>
                {typePersona === 'sospechoso'
                ?
                <Fragment>
                    <Form.Field>
                        <label>Señas particulares</label>
                        <textarea 
                            placeholder="Ingrese las señas particulares..." 
                            rows="2"
                            name="señas_particulares"
                            type="text" 
                            value={dataForm.señas_particulares} 
                            onChange={changeInfo}>
                        </textarea>
                    </Form.Field>
                    <Form.Field>
                        <label>Visto por ultima vez</label>
                        <textarea 
                            placeholder="Ingrese donde fue visto..." 
                            rows="2"
                            name="ultima_vez"
                            type="text"
                            value={dataForm.ultima_vez}  
                            onChange={changeInfo}>
                        </textarea>
                    </Form.Field>
                    <Form.Field>
                        <label>Motivo de busqueda</label>
                        <textarea 
                            placeholder="Ingrese motivo de busqueda..." 
                            rows="2"
                            name="motivo"
                            type="text" 
                            value={dataForm.motivo} 
                            onChange={changeInfo}></textarea>
                    </Form.Field>
                </Fragment>
                :
                <Form.Field>
                    <label>Puesto</label>
                    <input 
                        placeholder='Ingrese el puesto...'
                        name="puesto"
                        type="text" 
                        value={dataForm.puesto} 
                        onChange={changeInfo}
                    />
                </Form.Field>
                }
                <Form.Field>
                    <label>Comentario</label>
                    <textarea 
                        placeholder="Ingrese un comentario..." 
                        rows="2"
                        name="comentario"
                        type="text" 
                        value={dataForm.comentario} 
                        onChange={changeInfo}>
                    </textarea>
                </Form.Field>
                <Form.Field>
                    <label>Fotografía</label>
                    {img64 
                    ?<img className="styleFoto" src={img64} alt="Imagen" />
                    :null}
                    <input type="file" onChange={changeFile}/>
                </Form.Field>
                <div className="row">
                    <Button 
                        className="styleBtnAdd btn-block" 
                        type='submit'
                        disabled={dataForm.nombre === '' || dataForm.sexo === '' || dataForm.edad === '' || dataForm.comentario === '' || img64 === null || (typePersona === 'sospechoso' ? (dataForm.motivo === '' || dataForm.señas_particulares === '' || dataForm.ultima_vez === ''): dataForm.puesto === '')} 
                        >
                            AGREGAR {typePersona.toUpperCase()}
                    </Button>
                </div>
            </Form>
            </Modal.Body>
        </Modal>
     );
}
 
export default ModalAddSospechoso;
