import React, { useEffect, useState } from "react";
import {
    Card,
    Image,
    Row,
    Col
} from "react-bootstrap";
import profile from "../../assets/images/profile.jpg";
import imagenPost from "../../assets/images/imagenPost.jpg";
import * as moment from "moment";
import conections from "../../conections";

export default function TimeLine(props) {

    const [dataTL, setDataTL] = useState(props.data);

    // let dataMap = props.data;

    useEffect(() => {
        conections.getTimeline(1).then(response => {
            if (response.data.success) {
                // console.log("DATA", response.data.current_page)
                setDataTL(response.data.current_page);
            };
        })
            .catch(err => console.log(err));
    }, []);

    return (
        (dataTL && dataTL.length > 0) ?
            dataTL.map((value, index) => {
                return (
                    <React.Fragment key={index}>
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
                                        {!value.anonymous ?
                                            <b>
                                                {value.user_c5}
                                            </b>
                                            :
                                            <b>
                                                Unregistered user
                                            </b>
                                        }
                                    </h6>
                                </Col>
                            </Row>
                            <h3 style={{ textAlign: "left !important" }}>
                                {" "}
                                Descripción: {value.description}
                                <div style={{ display: "flex" }}>
                                    {
                                        value.tags.map((el, idx) => {
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
                                    {moment(value.createdAt).format(
                                        "LLL"
                                    )}{" "}
                                </p>
                            </h3>

                            <Image
                                id="imagenTimeLine"
                                src={
                                    value.image_url
                                        ? value.image_url
                                        : imagenPost
                                }
                                width={500}
                                height={240}
                                rounded
                            />
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div className='col-1'>
                                    <i className="fa fa-thumbs-o-up" style={{ color: "blue" }} aria-hidden="true"></i>
                                    <p>{value.like}</p>
                                </div>
                                <div className='col-1'>
                                    <i className="fa fa-thumbs-o-down" style={{ color: "blue" }} aria-hidden="true"></i>
                                    <p>{value.dislike}</p>
                                </div>
                            </div>
                        </Card.Body>
                    </React.Fragment>
                )

            }
            )
            : <div>
                <br />
                <h2 className="noDataFound">
                    No data found
                </h2>
            </div>
    )
}