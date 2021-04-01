export function _getCleanIndexChannel(channel) {
	let name = channel.split('_');
	let num = name[0].split('Ch');
	return parseInt(num[1], 10) - 1;
}

export function _getTextSplit(str) {
	let d = str.split('/');
	let fecha = d[6];
	let hour = `${d[7]}:00`;
	let searchFor = `${d[6]}/${d[7]}/`;
	let dh = d[8].split('-');
	let real_hour = `${dh[1].slice(0, 2)}:${dh[1].slice(2, 4)}`;
	return { fecha, searchFor, hour, real_hour };
}

export function _getCleanListVideos(arrList, serverUrl) {
	let hours = [], allVideos = [];
	if (arrList && arrList.length > 0) {
		arrList.forEach((hist) => {
			let splitUrlLink = hist.link_url.split('/');
			let newLinkUrl = `${serverUrl}/${splitUrlLink[ splitUrlLink.length - 1 ]}`;
			hist.link_url = newLinkUrl;
		});

		arrList.forEach((hist) => {
			let htsSplit = _getTextSplit(hist.filename);

			if (!hours.includes(htsSplit.searchFor)) {
				hours.push(htsSplit.searchFor);
				let foundHours = arrList.filter((a) => a.filename.includes(htsSplit.searchFor));
				let videosByHours = { fecha: htsSplit.fecha, hour: htsSplit.hour, videos: [] };
				foundHours.forEach((found) => {
					let fndSplit = _getTextSplit(found.filename);
					videosByHours.videos.push({
						real_hour: fndSplit.real_hour,
						path_video: found.link_url
					});
				});
				allVideos.push(videosByHours);
			}
		});
	}
	return allVideos;
}

export function _getPath(channel, normal, date, hour, video) {
	let path = `/QVRProRecording/File/Standard_Format/${channel}`;
	if (normal) path += `/${normal}`;
	if (date) path += `/${date}`;
	if (hour) path += `/${hour}`;
	if (video) path += `/${video}`;
	return path;
}
