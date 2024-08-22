import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap';
import { LANG, MODE, /*MODE, SAILS_ACCESS_TOKEN */ } from '../../constants/token';

import versions from "./versionInfo";

import "./style.css";

const ModalVersions = ({ currentVersion, modal, hideModal }) => {


    const [showVersions, setShowVersions] = useState(0);
    const toggle = (id) => {
        if (showVersions === id) {
            setShowVersions();
        } else {
            setShowVersions(id);
        }
    };

    return (
        <div>
            <Modal size="xl" backdrop={"static"} show={modal} onHide={hideModal} contentClassName={"margin-modal"}>
                <Modal.Header style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#0c304e" : "white", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666" }} closeButton>
                    <h3>{localStorage.getItem(LANG) === "english" ? `Version history (Current V${currentVersion})` : `Historial de versiones (Actual V${currentVersion})`}</h3>
                </Modal.Header>
                <Modal.Body style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#0c304e" : "white", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666" }}>
                    <div style={{ maxHeight: "48rem", overflowY: "scroll" }}>
                        <Accordion className="accordion-version" open={showVersions} toggle={toggle}>
                            {
                                versions.map((el, idx) => {
                                    return (
                                        <AccordionItem >
                                            <AccordionHeader targetId={idx} className="accordion-borders-version nav-bar-styles-version">
                                                <h4 className='data-toggle-version'>
                                                    Versión {el.version} - Subida el {el.date}
                                                </h4>
                                            </AccordionHeader>
                                            <AccordionBody accordionId={idx} className="accordion-body-version">
                                                <h5>Mejoras</h5>
                                                <ul>
                                                    {
                                                        el.changes.map((element, index) => {
                                                            return (
                                                                <li>
                                                                    <p key={index} className="change-version" style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666" }}>{index + 1}{") "} {element}</p>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                                <hr style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666" }} />
                                                <h5>Bugs</h5>
                                                <ul>
                                                    {
                                                        el.bugs.map((element, index) => {
                                                            return (
                                                                <li>
                                                                    <p key={index} className="change-version" style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666" }}>{index + 1}{") "} {element}</p>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </AccordionBody>
                                        </AccordionItem>
                                    )
                                })
                            }
                        </Accordion>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ModalVersions;