import firebase from 'firebase';
import firebaseC5 from '../constants/configC5CJ';
import firebaseSos from '../constants/configSOS';
import connections from '../conections';

export const SOS_COLLECTION = 'tracking';
export const POLICE_COLLECTION = 'police';
export const MESSAGES_COLLECTION = 'messages';
export const COMPLAINT_COLLECTION = 'complaint';
export const POLICE_TRACKING_COLLECTION = 'police_tracking';
export const POLICE_BINNACLE_COLLECTION = 'police_binnacle';
export const EVENT_COLLECTION = 'event'

const fireSos = firebaseSos.app('sos').firestore();
const fireC5 = firebaseC5.app('c5benito').firestore();

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

export const getPoliceByMessage = async (id) => {
  try {
    let foundPolice = null;
    const police = await fireSos.collection(POLICE_COLLECTION).where('messageId', '==', id).get();
    if (police && police.docs.length > 0) foundPolice = police.docs[0].data();
    return { success: true, data: foundPolice };
  } catch (err) {
    return { success: false, data: null, error: err };
  }
};

export const createDocPolice = async (incident, tracking, policeId, limits) => {
  try {
    const { nombre, clave_municipal } = limits.data;

    let doc = null;
    const police = await fireSos.collection(POLICE_COLLECTION).where('messageId', '==', incident.id).get();
    if (police && police.docs.length > 0) {
      const foundPolice = police.docs[0];
      const params = {
        policeList: firebase.firestore.FieldValue.arrayUnion({ id: policeId, status: null, reason: null }),
        policeIds: firebase.firestore.FieldValue.arrayUnion(policeId),
        lastModification: new Date()
      };
      await fireSos.collection(POLICE_COLLECTION).doc(foundPolice.id).update(params);
      doc = { id: foundPolice.id, ...foundPolice.data(), ...params };
    } else {
      const params = {
        active: true,
        policeList: [ { id: policeId, status: null, reason: null } ],
        policeIds: [ policeId ],
        pointCoords: [],
        c5_admin_clave: 0,
        c5_admin_id: 0,
        clientId: clave_municipal,
        c5_admin_nombre: nombre,
        messageId: incident.id,
        isAlarm: tracking.isAlarm ? true : false,
        trackingType: tracking.isAlarm ? null : incident.trackingType,
        alarmType: tracking.isAlarm ? incident.alarmType : null,
        createdAt: new Date(),
        lastModification: new Date()
      };
      const created = await fireSos.collection(POLICE_COLLECTION).add(params);
      const foundPolice = await created.get();
      doc = { ...foundPolice.data(), ...params, id: foundPolice.id };
    }

    if (tracking.isAlarm) await fireC5.collection(MESSAGES_COLLECTION).doc(incident.id).update({ policeId: doc.id, sendPolice: true });
    else await fireSos.collection(MESSAGES_COLLECTION).doc(incident.id).update({ policeId: doc.id });
    if (!tracking.isAlarm) await fireSos.collection(SOS_COLLECTION).doc(tracking.id).update({ sendPolice: true });

    const params = {
      profileId: policeId,
      title: tracking.isAlarm ? 'Alarma Fisica' : incident.trackingType.includes('Seguimiento') ? 'Follow Me' : 'SOS',
      message: `Nueva incidencia de ${tracking.isAlarm
        ? incident.alarmType
        : incident.trackingType} creada por ${incident.user_name}`,
      type: 'POLICE_ASSIGNMENT',
      info: JSON.stringify({ ...doc })
    };
    connections.sendNotificationByProfile(params);
    return { success: true, doc };
  } catch (err) {
    return { success: false, error: err };
  }
};
