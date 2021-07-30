import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'semantic-ui-react';
import { useLongPress } from 'use-long-press';
import moment from 'moment-timezone';

import Spinner from 'react-bootstrap/Spinner';
import conections from '../../conections';
import './style.css';

const TIMEOUT = [ 0.3, 0.6, 0.9 ];
const ControlPTZ = (props) => {
	const [ ip, setIp ] = useState(null);
	const [ historyURL, sethistoryURL] = useState(null);
	const [ historyURLPort, sethistoryURLPort] = useState(null);
	const [ profile, setProfile ] = useState('');
	const [ loading, setLoading ] = useState(true);
	const [ startTime, setStartTime ] = useState(null);
	const [ timeout, setTimeout ] = useState(TIMEOUT[0]);
	const [ styleMap, setStyleMap ] = useState(false);
	const [ styleMatch, setStyleMatch ] = useState(false);
	const [ errorMessage, setErrorMessage ] = useState('');
	const [ disabledButtons, setDisabledButtons ] = useState({ x: false, y: false, z: false });

	useEffect(() => {
		async function fetchData() {
			let { camera, isInMap, hasMatch } = props;
			let params = { ip: camera.dataCamValue.camera_ip };
			let urlHistory = camera.urlHistory;
			let urlHistoryPort = camera.urlHistoryPort;

			let dataDevice = await conections.newOnvifDevice(urlHistory, urlHistoryPort, params);
			let dataProfile = await conections.getProfilePTZ(urlHistory, urlHistoryPort, params);
			params.ProfileToken = dataProfile.data ? dataProfile.data.token : '';
			if (!params.ProfileToken || params.ProfileToken === '')
				setErrorMessage('No se encontraron los recursos necesarios para poder controlar la camara.');
			else {
				if (dataDevice.data) {
					let rangePtz = dataDevice.data && dataDevice.data.current_profile &&
						dataDevice.data.current_profile.ptz && dataDevice.data.current_profile.ptz.range;
					if (rangePtz) {
						let disabled = { x: false, y: false, z: false };
						disabled.x = (!rangePtz.x.min && !rangePtz.x.max) || rangePtz.x.min === rangePtz.x.max;
						disabled.y = (!rangePtz.y.min && !rangePtz.y.max) || rangePtz.y.min === rangePtz.y.max;
						disabled.z = (!rangePtz.z.min && !rangePtz.z.max) || rangePtz.z.min === rangePtz.z.max;
						setDisabledButtons(disabled);
					}
				}
			}
			setIp(params.ip);
			sethistoryURL(urlHistory);
			sethistoryURLPort(urlHistoryPort);
			setStyleMap(isInMap);
			setStyleMatch(hasMatch);
			setProfile(params.ProfileToken);
			setLoading(false);
		}
		fetchData();
	}, []);

	// Long Press
	const callback = useCallback((event) => {
			if (!loading) continuous(getNameEvent(event), true);
	}, [ loading, timeout ]);
	const bind = useLongPress(callback, {
		onStart: () => setStartTime(moment()),
		onCancel: (event) => continuous(getNameEvent(event)),
		onFinish: () => stop(),
		captureEvent: true
	});

	// Functions
	const getNameEvent = (event) => {
		let name = event.target.name;
		if (!name) {
			let data = event.target.className.split(' ');
			name = data[1] === 'icon' ? data[0] : data[1];
		}
		return name;
	};	
	const getDirection = (direction) => {
		let m = { x: 0, y: 0, z: 0 };
		switch (direction) {
			case 'up': m.y = timeout; break;
			case 'down': m.y = -timeout; break;
			case 'right': m.x = timeout; break;
			case 'left': m.x = -timeout; break;
			case 'plus': m.z = timeout; break;
			case 'minus': m.z = -timeout; break;
			default: break;
		}
		return m;
	};

	// Move PTZ
	const continuous = (direction, isLong = false) => {
		let vel = getDirection(direction);
		let time = isLong ? 0 : moment().diff(startTime, 'seconds') + 1;
		let params = { ip, ProfileToken: profile, Velocity: vel, Timeout: time };
		conections.continuousMovePTZ(historyURL, historyURLPort, params);
	};

	const stop = () => {
		let params = { ip, ProfileToken: profile, PanTilt: true, Zoom: true };
		conections.stopPTZ(historyURL, historyURLPort, params);
	};

	return (
		<>
			{errorMessage !== '' ? (
				<div>
					{errorMessage}
				</div>
			) : loading ? (
				<div>
					<Spinner animation="border" variant="info" role="status" size="xl">
						<span className="sr-only">Loading...</span>
					</Spinner>
				</div>
			) : (
				<div className={styleMap ? 'map-container' : styleMatch ? 'match-container' : 'main-container'}>
					<div className="outer">
						<div className="inner">
							<div className="inner-left" style={{ ...styles.icon, ...styles.circleminus }}>
								<Button
									{...bind}
									circular
									name="minus"
									icon="search minus"
									style={{ ...styles.icon, ...styles.minus }}
									disabled={disabledButtons.z}
								/>
							</div>
							<div className="inner-right" style={{ ...styles.icon, ...styles.circleplus }}>
								<Button
									{...bind}
									circular
									name="plus"
									icon="search plus"
									style={{ ...styles.icon, ...styles.plus }}
									disabled={disabledButtons.z}
								/>
							</div>
						</div>
						<Button
							{...bind}
							circular
							name="up"
							icon="arrow up"
							style={{ ...styles.icon, ...styles.up }}
							disabled={disabledButtons.y}
						/>
						<Button
							{...bind}
							circular
							name="down"
							icon="arrow down"
							style={{ ...styles.icon, ...styles.down }}
							disabled={disabledButtons.y}
						/>
						<Button
							{...bind}
							circular
							name="left"
							icon="arrow left"
							style={{ ...styles.icon, ...styles.left }}
							disabled={disabledButtons.x}
						/>
						<Button
							{...bind}
							circular
							name="right"
							icon="arrow right"
							style={{ ...styles.icon, ...styles.right }}
							disabled={disabledButtons.x}
						/>
					</div>
					<div>
						Velocidades
						<div className={styleMap ? 'map-buttons' : styleMatch ? 'match-buttons' : 'main-buttons'}>
							<Button
								content="x1"
								style={styles.button}
								onClick={() => setTimeout(TIMEOUT[0])}
								active={timeout === TIMEOUT[0]}
							/>
							<Button
								content="x2"
								style={styles.button}
								onClick={() => setTimeout(TIMEOUT[1])}
								active={timeout === TIMEOUT[1]}
							/>
							<Button
								content="x3"
								style={styles.button}
								onClick={() => setTimeout(TIMEOUT[2])}
								active={timeout === TIMEOUT[2]}
							/>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ControlPTZ;

const styles = {
	icon: { fontSize: '18px', position: 'absolute' },
	circleplus: { top: '24%', left: '50.5%' },
	circleminus: { top: '24%', left: '23.5%' },
	plus: { left: '6%' },
	minus: { left: '10.5%' },
	up: { top: '2%', left: '40%' },
	down: { top: '78%', left: '40%' },
	left: { top: '40.5%', left: '1.5%' },
	right: { top: '40.5%', left: '78.5%' },
	button: { fontSize: '18px', margin: '1px' }
};
