import React, { useEffect } from "react";
import { Image } from "semantic-ui-react";
import { Modal, Button } from "react-bootstrap";

const imageUrl =
  "http://prod.adminc5.bj.sails.energetikadevelepment.com:1337/public/154/172.20.39.15_01_20200624140213876_MEASURE_TEMP_ALARM_DETECTION.jpg";

const ModalCovidTree = props => {
  useEffect(() => {
    console.log("----------------------------------------");
    console.log(props);
    // return () => {
    //     cleanup
    // }
  }, []);
  return (
    <Modal
      size="sm"
      backdrop={"static"}
      show={props.modal}
      onHide={() => props.hide()}
    >
      <Modal.Header>
        <div>{props.node}</div>
        <div style={{ display: "flex", justifyContent: "start" }}>
          <div>
            <Button onClick={() => props.hide()}>X</Button>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Image src={imageUrl} size="medium" />
      </Modal.Body>
    </Modal>
  );
};

export default ModalCovidTree;
