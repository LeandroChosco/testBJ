import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import firebaseC5 from "../../constants/configC5";
const ref = firebaseC5
  .app("c5virtual")
  .firestore()
  .collection("messages");

const RoberyNotification = props => {
  useEffect(() => {
    console.log(props);
    let messages = props.userId.messages;
    messages = messages.map(message => {
      message.dateTime = message.dateTime.toDate();
      return message;
    });
    messages.push({
      from: "support",
      dateTime: new Date(),
      msg: "¿Cuál es su emergencia?"
    });
    console.log(props.userId.userUnread + 1);
    console.log(messages);
    ref
      .doc(props.userId.id)
      .update({
        messages: messages,
        from: "Chat C5",
        userUnread: props.userId.userUnread + 1,
        policeUnread: props.userId.policeUnread + 1
      })
      .then(() => {
        setTimeout(() => {
          props.notificationRoute();
          props.history.push("/chat?f=2&u=" + props.userId.user_creation);
          // window.location.href = window.location.href.replace(window.location.pathname,'/chat#message')
        }, 100);
      });

    return () => {};
  }, []);
  return <div></div>;
};

export default withRouter(RoberyNotification);
