import React, { useState, useEffect } from 'react';
import Clappr from 'clappr';
import axios from 'axios';

import * as KNSFunctions from '../../functions/getAmazonKinesis';
import Spinner from 'react-bootstrap/Spinner';
import constants from '../../constants/constants';
import { removeSpaces } from '../../functions/removeSpaces';

const HlsPlayer = (props) => {
	const [src, setSrc] = useState(null);
	const [player, setPlayer] = useState(null);
	const [loading, setLoading] = useState(false);
	const [amazonSrc, setAmazonSrc] = useState(null);

	useEffect(() => {
		setLoading(true);
		if (!props.channelARN) {
			if (props.dataCamValue && props.dataCamValue.display_number) {
				let body = {
					// "server": constants.server_axxon,
					// "user": "root",
					// "password": "root",
					"serial_number": props.dataCamValue.display_number || "LEGA123123",
				};
				if (props.dataCamValue.display_number && removeSpaces(props.dataCamValue.tipombox) === "axxon") {
					axios.post(constants.api_axxon, body)
						.then(response => {
							if (response.data.success && response.data.data && response.data.data.length > 0) {
								let newSrc = constants.server_axxon + response.data.data[0].hls;
								setSrc(newSrc);
								_handleCreatePlayer(newSrc);
							} else {
								setSrc(props.src);
								_handleCreatePlayer(props.src);
							}
						})
						.catch(err => console.log(err));
				}
				else {
					setSrc(props.src);
					_handleCreatePlayer(props.src);
				}
			}
			else {
				setSrc(props.src);
				_handleCreatePlayer(props.src);
			}

		} else KNSFunctions.GetHlsStream(props).then((res) => setAmazonSrc(res));
	}, []);
	useEffect(() => {
		if (amazonSrc) {
			if (amazonSrc.HLSStreamingSessionURL) {
				setSrc(amazonSrc.HLSStreamingSessionURL);
				_handleCreatePlayer(amazonSrc.HLSStreamingSessionURL);
			} else _handleCreatePlayer(props.src);
		}
	}, [amazonSrc]);
	useEffect(() => {
		if (player !== null) {
			_loadPlayer();
			setLoading(false);
		}
		return () => {
			if (player) player.destroy();
		};
	}, [player]);

	// Functions
	const _handleCreatePlayer = async (src = null) => {
		if (props.dataCamValue && props.dataCamValue.display_number) {
			setTimeout(async () => {
				if (player) await player.destroy();
				await _newPlayer(src);
			}, 5000);
		} else {
			if (player) await player.destroy();
			await _newPlayer(src);
		}
	};
	const _newPlayer = (src) => {
		let height = {};
		let width = { width: '100%' };
		if (props.height) height.height = props.height;
		if (props.width) width.width = props.width;
		let newPlayer = new Clappr.Player({
			// this is an example url - for this to work you'll need to generate fresh token
			source: src,
			//source  : 'http://34.235.144.27:8080/hls/camp01.m3u8',
			parentId: '#player' + props.num_cam,
			...width,
			...height,
			autoPlay: true,
			mute: true,
			hideVolumeBar: true,
			strings: {
				'en': {
					'default_error_title': 'High latency.',
					'default_error_message': 'Will come back soon.',
				},
			},
			playback: {
				playInline: true,
				hlsjsConfig: {
					autoStartLoad: true,
					startPosition: -1,
					debug: false,
					capLevelOnFPSDrop: false,
					capLevelToPlayerSize: false,
					defaultAudioCodec: undefined,
					initialLiveManifestSize: 1,
					maxBufferLength: 10,
					maxMaxBufferLength: 100,
					maxBufferSize: 10 * 1000 * 1000,
					maxBufferHole: 0.5,
					lowBufferWatchdogPeriod: 0.5,
					highBufferWatchdogPeriod: 3,
					nudgeOffset: 0.1,
					nudgeMaxRetry: 3,
					maxFragLookUpTolerance: 0.25,
					liveSyncDurationCount: 3,
					liveMaxLatencyDurationCount: Infinity,
					liveDurationInfinity: false,
					liveBackBufferLength: Infinity,
					enableWorker: true,
					enableSoftwareAES: true,
					manifestLoadingTimeOut: 10000,
					manifestLoadingMaxRetry: 1,
					manifestLoadingRetryDelay: 1000,
					manifestLoadingMaxRetryTimeout: 64000,
					startLevel: undefined,
					levelLoadingTimeOut: 10000,
					levelLoadingMaxRetry: 4,
					levelLoadingRetryDelay: 1000,
					levelLoadingMaxRetryTimeout: 64000,
					fragLoadingTimeOut: 20000,
					fragLoadingMaxRetry: 6,
					fragLoadingRetryDelay: 1000,
					fragLoadingMaxRetryTimeout: 64000,
					startFragPrefetch: false,
					testBandwidth: true,
					fpsDroppedMonitoringPeriod: 5000,
					fpsDroppedMonitoringThreshold: 0.2,
					appendErrorMaxRetry: 3,
					enableWebVTT: true,
					enableCEA708Captions: true,
					stretchShortVideoTrack: false,
					forceKeyFrameOnDiscontinuity: true,
					xhrSetup: function (xhr, url) {

						if (props.infoServer.autenticacion === 1) {
							const { infoServer } = props;
							if (infoServer.secretkey) {
								xhr.withCredentials = false;

								let splitformta = url.split("?")

								xhr.open('GET', splitformta[0] + String(props.infoServer.secretkey));
							} else if (infoServer.password && infoServer.user) {
								const password = infoServer.password;
								const user = infoServer.user;
								xhr.withCredentials = true;
								xhr.open("GET", url, true);
								xhr.setRequestHeader("Authorization", "Basic " + Buffer.from(`${user}:${password}`).toString('Base64'));
								xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
								xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
								xhr.onload = function (e) {
									if (xhr.status == 401) {
										console.log("onload:", xhr.status)
									}
								};

								xhr.onerror = (e) => {
									if (xhr.status == 401) {
										console.log("onerror:", xhr.status)
									}
								};
							}
						}
						else if (props.dataCamValue && props.dataCamValue.display_number && src !== props.src) {
							const password = "root";
							const user = "root";
							xhr.withCredentials = true;
							xhr.open("GET", url, true, user, password);
							xhr.setRequestHeader("Authorization", "Basic " + Buffer.from(`${user}:${password}`).toString('Base64'));
							xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
							xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
							xhr.onload = function (e) {
								if (xhr.status == 401 || xhr.status == 404) {
									console.log("onload:", xhr)
									console.log("onload:", xhr.status)
								}
							};

							xhr.onerror = (e) => {
								if (xhr.status == 401) {
									console.log("onerror:", xhr.status)
								}
							};
						}
					},
				}
			},
			preload: 'metadata'
		});
		setPlayer(newPlayer);
	};
	const _loadPlayer = () => {
		player.on(Clappr.Events.PLAYER_ERROR, (err) => {
			// props.setCountError && props.setCountError(props.dataCamValue.num_cam);
			console.log('error en el player', err);
			console.log('error en el player code', err.code);
			if (
				err.code === 'hls:3' ||
				err.code === 'hls:networkError_levelLoadTimeOut' ||
				err.code === 'hls:networkError_levelLoadError' ||
				err.code === 'hls:networkError_manifestLoadTimeOut'
			) {
				console.log('network error', src);
				player.load(src);
				player.play();
			}
		});
	};

	return (
		<div>
			<div
				className={loading ? 'd-none' : null}
				id={`player${props.num_cam}`}
				style={{ height: props.height ? props.height : '100%' }}
			/>
			{loading && (
				<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "360px" }}>
					<Spinner animation="border" variant="info" role="status" size="xl">
						<span className="sr-only">Loading...</span>
					</Spinner>
				</div>
			)}
		</div>
	);
};

export default HlsPlayer;
