# MMM-NotificationTranslator #
MMM-NotificationTranslator is a module for the [MagicMirror](https://github.com/MichMich/MagicMirror) project by [Michael Teeuw](https://github.com/MichMich).

The aim is to "translate" notifications. In my very special case i use the same sensors to control either MMM-MplayerRadio, MMM-Spotify or MMM-SynologySurveillance depending of the current profile and the "state" of the modules.

My MMM-Serial-Notifications module simply sends an "NEXT", "PREVIOUS" or "TOGGLE" notification and the MMM-NotificationTranslator decides which specific notification should be send.
The state of MMM-NotificationTranslator depends of the previously received notifications.

# Configuration #
The configuration of the module can be get complex very quickly because you need to decide on which notifications to change the state and which actions should happen on on which one, too.

The following example is the configuration i use in my setup:
```json5
        {
			module: "MMM-NotificationTranslator",
			config: {
				actions: {
					"NEXT": { //Notification
						"mplayer"	: { //Current state
							notification: "RADIO_NEXT",
						},
						"spotify"	: {
							notification: "SPOTIFY_NEXT",
						},
						"ss"		: {
							notification: "SYNO_SS_NEXT_CAM",
						}
					},
					"PREVIOUS" : {
						"mplayer"	: {
							notification: "RADIO_PREVIOUS",
						},
						"spotify"	: {
							notification: "SPOTIFY_PREVIOUS",
						},
						"ss"		: {
							notification: "SYNO_SS_PREVIOUS_CAM",
						}
					},
					"TOGGLE" : {
						"mplayer"	: {
							notification: "RADIO_TOGGLE",
						},
						"spotify"	: {
							notification: "SPOTIFY_TOGGLE",
						}
					}
				},
				notifications: {
					"RADIO_PLAYING" : {
						newState: "mplayer",
					},
					"RADIO_PREVIOUS" : {
						newState: "mplayer"
					},
					"RADIO_NEXT" : {
						newState: "mplayer"
					},
					"DONE_PLAY" : {
						newState: "spotify",
						sender: "MMM-Spotify"
					},
					"SPOTIFY_NEXT" : {
						newState: "spotifiy"
					},
					"SPOTIFY_PREVIOUS" : {
						newState: "spotify"
					},
					"CHANGED_PROFILE" : {
						payload: {
							to: {
								values: {
									"pageFourSyno"		: {
										newState: "ss"
									}
								},
							},
							from: {
								values: {
									"pageFourSyno"		: {
										lastState: true
									}
								}
							}
						}
					}
				}
			}
		},
```

## actions ##
Actions translate an incoming notification into an other notification depending on the state.
You can add an "default" state if you like.
The payload of the incoming notifcation will be added to the notification send (unmodified).

## notifications ##
The state of MMM-NotificationTranslator will change depending of the incoming notifications specified in this area.
If a "newState" is specified simply this one is set if notification is received.
If "payload" is present values in the payload can be checked.
The lastState option makes it possible to return to the last state if an notification is received. This option can either be used int he directly in the notification or in the payload part.