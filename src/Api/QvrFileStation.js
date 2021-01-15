import constants from '../constants/constants';

export default {
	getUrlForAuthLogin: (params) => {
		let url = `${constants.sails_url}:${constants.sailsPort}/qvr/filestation/auth/login`;
		return url;
	},

	getUrlForAuthLogout: () => {
		let url = `${constants.sails_url}:${constants.sailsPort}/qvr/filestation/auth/logout`;
		return url;
	},

	getUrlForFileList: () => {
		let url = `${constants.sails_url}:${constants.sailsPort}/qvr/filestation/file/list`;
		return url;
	},

	getUrlForShareLink: () => {
		let url = `${constants.sails_url}:${constants.sailsPort}/qvr/filestation/sharelink`;
		return url;
	},

	getUrlForDeleteShareLink: () => {
		let url = `${constants.sails_url}:${constants.sailsPort}/qvr/filestation/sharelink/delete`;
		return url;
	}
};
