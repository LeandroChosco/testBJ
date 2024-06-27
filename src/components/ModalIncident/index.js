import React, { useEffect, useState } from "react";
import {
    Modal,
    Card,
    Image,
    Row,
    Col
} from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
// import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap';
import { LANG, MODE, /*MODE, SAILS_ACCESS_TOKEN */ } from '../../constants/token';
import profile from "../../assets/images/profile.jpg";
import imagenPost from "../../assets/images/imagenPost.jpg";
import * as moment from "moment";

import "./style.css";

const ModalIncident = ({ marker, hideModal }) => {

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, [])


    return (
        <div>
            <Modal size="lg" backdrop={"static"} show={marker} onHide={hideModal} contentClassName={"margin-modal"}>
                <Modal.Header style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#0c304e" : "white", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666" }} closeButton>
                    <h3>{localStorage.getItem(LANG) === "english" ? `Incident details` : `Detalles del incidente`}</h3>
                </Modal.Header>
                <Modal.Body style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "36rem", background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#0c304e" : "white", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666" }}>
                    {loading ?
                        <div>
                            <Spinner animation="border" variant="info" role="status" size="xl">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>
                        :
                        <React.Fragment>
                            <Card.Body id="cardBody" style={{ backgroundColor: '#f5f5f5', marginTop: '8px', borderRadius: '5px', width: '620px', padding: "2rem" }}  >
                                <Row style={{ alignItems: "center" }}>
                                    <Col lg={1} md={1}>
                                        <Image
                                            src={profile}
                                            width={30}
                                            height={30}
                                            roundedCircle
                                        />
                                    </Col>
                                    <Col
                                        lg={6}
                                        md={6}
                                        style={{
                                            textAlign: "left !important",
                                            padding: "0px",
                                            marginTop: "0px",
                                            marginLeft: "5px",
                                        }}
                                    >
                                        <h6 style={{ textAlign: "left !important" }}>
                                            {" "}
                                            {!marker.anonymous ?
                                                <b>
                                                    {marker.user_c5}
                                                </b>
                                                :
                                                <b>
                                                    Unregistered user
                                                </b>
                                            }
                                        </h6>
                                    </Col>
                                </Row>
                                <br />
                                <div>
                                    <h3 style={{ textAlign: "left !important" }}>
                                        {" "}
                                        Descripción: {marker.description}
                                        <div style={{ display: "flex" }}>
                                            {
                                                marker.tags.map((el, idx) => {
                                                    return (
                                                        <p key={idx} style={{ color: "blue", marginRight: "1rem" }}>{`#${el} `}</p>
                                                    )
                                                })
                                            }
                                        </div>
                                        <p
                                            style={{
                                                textAlign: "right !important",
                                                fontSize: "10px",
                                            }}
                                        >
                                            Fecha:{" "}
                                            {moment(marker.createdAt).format(
                                                "LLL"
                                            )}{" "}
                                        </p>
                                    </h3>

                                </div>

                                <Image
                                    id="imagenTimeLine"
                                    src={
                                        marker.image_url
                                            ? marker.image_url
                                            : imagenPost
                                    }
                                    width={500}
                                    height={240}
                                    rounded
                                />
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div className='col-1'>
                                        <i className="fa fa-thumbs-o-up" style={{ color: "blue" }} aria-hidden="true"></i>
                                        <p>{marker.like}</p>
                                    </div>
                                    <div className='col-1'>
                                        <i className="fa fa-thumbs-o-down" style={{ color: "blue" }} aria-hidden="true"></i>
                                        <p>{marker.dislike}</p>
                                    </div>
                                </div>
                            </Card.Body>
                        </React.Fragment>}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ModalIncident;