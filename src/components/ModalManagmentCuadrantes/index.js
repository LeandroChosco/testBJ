import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import { CircleSpinner } from "react-spinners-kit";
import { ToastsStore } from "react-toasts";

import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import "./style.css";
import conections from "../../conections";

const styles = {
  spinner: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
};

const ModalManagmentCuadrantes = ({ modal, users, columnsUsers, actualQuadrant, hide, stateModal }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);
  const [selection, setSelection] = useState([]);
  const [checkboxSelect, setCheckboxSelect] = useState([]);
  const [auxCams, setAuxCams] = useState([]);

  const assignCuadrante = () => {
    setIsSubmit(true);
    conections.assignCuadrante(actualQuadrant.id, selection)
    .then(response => {
      if(response.data.success){
        setTimeout(() => {
          setIsSubmit(false);
          ToastsStore.success("Asignación realizada con éxito");
          stateModal(false);
        }, 2500);
      } else {
        setTimeout(() => {
          setIsSubmit(false);
          ToastsStore.error("No se pudo realizar la asignación. Pruebe nuevamente");
          stateModal(false);
        }, 2500);
      }
    })
    .catch(err => {
      console.log(err)
      setTimeout(() => {
        setIsSubmit(false);
        ToastsStore.error("Algo falló. Comuníquese con soporte");
        stateModal(false);
      }, 2500);
    })
  }

  const selectionCheckbox = (data, isSelect, rowIndex, e) => {
    // console.log(e)
    let aux = selection
    let auxSelection = checkboxSelect
    let found = false
    aux.map(select => {
      if (select.id === data.id) {
        found = true
        select.selected = isSelect

        if (isSelect) {
          auxSelection.push(select.id)
        } else {
          auxSelection = auxSelection.filter(x => {
            return x !== select.id
          })
        }
      }

      return select
    })

    if (!found) {
      aux.push({ id: data.id, selected: isSelect })
      if (isSelect) {
        auxSelection.push(data.id)
      } else {
        auxSelection = auxSelection.filter(x => {
          return x !== data.id
        })
      }
    }

    let cams = auxCams

    cams.map(cam => {
      if (cam.id === data.id) {
        cam.selected = isSelect
      }
      return cam
    })

    setCheckboxSelect(auxSelection);
    setSelection(aux);
    setAuxCams(cams);
  }

    const selectionAll = (isSelect, rows, e) => {
      let aux = selection
      let found = false

      rows.map(data => {
          aux.map(select => {
              if (select.id === data.id) {
                  found = true
                  select.selected = isSelect
              }
              return select
          })
          if (!found) {
              aux.push({ id: data.id, selected: isSelect })
          }
          return data;
      })

      let cams = auxCams

      cams.map(cam => {
          rows.map(data => {
              if (cam.id === data.id) {
                  cam.selected = isSelect
              }
              return data;

          })
          return cam;
      })

      // setCheckboxSelect([...checkboxSelect, aux]);
      setSelection(aux);
      setAuxCams(cams);
  }

  const selectRow = {
    mode: 'checkbox',
    clickToSelect: false,
    onSelect: (row, isSelect, rowIndex, e) => selectionCheckbox(row, isSelect, rowIndex, e),
    hideSelectAll: true,
    selected: checkboxSelect,
    onSelectAll: (isSelect, rows, e) => selectionAll(isSelect, rows, e)
  }

  const getUsersCuadrante = () => {
    conections.getUsersCuadrante(actualQuadrant.id)
      .then((response) => {
        let auxSelection = [];
        response.data.data.forEach(el => auxSelection.push(el.id));
        setCheckboxSelect(auxSelection);
        setTimeout(() => {
          setIsLoading(false)
        }, 1000);
      })
      .catch(err => console.log(err))
  }


  useEffect(() => {
    getUsersCuadrante();
  }, [])

  return (
    <Modal size="xl" backdrop={"static"} show={modal} onHide={hide}>
      <Modal.Header closeButton>
        <p>Gestión de usuarios en el cuadrante:  <b style={{ color: 'black' }}>{actualQuadrant.name}</b></p>
      </Modal.Header>
      <Modal.Body className="camsGroup">
        {
          isLoading ?
            <div style={styles.spinner}>
              <CircleSpinner size={30} color="#D7DBDD" loading={isLoading} />
            </div>
            :
            <>
              {users && users.length === 0 ?
                <div className="row">
                  <div className="col">
                    <p>No hay usuarios que mostrar</p>
                  </div>
                </div>
                :
                <>
                  <BootstrapTable className="styleTable" hover="true" keyField='id' data={users ? users : []} columns={columnsUsers} pagination={paginationFactory()} filter={filterFactory()} selectRow={selectRow} />
                  <div style={{ textAlign: 'center', padding: 0, marginTop: 10 }} className="col">
                    <Button style={{ width: '360px', marginLeft: '30px' }} onClick={assignCuadrante}>Asignar</Button>
                  </div>
                </>

              }
            </>
        }

      </Modal.Body>
      {isSubmit && (
        <div style={styles.spinner}>
          <CircleSpinner size={30} color="#D7DBDD" loading={isSubmit} />
        </div>
      )}
    </Modal>
  );
};

export default ModalManagmentCuadrantes;