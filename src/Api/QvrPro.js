import constants from '../constants/constants';
const VER = '1.2.0';
export default {
	getUrlForAuthLogin: () => {
		let url = `${constants.sails_url}:${constants.sailsPort}/qvrpro/auth/login`;
		return url;
	},

	getUrlForAuthLogout: () => {
		let url = `${constants.sails_url}:${constants.sailsPort}/qvrpro/auth/logout`;
		return url;
	},

	getUrlForCameraList: () => {
		let url = `${constants.sails_url}:${constants.sailsPort}/qvrpro/camera/list`;
		return url;
	},

	getUrlForCameraCapability: () => {
		let url = `${constants.sails_url}:${constants.sailsPort}/qvrpro/camera/capability`;
		return url;
	},

	getUrlForChannelList: () => {
		let url = `${constants.sails_url}:${constants.sailsPort}/qvrpro/channel/list`;
		return url;
	},

	getUrlForLiveStreaming: () => {
		let url = `${constants.sails_url}:${constants.sailsPort}/qvrpro/livestreaming`;
		return url;
	},

	getUrlForSnapshot: () => {
		let url = `${constants.sails_url}:${constants.sailsPort}/qvrpro/snapshot`;
		return url;
	},

	getUrlForVideo: () => {
		let url = `${constants.sails_url}:${constants.sailsPort}/qvrpro/recording`;
		return url;
	},

	getUrlForRecording: (params) => {
		let { url, channel, stream, sid, start_time, end_time, time, pre_period, post_period } = params;
		let newUrl = `${url}/qvrpro/camera/recordingfile/${channel}/${stream}?sid=${sid}&ver=${VER}`;
		if (start_time && end_time) newUrl += `&start_time=${start_time}&end_time=${end_time}`;
		if (time && pre_period && post_period) newUrl += `&time=${time}&pre_period=${pre_period}&post_period=${post_period}`;
		return newUrl;
	},

	getUrlForAlarm: () => {
		let url = `${constants.sails_url}:${constants.sailsPort}/qvrpro/alarm`;
		return url;
	},

	getUrlForCameraPTZ: () => {
		let url = `${constants.sails_url}:${constants.sailsPort}/qvrpro/camera/ptz`;
		return url;
	}
};
