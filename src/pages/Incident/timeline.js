import React, { useState } from "react";
import {
    Card,
    Image,
    Row,
    Col
} from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import profile from "../../assets/images/profile.jpg";
// import imagenPost from "../../assets/images/imagenPost.jpg";
import * as moment from "moment";
import conections from "../../conections";
import InfiniteScroll from "react-infinite-scroller";

export default function TimeLine() {
    const [dataTL, setDataTL] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchMoreData = () => {
        if (loading) return;
        setLoading(true);
        conections.getTimeline(currentPage).then(response => {
            if (response.data.success) {
                const newData = [];

                response.data.current_page.forEach(data => {
                    if (!dataTL.some(el => el._id === data._id)) {
                        newData.push(data);
                    };
                });
                setDataTL(prevData => [...prevData, ...newData]);

                if (response.data.total_pages > currentPage) {
                    setCurrentPage(currentPage + 1);
                } else {
                    setHasMore(false);
                };
                setLoading(false);
            }
        })
            .catch(err => console.log(err));
    };

    return (
        <div id="scrollableDiv" style={{ height: "80vh", minWidth: "6rem", overflow: "hidden auto", padding: "0.75rem", display: "grid" }}>
            <InfiniteScroll
                pageStart={0}
                loadMore={fetchMoreData}
                hasMore={hasMore}
                loader={<Spinner style={{ marginTop: "1rem", marginLeft: "50%" }} animation="border" variant="info" role="status" size="xl"><span className="sr-only">Loading...</span></Spinner>}
                useWindow={false}
            >
                {dataTL && dataTL.length > 0 ? (
                    dataTL.map((value, index) => (
                        <React.Fragment key={index}>
                            <Card.Body id="cardBody" style={{ backgroundColor: '#f5f5f5', marginTop: '8px', borderRadius: '5px', width: '545px', padding: "2rem" }}  >
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
                                                    Usuario anónimo
                                                </b>
                                            }
                                        </h6>
                                    </Col>
                                </Row>
                                <h3 style={{ textAlign: "left !important" }}>
                                    {" "}
                                    Descripción: {value.description}
                                    <div style={{ display: "flex", flexWrap: "wrap" }}>
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
                                {
                                    value.image_url &&
                                    <Image
                                        id="imagenTimeLine"
                                        src={value.image_url}
                                        width={450}
                                        height={240}
                                        style={{ margin: "1rem", borderRadius: "2rem 5rem 2rem 5rem" }}
                                    />
                                }
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div>
                                        <i className="fa fa-thumbs-o-up" style={{ color: "blue" }} aria-hidden="true"></i>
                                        <p>{value.like}</p>
                                    </div>
                                    <div>
                                        <i className="fa fa-thumbs-o-down" style={{ color: "blue" }} aria-hidden="true"></i>
                                        <p>{value.dislike}</p>
                                    </div>
                                </div>
                            </Card.Body>
                        </React.Fragment>
                    ))
                ) : (
                    <div>
                        {!loading &&
                            <>
                                <br />
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    bottom: 0,
                                    right: 0,
                                    left: 0,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    display: "flex"
                                }}>No hay datos disponibles</div>
                            </>
                        }
                    </div>
                )}
            </InfiniteScroll>
        </div>
    );
}
