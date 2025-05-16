"use client"

import { type FC, useEffect, useState } from "react"
import NotificationBanner from "./components/notification-banner"
import { GameState } from "@/lib/overwolf/gameService/types"
import useGameState from "@/hooks/useGameState"

const Screen: FC = () => {
	const gameState: GameState | undefined = useGameState()

	const [showBanner, setShowBanner] = useState(true)
	const [hasWelcomed, setHasWelcomed] = useState(false)

	const [bannerProps, setBannerProps] = useState({
		title: "",
		description: "",
		iconUrl: "",
		accentColor: "#00ff00",
	})

	useEffect(() => {
		if (gameState) {
			if (!hasWelcomed) {
				setBannerProps({
					title: "Welcome to the Game!",
					description: "Enjoy your time in the game!",
					iconUrl: "/next.svg",
					accentColor: "#00ff00",
				})
				setHasWelcomed(true)
			}

			if (gameState.live_client_data && gameState.live_client_data.game_data) {

				const one_minute = 60 * 1000
				const one_minute_and_a_half = 90 * 1000
				const thirty_seconds = 30 * 1000

				const time = gameState.live_client_data.game_data.gameTime
				const events = gameState.live_client_data.events

				const dragonTimer = [...events].reverse().find(e => e.EventName === "DragonKill")
				const baronTimer = [...events].reverse().find(e => e.EventName === "BaronKill")

				const isNextDragonAncient = dragonTimer?.DragonType === "Elder"

				const nextDragon = dragonTimer?.EventTime
					? dragonTimer.EventTime + 5 * 60 * 1000
					: 5 * 60 * 1000
				const nextBaron = baronTimer?.EventTime
					? baronTimer.EventTime + 5 * 60 * 1000
					: 20 * 60 * 1000
				const early_gank_time = (60 + 60 + 15) * 1000
				const full_clear_gank_time = (60 + 60 + 60) * 1000
				const second_clear_gank_time = (60 * 5) * 1000

				

			}

		}
	})

	const handleBannerClose = () => {
		setShowBanner(false)
	}

	return (
		<div className="absolute top-0 left-0 right-0 bottom-0">
			{showBanner && (
				<NotificationBanner
					title={bannerProps.title}
					description={bannerProps.description}
					iconUrl={bannerProps.iconUrl}
					accentColor={bannerProps.accentColor}
					onClose={handleBannerClose}
					autoClose={true}
					autoCloseDelay={5000} // 5 seconds
				/>
			)}
			{/* Button to show the banner again */}
			{/* {
				!showBanner && (
					<button
						className="mt-4 px-4 py-2 bg-slate-800 rounded-md hover:bg-slate-700"
						onClick={() => setShowBanner(true)}
					>
						Show Banner Again
					</button>
				)
			}

			{gameState && (
				<div className="mt-6 p-4 bg-gray-900 rounded-md overflow-auto max-h-96">
					<h2 className="text-lg font-bold mb-2 text-white">GameState JSON</h2>
					<pre className="text-xs text-green-300 whitespace-pre-wrap">
						{JSON.stringify(gameState?.live_client_data.events, null, 2)}
					</pre>
				</div>
			)} */}
		</div>
	)
}

export default Screen
