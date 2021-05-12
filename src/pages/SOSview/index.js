import React, { Component } from 'react';
import { Card, Icon, Input, Dropdown, Tab } from 'semantic-ui-react';
import moment from 'moment';
import _ from 'lodash';
import './style.css';

import { getTracking, MESSAGES_COLLECTION, SOS_COLLECTION } from '../../Api/sos';
import MapContainer from '../../components/MapContainer';
import firebaseSos from '../../constants/configSOS';
import FadeLoader from 'react-spinners/FadeLoader';

const refSOS = firebaseSos.app('sos').firestore().collection(MESSAGES_COLLECTION);
const COLORS = {
	Seguridad: '#FFB887',
	'Protección Civil': '#E29EE8',
	'Emergencia Médica': '#9EE8A7',
	'Proteccion Policial': '#FFB887',
	'Seguimiento Por Hora': '#00B4C0',
	'Seguimiento Por Destino': '#00D2A6'
};
const SEARCHOPTIONS = [
	{ key: 'name', text: 'Nombre de Usuario', value: 'name' },
	{ key: 'date', text: 'Fecha', value: 'date' }
];

class Chat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: [],
			chats: [],
			activeIndex: 0,
			chatId: '',
			text: '',
			from: '',
			fisrt: {},
			searching: '',
			tracking: {},
			camData: undefined,
			loading: false,
			hashUsed: false,
			personalInformation: {},
			optionSelected: 'name',
			marker: null,
			firebaseSub: null,
			flagUpdate: 0
		};
	}
	panes = this.props.history.location.pathname.includes('sos')
		? [
				{
					menuItem: 'Seguridad',
					render: () => <Tab.Pane attached={false} style={styles.tab}>{this.renderListChats('Seguridad')}</Tab.Pane>
				},
				{
					menuItem: 'Protección Civil',
					render: () => <Tab.Pane attached={false} style={styles.tab}>{this.renderListChats('Protección Civil')}</Tab.Pane>
				},
				{
					menuItem: 'Emergencia Médica',
	        render: () => <Tab.Pane attached={false} style={styles.tab}>{this.renderListChats('Emergencia Médica')}</Tab.Pane>
				}
			]
		: [
				{
					menuItem: 'Por Hora',
					render: () => <Tab.Pane attached={false} style={styles.tab}>{this.renderListChats('Seguimiento Por Hora')}</Tab.Pane>
				},
				{
					menuItem: 'Por Seguimiento',
					render: () => <Tab.Pane attached={false} style={styles.tab}>{this.renderListChats('Seguimiento Por Destino')}</Tab.Pane>
				}
			];
	FILTERSOPTIONS = this.props.history.location.pathname.includes('sos')
		? [ 'Seguridad', 'Protección Civil', 'Emergencia Médica' ]
		: [ 'Seguimiento Por Hora', 'Seguimiento Por Destino' ];

	// LIFECYCLES
	componentDidMount() {
		const { tabIndex } = this.props.match.params;
		let { activeIndex } = this.state;
		let { chats } = this.props;
		let filtered = [];

		if (chats) {
			if (tabIndex) filtered = chats.filter((item) => item.trackingType === this.FILTERSOPTIONS[tabIndex]);
			else filtered = chats.filter((item) => item.trackingType === this.FILTERSOPTIONS[activeIndex]);
			this.setState({ chats: filtered, activeIndex: tabIndex ? tabIndex : activeIndex });
		}
		let messageBody = document.querySelector('#messagesContainer');
		messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
	}
	componentDidUpdate(prevProps) {
		const { flagUpdate, activeIndex } = this.state;
		const { tabIndex, chatId } = this.props.match.params;
		const { chats: chatsPrev } = prevProps;
		const { chats } = this.props;

		if (flagUpdate === 0) {
			if (chats && chatsPrev && !_.isEqual(_.sortBy(chats), _.sortBy(chatsPrev))) {
				if (chatsPrev.length !== chats.length) this.setState({ chats });
				const nameType = this.FILTERSOPTIONS[Number(tabIndex ? tabIndex : activeIndex)];
				const filteredChats = chats.filter((e) => e.trackingType === nameType);
				this.setState({ chats: filteredChats, flagUpdate: 1 });
				if (chatId) {
					const idxChat = filteredChats.findIndex((e) => e.id === chatId);
					this.changeChat(filteredChats[idxChat], idxChat, false);
				}
			}
		}
		let messageBody = document.querySelector('#messagesContainer');
		messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
	}

	render() {
		const { tabIndex } = this.props.match.params;
		const { chats, chatId, index, from, loading, tracking } = this.state;
		if (index !== undefined && chatId === '' && chats.length > 0) {
			this.setState({ chatId: null });
		}

		const chatSelected = chats.find((item) => item.id === chatId);
		let textareaDisabled = null;
		if (chatSelected) {
			if (typeof chatSelected.active === 'undefined') textareaDisabled = false;
			else {
				if (chatSelected.active === 0) textareaDisabled = true;
				else textareaDisabled = false;
			}
		}
		return (
			<div className={!this.props.showMatches ? 'hide-matches app-container' : 'show-matches app-container'}>
				<div className="row fullHeight">
					<div className="col-4 userList">
						<Tab
							menu={{ pointing: true }}
							panes={this.panes}
							defaultActiveIndex={Number(tabIndex) || 0}
							onTabChange={(t, i) => {
								const { chats } = this.props;
								const { index } = this.state;
								let newChats = chats.filter((c) => c.trackingType === this.FILTERSOPTIONS[i.activeIndex]);
								let selected = null;
								if (index !== undefined) {
									if (newChats.length !== 0 && newChats[index]) {
										selected = newChats[index].trackingType;
										if (typeof newChats[index].panic_button_uuid === 'string' && selected === 'Seguridad') {
											selected += ' botón físico';
										} else {
											if (selected === 'Seguridad') {
												selected += ' botón virtual';
											}
										}
									} else {
										selected = newChats[0].trackingType;
									}
									// let selected = newChats.length !== 0 && newChats[index] ? newChats[index].trackingType : newChats[0].trackingType;
									this.setState({ from: selected ? selected : 'Error getting data' });
								}
								this.setState({ chats: newChats, activeIndex: i.activeIndex, index: null });
							}}
						/>
					</div>
					<div className="col-8">
						<div className="messages" style={{ height: '88%' }}>
							{!loading && chatId !== '' && chats[index] ? (
								<div className="cameraView">
									<h2
										className={'Chat C5'}
										style={{
											textAlign: 'center',
											backgroundColor: COLORS[chats[index].trackingType],
											height: '30px'
										}}
									>
										{from}
									</h2>
									<div className="row" style={{ height: '70%', margin: 0 }}>
										<div className="col" style={{ height: '100%' }}>
											{Object.keys(tracking).length !== 0 &&
											tracking.pointCoords && (
												<MapContainer
													options={{
														center: {
															lat: parseFloat(tracking.pointCoords[tracking.pointCoords.length - 1].latitude),
															lng: parseFloat(tracking.pointCoords[tracking.pointCoords.length - 1].longitude)
														},
														zoom: 15,
														mapTypeId: 'roadmap',
														zoomControl: false,
														mapTypeControl: false,
														streetViewControl: false,
														fullscreenControl: false,
														openConfirm: false,
														typeConfirm: false,
														openSelection: false,
														checked: ''
													}}
													coordsPath={tracking.pointCoords}
													onMapLoad={this._onMapLoad}
												/>
											)}
										</div>
									</div>

									<div className="row" style={{ height: '20%', width: '100%', margin: 0, marginTop: '5px' }}>
										<Card style={{ width: '100%' }}>
											<Card.Content>
												<div className="row">
													<div className="col-8">
														<div className="row" style={{ padding: '5px' }}>
															<div className="col-6" style={{ fontSize: 13, paddingRight: 0 }}>
																<b>Nombre: </b>
																{chats[index].user_name}
															</div>
															<div
																style={{
																	fontSize: 13,
																	paddingLeft: 0,
																	paddingRight: 0
																}}
																className="col-3"
															>
																<b>Celular: </b>
																{this.state.personalInformation.Contact.phone}
															</div>
															<div
																style={{
																	fontSize: 13,
																	paddingLeft: 0,
																	paddingRight: 0
																}}
																className="col-3"
															/>
														</div>
														<div className="row textContainer" style={{ paddingTop: 0 }} />
													</div>
													<div className="col-4" style={{ margin: 'auto' }}>
														<br />
													</div>
												</div>
											</Card.Content>
										</Card>
									</div>
								</div>
							) : null}
						</div>
						<div className="messagesContainer" id="messagesContainer">
							{!loading && chatId !== '' && chats[index] ? chats[index].messages ? (
								this.state.messages.map((value, ref) => (
									<div
										key={ref}
										className={value.from === 'user' ? 'user' : 'support'}
										ref={ref === chats[index].messages.length - 1 ? 'message' : 'message' + ref}
										id={ref === chats[index].messages.length - 1 ? 'lastMessage' : 'message' + ref}
									>
										<p>{value.msg}</p>
										<small>
											{value.dateTime.toDate ? moment(value.dateTime.toDate()).format('DD-MM-YYYY, HH:mm:ss') : null}
										</small>
									</div>
								))
							) : loading === true ? (
								<>
									<FadeLoader height={20} width={7} radius={20} margin={5} loading={loading} css={styles.centered} />
									<p style={{ position: 'fixed', top: '56%', left: '62%' }}>Cargando chat</p>
								</>
							) : (
								<p style={{ position: 'fixed', top: '50%', left: '60%' }}>No se ha seleccionado ningun chat</p>
							) : loading === true ? (
								<>
									<FadeLoader height={20} width={7} radius={20} margin={5} loading={loading} css={styles.centered} />
									<p style={{ position: 'fixed', top: '56%', left: '62%' }}>Cargando chat</p>
								</>
							) : (
								<p style={{ position: 'fixed', top: '50%', left: '60%' }}>No se ha seleccionado ningun chat</p>
							)}
						</div>
						{chatId !== '' && chats[index] ? (
							<div className="messages_send_box">
								{!textareaDisabled ? (
									<div style={{ position: 'relative' }}>
										<textarea
											disabled={textareaDisabled}
											placeholder="Escriba su mensaje"
											name="text"
											autoComplete="on"
											autoCorrect="on"
											id="messsageTextarea"
											value={this.state.text}
											onKeyPress={this.checkKey}
											onChange={(event) => {
												this.setState({ text: event.target.value });
											}}
										/>
										<Icon name="send" id="sendbutton" onClick={this.sendMessage} />
									</div>
								) : (
									<div className="closed-ticked">El ticket ya se encuentra cerrado</div>
								)}
							</div>
						) : null}
					</div>
				</div>
			</div>
		);
	}

  renderListChats = (type) => {
		const { index, chats } = this.state;

		return (
			<div>
				<div style={{ display: 'flex', flexDirection: 'row' }}>
					<Input placeholder="Buscar alertas" style={{ flex: 2 }} onChange={this.filterAction} />
					<Dropdown
						placeholder="Buscar por"
						fluid
						selection
						options={SEARCHOPTIONS}
						defaultValue="name"
						onChange={this.handleChangeOption}
						style={{ flex: 1 }}
					/>
				</div>

				{chats.map((chat, i) => {
					const date =
						chat && chat.create_at
							? moment(chat.create_at).format('DD-MM-YYYY, HH:mm:ss')
							: typeof chat.lastModification === 'string'
								? moment(chat.lastModification).format('DD-MM-YYYY, HH:mm:ss')
								: moment(chat.lastModification.toDate()).format('DD-MM-YYYY, HH:mm:ss');
					return (
						<Card
							className={i === index ? 'activeChat' : ''}
							style={{ width: '100%' }}
							key={i}
							onClick={() => this.changeChat(chat, i)}
						>
							<Card.Content>
								<div style={{ position: 'relative' }}>
									<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
										<h4>{chat.user_name}</h4> <p>{date}</p>
									</div>
									{chat.active !== undefined && chat.active ? (
										<p>
											{chat.messages ? chat.messages.length > 0 ? (
												(chat.messages[chat.messages.length - 1].from === 'user'
													? chat.user_name.split(' ')[0]
													: 'C5') +
												': ' +
												chat.messages[chat.messages.length - 1].msg //msg
											) : (
												'No hay mensajes que mostart'
											) : (
												'No hay mensajes que mostart'
											)}
										</p>
									) : (
										<p />
									)}

									{chat.c5Unread !== undefined && chat.c5Unread !== 0 ? (
										<div className="notificationNumber" style={{ marginTop: 15 }}>
											<p>{chat.c5Unread}</p>
										</div>
									) : null}
									<div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
										{/* <small style={{ ...styles.badge, backgroundColor: COLORS[chat.trackingType], }}> <strong>{chat.trackingType}</strong> </small> */}
										<div>
											{' '}
											<small style={{ ...styles.badge, marginLeft: 3, alignSelf: 'flex-end', display: 'flex' }}>
												{' '}
												<Icon name={chat.active ? 'clock' : 'checkmark'} />{' '}
												<strong>{chat.active ? 'Proceso' : 'Cerrado'}</strong>{' '}
											</small>
										</div>
									</div>
								</div>
							</Card.Content>
						</Card>
					);
				})}
			</div>
		);
	};

  filterAction = (event) => {
		const { target: { value } } = event;
		const { activeIndex } = this.state;
		const { chats: chatsProps } = this.props;
		const { optionSelected, searching } = this.state;
		this.setState({ searching: value.trim() }, () => {
			const filterData = chatsProps.filter((c) => c.trackingType === this.FILTERSOPTIONS[activeIndex]);
			let expresion = new RegExp(`${searching}.*`, 'i');
			if (searching.trim().length !== 0) {
				let newFilterSearch;
				if (optionSelected === 'alertType') {
					newFilterSearch = filterData.filter((c) => c.trackingType && expresion.test(c.trackingType));
				} else if (optionSelected === 'date') {
					newFilterSearch = filterData.filter((c) =>
						expresion.test(moment(moment(c.create_at)).format('DD-MM-YYYY, HH:mm:ss'))
					);
				} else if (optionSelected === 'name') {
					newFilterSearch = filterData.filter((c) => expresion.test(c.user_name));
				}
				this.setState({ chats: newFilterSearch });
			}
			if (value.trim().length === 0) {
				let newChats = this.props.chats.filter((c) => c.trackingType === this.FILTERSOPTIONS[this.state.activeIndex]);
				this.setState({ chats: newChats });
			}
		});
	};

	handleChangeOption = (e, { value }) => this.setState({ optionSelected: value });

	_onMapLoad = (map) => {
		const { chats } = this.props;
		const { index, tracking, marker } = this.state;
		const coords = {
			lat: parseFloat(tracking.pointCoords[tracking.pointCoords.length - 1].latitude),
			lng: parseFloat(tracking.pointCoords[tracking.pointCoords.length - 1].longitude)
		};

		let _marker = null;

		if (!marker) {
			_marker = new window.google.maps.Marker({
				position: coords,
				map: map,
				title: chats[index].user_nicename
			});
		} else {
			if (tracking.active) {
				_marker = Object.assign(marker, {});
				_marker.setPosition(coords);
				_marker.setMap(map);
			} else {
				_marker = new window.google.maps.Marker({
					position: coords,
					map: map,
					title: chats[index].user_nicename
				});
			}
		}
		this.setState({ map, marker: _marker });
	};

	changeChat = (chat, i, flag = true) => {
    let { history, stopNotification } = this.props;
    const nameRoute = history.location.pathname.includes('sos') ? 'sos' : 'seguimiento';

		if (flag) {
			history.push(`/${nameRoute}/${this.state.activeIndex}/${chat.id}`);
		}
		if (chat === undefined && i === -1) {
			history.push(`/${nameRoute}`);
		} else {
			this.getMessages(chat.id);
			this.setState({ loading: true, camData: undefined }, async () => {
				stopNotification();
				const trackingInformation = await getTracking(chat.trackingId);

				let newData = trackingInformation.data.data();

				newData = {
					...newData,
					id: trackingInformation.data.id
				};
				const aux =
					newData.SOSType && newData.SOSType === 'Seguridad'
						? newData.panic_button_uuid !== null
							? `${newData.SOSType} botón físico`
							: `${newData.SOSType} botón virtual`
						: newData.SOSType;
				this.setState({
					// chatId: chat.id,
					// messages: chat.messages,
					index: i,
					from: aux, //
					tracking: newData,
					loading: false,
					personalInformation: newData.userInformation, //
					pointCoords: [] //
				});

				if (chat.active) {
					const unsub = firebaseSos.app('sos').firestore().collection(SOS_COLLECTION).onSnapshot((docs) => {
						const track_changes = docs.docChanges();
						if (track_changes.length === 1) {
							const updatedChatId = track_changes[0].doc.id;
							const track_data = track_changes[0].doc.data();
							if (chat.trackingId === updatedChatId) {
								if (chat.active) {
									this.setState({ tracking: track_data });
								}
							}
						}
					});
					this.setState({ firebaseSub: unsub });
				} else {
					// this.state.firebaseSub();
				}
				refSOS.doc(chat.id).update({ c5Unread: 0 }).then(() => {
					this.setState({ text: '' });
				});
			});
		}
	};

	getMessages = (chatId) => {
		this.messageListener = refSOS.doc(chatId).onSnapshot((snapShot) => {
			const chat_data = snapShot.data();
			chat_data['id'] = snapShot.id;
			const current_chat = [ ...this.state.chats ];
			const chat_index = current_chat.findIndex((item) => item.id === chatId);
			if (chat_index >= 0) {
				current_chat[chat_index] = chat_data;
			}
			this.setState({ messages: snapShot.get('messages'), chatId, chats: current_chat });
		});
	};

	checkKey = (event) => {
		let key = window.event.keyCode;
		if (key === 13) {
			this.sendMessage();
			return false;
		} else {
			return true;
		}
	};

	closeChat = () => {
		/*let {chats} = this.props
     */
	};

	sendMessage = () => {
		if (this.state.text === '') return;
		const { chatId, messages } = this.state;

		let messagesAux = messages.map((e) => e);

		messagesAux.push({
			from: 'support',
			dateTime: new Date(),
			msg: this.state.text
		});

		this.props.stopNotification();

		refSOS
			.doc(chatId)
			.update({
				messages: messagesAux,
				from: 'Chat C5',
				userUnread: this.props.chats[this.state.index].userUnread
					? this.props.chats[this.state.index].userUnread + 1
					: 1,
				policeUnread: this.props.chats[this.state.index].policeUnread
					? this.props.chats[this.state.index].policeUnread + 1
					: 1
			})
			.then(() => {
				this.setState({ text: '' });
			});
	};

	QueryStringToJSON(query) {
		query = query.replace('?', '');
		let pairs = query.split('&');

		let result = {};
		pairs.forEach(function(pair) {
			pair = pair.split('=');
			result[pair[0]] = decodeURIComponent(pair[1] || '');
		});

		return JSON.parse(JSON.stringify(result));
	}
}

export default Chat;

const styles = {
	badge: {
		paddingLeft: 3,
		paddingRight: 3,
		borderRadius: 3,
		fontSize: 10,
		paddingTop: 2,
		paddingBottom: 2
	},
	tab: {
		backgroundColor: '#dadada',
		borderWidth: 0,
		borderColor: '#dadada'
	},
	centered: {
		left: '51%'
	}
};
