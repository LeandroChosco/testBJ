import React, { useState, useEffect } from 'react';
import Clappr from 'clappr';

import Spinner from 'react-bootstrap/Spinner';
import * as KNSFunctions from '../../functions/getAmazonKinesis';

const HlsPlayer = (props) => {
	const [ src, setSrc ] = useState(null);
	const [ player, setPlayer ] = useState(null);
	const [ loading, setLoading ] = useState(false);
	const [ amazonSrc, setAmazonSrc ] = useState(null);

	useEffect(() => {
		setLoading(true);
		if (!props.channelARN) {
			setSrc(props.src);
			_handleCreatePlayer(props.src);
		} else KNSFunctions.GetHlsStream(props).then((res) => setAmazonSrc(res));
	}, []);
	useEffect(() => {
		if (amazonSrc) {
			if (amazonSrc.HLSStreamingSessionURL) {
				setSrc(amazonSrc.HLSStreamingSessionURL);
				_handleCreatePlayer(amazonSrc.HLSStreamingSessionURL);
			} else _handleCreatePlayer(props.src);
		}
	}, [ amazonSrc ]);
	useEffect(() => {
		if (player !== null) {
			_loadPlayer();
			setLoading(false);
		}
		return () => {
			if (player) player.destroy();
		};
	}, [ player ]);

	// Functions
	const _handleCreatePlayer = async (src = null) => {
		if (player) await player.destroy();
		await _newPlayer(src);
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
			hideVolumeBar: true,
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
					forceKeyFrameOnDiscontinuity: true
				}
			},
			preload: 'metadata'
		});
		setPlayer(newPlayer);
	};
	const _loadPlayer = () => {
		player.on(Clappr.Events.PLAYER_ERROR, (err) => {
			console.log('error en el player', err);
			console.log('error en el player code', err.code);
			if (
				err.code === 'hls:3' ||
				err.code === 'hls:networkError_levelLoadTimeOut' ||
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
				<Spinner animation="border" variant="info" role="status" size="xl">
					<span className="sr-only">Loading...</span>
				</Spinner>
			)}
		</div>
	);
};

export default HlsPlayer;
