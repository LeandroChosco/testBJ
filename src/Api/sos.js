import firebase from "../constants/configSOS";

export const SOS_COLLECTION = "tracking";
export const MESSAGES_COLLECTION = "messages";

export const getSOS = async (param) => {
  const { SOSType } = param;
  try {
    const request = await firebase
      .app("sos")
      .firestore()
      .collection(SOS_COLLECTION)
      .add({
        SOSType,
      });

    let data = await request.get();
    return {
      data: data,
    };
  } catch (err) {
    return {
      Error: true,
      err,
    };
  }
};

export const getTracking = async (id) => {
  try {
    const trackingRef = await firebase
      .app("sos")
      .firestore()
      .collection(SOS_COLLECTION);

    const request = await trackingRef.doc(id);
    const getData = await request.get();
    console.log("getTracking", request);

    return {
      data: getData,
    };
  } catch (err) {
    return {
      error: err,
    };
  }
};
