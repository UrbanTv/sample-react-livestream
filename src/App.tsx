import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import videojs, { VideoJsPlayer } from "video.js";
import {
	registerIVSQualityPlugin,
	VideoJSQualityPlugin,
} from "amazon-ivs-player";

const createAbsolutePath = (assetPath: string) =>
	new URL(assetPath, document.URL).toString();

// register the tech with videojs

function App() {
	const [showLiveStream, setShowLiveStream] = useState(false);
	const [vjsPlayer, setVjsPlayer] = useState(null);
	const videoPlayerRef = useRef(null);
	const rtmpURL =
		"https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8";

	useEffect(() => {
		const mediaPlayerScript = document.createElement("script");

		mediaPlayerScript.src =
			"https://player.live-video.net/1.3.1/amazon-ivs-videojs-tech.min.js";
		mediaPlayerScript.async = false;
		mediaPlayerScript.onload = () => {
			mediaPlayerScriptLoaded();
		};

		document.body.appendChild(mediaPlayerScript);
	}, []);

	const mediaPlayerScriptLoaded = () => {
		// This shows how to include the Amazon IVS Player with a script tag from our CDN
		// If self hosting, you may not be able to use the create() method since it requires
		// that file names do not change and are all hosted from the same directory.

		//@ts-ignore
		const registerIVSTech = window.registerIVSTech;
		registerIVSTech(videojs);
		registerIVSQualityPlugin(videojs);

		var player = videojs(
			"aws-live",
			{
				techOrder: ["AmazonIVS"],
				controlBar: {
					pictureInPictureToggle: false, // Hides the PiP button
				},
			},
			() => {
				console.log("Player is ready to use!");
				// Play stream

				const videoContainerEl = document.querySelector("#aws-live");
				videoContainerEl!.addEventListener("click", () => {
					if (player.paused()) {
						videoContainerEl!.classList.remove("vjs-has-started");
					} else {
						videoContainerEl!.classList.add("vjs-has-started");
					}
				});

				player.enableIVSQualityPlugin();
				player.volume(0.5);
				player.src(rtmpURL);
			}
		) as VideoJsPlayer & VideoJSQualityPlugin;
		// First, check if the browser supports the Amazon IVS player.
	};

	return (
		<div className="App">
			<button onClick={() => setShowLiveStream(!showLiveStream)}>
				Show live stream..
			</button>
			<div
				style={{
					width: "600px",
					height: "480px",
					margin: "15px",
					display: showLiveStream ? "flex" : "none",
				}}
			>
				<video
					ref={videoPlayerRef}
					id="aws-live"
					className="video-js vjs-4-3 vjs-big-play-centered"
					muted
					controls
					autoPlay
					playsInline
				></video>
			</div>
		</div>
	);
}

export default App;

// const mediaPlayerScriptLoaded = () => {
//   // This shows how to include the Amazon IVS Player with a script tag from our CDN
//   // If self hosting, you may not be able to use the create() method since it requires
//   // that file names do not change and are all hosted from the same directory.

//   const MediaPlayerPackage = window.IVSPlayer;
//   // First, check if the browser supports the Amazon IVS player.
//   if (!MediaPlayerPackage.isPlayerSupported) {
//     console.warn(
//       "The current browser does not support the Amazon IVS player."
//     );
//     return;
//   }

//   const PlayerState = MediaPlayerPackage.PlayerState;
//   const PlayerEventType = MediaPlayerPackage.PlayerEventType;

//   // Initialize player
//   const player = MediaPlayerPackage.create();
//   player.attachHTMLVideoElement(document.getElementById("aws-live"));

//   // Attach event listeners
//   player.addEventListener(PlayerState.PLAYING, () => {
//     console.log("Player State - PLAYING");
//   });
//   player.addEventListener(PlayerState.ENDED, () => {
//     console.log("Player State - ENDED");
//   });
//   player.addEventListener(PlayerState.READY, () => {
//     console.log("Player State - READY");
//   });
//   player.addEventListener(PlayerEventType.ERROR, (err) => {
//     console.warn("Player Event - ERROR:", err);
//   });

//   // Setup stream and play
//   player.setAutoplay(true);
//   player.load(rtmpURL);
//   player.setVolume(0.5);
//   player.play();
// };
