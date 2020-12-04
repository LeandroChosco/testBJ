import React, { Component } from 'react';
import videojs from 'video.js';

import '@videojs/http-streaming';
import 'videojs-flash'; //No quitar este import, con este funciona el reproductor con flash
import './style.css';

class VideoPlayer extends Component {
	state = {
		player: null
	};

	componentDidMount() {
		this._loadPLayer();
	}
	componentWillUnmount() {
		let { player } = this.state;
		if (player) player.dispose();
	}

	render() {
		let { id, src } = this.props;

		return (
			<div id={`div-video-player${id}`}>
				<div>
					<video
						autoPlay
						controls
						id={`video-player${id}`}
						preload="auto"
						className="video-js vjs-default-skin vjs-big-play-centered"
					>
						<source src={src} type="video/mp4" />
					</video>
				</div>
			</div>
		);
	}

	// -- Funciones --
	_loadPLayer = () => {
		let { id } = this.props;
		let width = (document.getElementById(`div-video-player${id}`).offsetWidth) + 200;
		let height = (document.getElementById(`video-player${id}`).offsetHeight) + 150;
		const player = videojs(`video-player${id}`, {
			width,
			height,
			controls: true,
			liveui: true,
			autoplay: true,
			flash: {
				flashVars: {
					rtmpBufferTime: 100
				}
			},
			techOrder: [ 'flash', 'html5' ],
			controlBar: {
				children: [ 'playToggle', 'timeDivider', 'fullscreenToggle' ]
			},
			language: 'es'
		});
		this.setState({ player: player });
	};
}

export default VideoPlayer;
