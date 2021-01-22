import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'semantic-ui-react';
import { useLongPress } from 'use-long-press';
import moment from 'moment-timezone';

import Spinner from 'react-bootstrap/Spinner';
import conections from '../../conections';
import './style.css';

const TIMEOUT = [ 0.3, 0.6, 1 ];
const ControlPTZ = (/*props*/) => {
	const [ ip, setIp ] = useState(null);
	const [ ptcl, setPtcl ] = useState(null);
	const [ port, setPort ] = useState(null);
	const [ user, setUser ] = useState(null);
	const [ pass, setPass ] = useState(null);
	const [ profile, setProfile ] = useState('');
	const [ loading, setLoading ] = useState(true);
	const [ startTime, setStartTime ] = useState(null);
	const [ timeout, setTimeout ] = useState(TIMEOUT[0]);

	useEffect(() => {
		async function fetchData() {
			// let { camera } = props;
			// console.log('inDidMount', camera);
			let params = { ip: '172.31.86.15', ptcl, port, user: 'admin', pass: 'ENGTK2010!' };
			let dataProfile = await conections.getProfilePTZ(params);
			params.ProfileToken = dataProfile.data ? dataProfile.data.token : '';
			setIp(params.ip);
			setPtcl(params.ptcl);
			setPort(params.port);
			setUser(params.user);
			setPass(params.pass);
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
			name = data[1];
		}
		return name;
	};
	const getDirection = (direction) => {
		let m = { x: 0, y: 0, z: 0 };
		switch (direction) {
			case 'plus': m.z = timeout; break;
			case 'minus': m.z = -timeout; break;
			case 'left': m.x = -timeout; break;
			case 'right': m.x = timeout; break;
			default:
				break;
		}
		return m;
	};

	// Move PTZ
	const continuous = async (direction, isLong = false) => {
		console.log(timeout, direction);
		let vel = getDirection(direction);
		let time = isLong ? 0 : moment().diff(startTime, 'seconds') + 1;
		let params = { ip, ptcl, port, user, pass, ProfileToken: profile, Velocity: vel, Timeout: time };
		await conections.continuousMovePTZ(params);
	};

	const stop = async () => {
		console.log('Deja de Presionar **');
		let params = { ip, ptcl, port, user, pass, ProfileToken: profile, PanTilt: true, Zoom: true };
		await conections.stopPTZ(params);
		console.log('Parar');
	};

	return (
		<>
			{loading ? (
				<div>
					<Spinner animation="border" variant="info" role="status" size="xl">
						<span className="sr-only">Loading...</span>
					</Spinner>
				</div>
			) : (
				<div className="main-container">
					<div className="outer">
						<div className="inner" />
						<Button
							{...bind}
							circular
							name="plus"
							icon="search plus"
							style={{ ...styles.icon, ...styles.plus }}
						/>
						<Button
							{...bind}
							circular
							name="minus"
							icon="search minus"
							style={{ ...styles.icon, ...styles.minus }}
						/>
						<Button
							{...bind}
							circular
							name="left"
							icon="arrow left"
							style={{ ...styles.icon, ...styles.left }}
						/>
						<Button
							{...bind}
							circular
							name="right"
							icon="arrow right"
							style={{ ...styles.icon, ...styles.right }}
						/>
					</div>
					<div>
						Velocidades
						<div className="buttons">
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
	plus: { top: '4%', left: '42%' },
	minus: { top: '77%', left: '42%' },
	left: { top: '41%', left: '3%' },
	right: { top: '41%', left: '78%' },
	button: { fontSize: '18px', margin: '1px' }
};
