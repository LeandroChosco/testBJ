import firebase from '../constants/configSOS';

export const SOS_COLLECTION = 'tracking';
export const POLICE_COLLECTION = 'police';
export const MESSAGES_COLLECTION = 'messages';
export const COMPLAINT_COLLECTION = 'complaint';

const fireSos = firebase.app('sos').firestore();

export const getSOS = async (param) => {
  const { SOSType } = param;
  try {
    const request = await fireSos.collection(SOS_COLLECTION).add({ SOSType });
    let data = await request.get();
    return { data };
  } catch (err) {
    return { Error: true, err };
  }
};

export const getTracking = async (id) => {
  try {
    const trackingRef = await fireSos.collection(SOS_COLLECTION);
    const request = await trackingRef.doc(id);
    const getData = await request.get();
    return { data: getData };
  } catch (err) {
    return { error: err };
  }
};

export const createDocPolice = async (messageId, trackingId, trackingType) => {
  try {
    const data = {
      policeList: [ { id: 1, status: null, reason: null } ],
      policeIds: [ 1 ],
      pointCoords: [],
      messageId,
      trackingType,
      lastModification: new Date()
    };
    const police = await fireSos.collection(POLICE_COLLECTION).add({ ...data });

    const policeId = police.id;
    await fireSos.collection(MESSAGES_COLLECTION).doc(messageId).update({ policeId });
    await fireSos.collection(SOS_COLLECTION).doc(trackingId).update({ sendPolice: true });

    return { success: true, policeId };
  } catch (err) {
    return { success: false, error: err };
  }
};
