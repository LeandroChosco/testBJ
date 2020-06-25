import React, { useEffect } from "react";
import { Divider, Card } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import * as moment from "moment";
import constants from "../../constants/constants";

const CovidItem = props => {
  useEffect(() => {
    // console.log(props.info);
    // return () => {
    //   cleanup;
    // };
  }, []);

  const _godetails = () => {
    console.log(props);
    if (props.toggleControls) {
      props.toggleControls();
    }
    if (props.dashboard) {
      console.log("entro al if de dashboard ");
      window.open(
        window.location.href
          .replace(window.location.pathname, "/")
          .replace(window.location.search, "")
          .replace(window.location.hash, "") +
          "detalles/covidtree/" +
          props.info.name,
        "_blank",
        "toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1,width=800,height=600"
      );
    }

    if (!props.dashboard) {
        window.open(
          window.location.href
            .replace(window.location.pathname, "/")
            .replace(window.location.search, "")
            .replace(window.location.hash, "") +
            "detalles/covid/" +
            props.info.name,
          "_blank",
          "toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1,width=900,height=600"
        );
      // props.history.push();
    }
  };

  return (
    <Card
      onClick={_godetails}
      style={{ marginTop: "10px", padding: 0, width: "100%" }}
    >
      <Card.Content style={{ paddingBottom: 0 }}>
        <Card.Description>
          <div
            className="row"
            style={{ fontSize: ".8rem", position: "relative" }}
          >
            <div className="col-12" align="left">
              {/* <div align="right">
                {props.info.created
                  ? moment(props.info.created).format("YYYY-MM-DD HH:mm")
                  : "25-03-2019 14:35"}
              </div> */}

              <div className="row">
                <div className="col-12">
                  <img
                    src={`${constants.sails_url}:${constants.sails_port}/${props.info.relative_path}/${props.info.name}`}
                    style={{ width: "100%" }}
                    alt="img"
                  />
                </div>
              </div>
              <Divider />
              <div className="row">
                <div className="col-4">
                  <b>Camara:</b>
                </div>
                <div className="col-8">{props.info.cam_id}</div>
              </div>
              <div className="row">
                <div className="col-4">
                  <b>Dirección:</b>
                </div>
                <div className="col-8">
                  <b>
                    {" Calle: " +
                      props.info.camData[0].street +
                      " #" +
                      props.info.camData[0].number}
                  </b>{" "}
                  {" Col: " + props.info.camData[0].town},{" "}
                  {props.info.camData[0].township},{" "}
                  {props.info.camData[0].state}
                </div>
              </div>
              <Divider />
              <div className="row">
                <div className="col-4">
                  <b>Fecha y hora:</b>
                </div>
                <div className="col-8">
                  {moment(props.info.created).format("YYYY-MM-DD HH:mm")}
                </div>
              </div>
              <div align="right" style={{ fontSize: "1.2rem" }}>
                {/* <span
                  className={
                    this.props.info.status === 1
                      ? "badge badge-success"
                      : this.props.info.status === 0 ||
                        this.props.info.status === 2
                      ? "badge badge-danger"
                      : "badge badge-warning"
                  }
                >
                  {this.props.info.status === 1
                    ? "Abierto"
                    : this.props.info.status === 2
                    ? "Cancelado"
                    : this.props.info.status === 0
                    ? "Finalizado"
                    : "No finalizado"}
                </span> */}
              </div>
            </div>
          </div>
        </Card.Description>
      </Card.Content>
    </Card>
  );
};

export default withRouter(CovidItem);
