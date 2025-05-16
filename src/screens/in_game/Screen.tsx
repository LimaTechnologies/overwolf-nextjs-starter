"use client"

import { type FC, useEffect, useState } from "react"
import NotificationBanner from "./components/notification-banner"
import { GameState } from "@/lib/overwolf/gameService/types"
import useGameState from "@/hooks/useGameState"
import { LeagueOptions } from "./league_options"

const Screen: FC = () => {
	const gameState: GameState | undefined = useGameState()

	const [showBanner, setShowBanner] = useState(true)
	const [hasWelcomed, setHasWelcomed] = useState(false)

	const [helpersQueue, setHelpersQueue] = useState<{
		title: string
		description: string
		iconUrl: string
		accentColor: string
	}[]>([])

	const [bannerProps, setBannerProps] = useState({
		title: "",
		description: "",
		iconUrl: "",
		accentColor: "#00ff00",
	})

	useEffect(() => {
		if (gameState) {
			if (!hasWelcomed) {
				helpersQueue.push({
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
					? dragonTimer.EventTime + LeagueOptions.dragon.respawnTime
					: LeagueOptions.dragon.spawnTime

				const nextBaron = baronTimer?.EventTime
					? baronTimer.EventTime + LeagueOptions.baron.respawnTime
					: LeagueOptions.baron.spawnTime

				const early_gank_time = LeagueOptions.earlygank.spawnTime
				const full_clear_gank_time = LeagueOptions.full_clear_gank.spawnTime
				const second_clear_gank_time = LeagueOptions.second_clear_gank.spawnTime
				const atakhan_time = LeagueOptions.atakhan.spawnTime
				const grubs_time = LeagueOptions.grubs.spawnTime
				const riftherald_time = LeagueOptions.riftherald.spawnTime

				const isEarlyGank = time <= early_gank_time && time >= early_gank_time - thirty_seconds
				const isFullClearGank = time <= full_clear_gank_time && time >= full_clear_gank_time - thirty_seconds
				const isSecondClearGank = time <= second_clear_gank_time && time >= second_clear_gank_time - thirty_seconds
				const isGrubs = time <= grubs_time && time >= grubs_time - one_minute
				const isRiftHerald = time <= riftherald_time && time >= riftherald_time - one_minute_and_a_half
				const isElder = time <= nextDragon && time >= nextDragon - one_minute_and_a_half && isNextDragonAncient
				const isAtakhan = time <= atakhan_time && time >= atakhan_time - one_minute_and_a_half
				const isBaron = time <= nextBaron && time >= nextBaron - one_minute_and_a_half
				const isDragon = time <= nextDragon && time >= nextDragon - one_minute_and_a_half

				if (isEarlyGank) {
					helpersQueue.push(LeagueOptions.earlygank.cardData)
				}
			}

		}

		if (!showBanner && helpersQueue.length > 0) {
			const nextBanner = helpersQueue[0]

			setHelpersQueue((prevQueue) => prevQueue.slice(1)) // Remove the first element from the queue

			if (nextBanner) {
				setBannerProps(nextBanner)
				setShowBanner(true)
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
			} */}

			{gameState && (
				<div className="mt-6 p-4 bg-gray-900 rounded-md overflow-auto max-h-96">
					<h2 className="text-lg font-bold mb-2 text-white">GameState JSON</h2>
					<pre className="text-xs text-green-300 whitespace-pre-wrap">
						{JSON.stringify(gameState?.live_client_data.events, null, 2)}
					</pre>
				</div>
			)}

		</div>
	)
}

export default Screen
