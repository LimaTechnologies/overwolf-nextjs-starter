"use client"

import { type FC, useEffect, useState } from "react"
import NotificationBanner from "./components/notification-banner"
import { GameState } from "@/lib/overwolf/gameService/types"
import useGameState from "@/hooks/useGameState"

const Screen: FC = () => {
	const gameState: GameState | undefined = useGameState()

	const [showBanner, setShowBanner] = useState(true)

	const [bannerProps, setBannerProps] = useState({
		title: "",
		description: "",
		iconUrl: "",
		accentColor: "#00ff00",
	})

	useEffect(() => {
		if (gameState) {

			if (gameState.live_client_data && gameState.live_client_data.game_data) {

				const time = gameState.live_client_data.game_data.gameTime

				

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
					title="WARD THE MAP"
					description="your team only have 5% of sight of your jungle. I recommend buying a pink when you reset."
					iconUrl="/ward-icon.png"
					onClose={handleBannerClose}
					autoClose={true}
					autoCloseDelay={5000} // 5 seconds
				/>
			)}
			{/* Button to show the banner again */}
			{
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
						{JSON.stringify(gameState, null, 2)}
					</pre>
				</div>
			)}
		</div>
	)
}

export default Screen
