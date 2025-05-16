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
	const [gameData, setGameData] = useState<any>(null)
	const [gameTime, setGameTime] = useState<number>(0)
	const [updates, setUpdates] = useState(0)
	const [earlyGank, setEarlyGank] = useState(false)
	const [fullClearGank, setFullClearGank] = useState(false)
	const [secondClearGank, setSecondClearGank] = useState(false)
	const [grubs, setGrubs] = useState(false)
	const [riftHerald, setRiftHerald] = useState(false)
	const [dragon, setDragon] = useState(false)
	const [baron, setBaron] = useState(false)
	const [elder, setElder] = useState(false)
	const [atakhan, setAtakhan] = useState(false)


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
		setUpdates(updates + 1)
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
		}

		if (gameState && gameState.live_client_data && gameState.live_client_data.game_data) {
			const one_minute = 60
			const one_minute_and_a_half = 90
			const thirty_seconds = 30
			const fifteen_seconds = 15

			const gameData = JSON.parse(gameState?.live_client_data?.game_data || "{}")
			const time = Number(gameData?.gameTime) || 0
			let events = gameState?.live_client_data?.events

			if (typeof events === "string") {
				try {
					events = JSON.parse(events)
				} catch (e) {
					events = []
				}
			}

			let eventsArray = Array.isArray(events) ? events : []

			eventsArray = eventsArray.map(e => {
				if (typeof e === "string") {
					try {
						return JSON.parse(e)
					} catch {
						return e
					}
				}
				return e
			})

			const dragonTimer = [...eventsArray].reverse().find(e => e.EventName === "DragonKill")
			const baronTimer = [...eventsArray].reverse().find(e => e.EventName === "BaronKill")

			const isNextDragonAncient = dragonTimer?.DragonType === "Elder"

			const nextDragon = dragonTimer?.EventTime
				? Number(dragonTimer.EventTime) + LeagueOptions.dragon.respawnTime
				: LeagueOptions.dragon.spawnTime

			const nextBaron = baronTimer?.EventTime
				? Number(baronTimer.EventTime) + LeagueOptions.baron.respawnTime
				: LeagueOptions.baron.spawnTime

			const early_gank_time = LeagueOptions.earlygank.spawnTime
			const full_clear_gank_time = LeagueOptions.full_clear_gank.spawnTime
			const second_clear_gank_time = LeagueOptions.second_clear_gank.spawnTime
			const atakhan_time = LeagueOptions.atakhan.spawnTime
			const grubs_time = LeagueOptions.grubs.spawnTime
			const riftherald_time = LeagueOptions.riftherald.spawnTime

			const isEarlyGank = time <= early_gank_time && time >= early_gank_time - fifteen_seconds && !earlyGank
			const isFullClearGank = time <= full_clear_gank_time && time >= full_clear_gank_time - fifteen_seconds && !fullClearGank
			const isSecondClearGank = time <= second_clear_gank_time && time >= second_clear_gank_time - fifteen_seconds && !secondClearGank
			const isGrubs = time <= grubs_time && time >= grubs_time - one_minute && !grubs
			const isRiftHerald = time <= riftherald_time && time >= riftherald_time - one_minute_and_a_half && !riftHerald
			const isElder = time <= nextDragon && time >= nextDragon - one_minute_and_a_half && isNextDragonAncient && !elder
			const isAtakhan = time <= atakhan_time && time >= atakhan_time - one_minute_and_a_half && !atakhan
			const isBaron = time <= nextBaron && time >= nextBaron - one_minute_and_a_half && !baron
			const isDragon = time <= nextDragon && time >= nextDragon - one_minute_and_a_half && !dragon

			if (isEarlyGank) {
				helpersQueue.push(LeagueOptions.earlygank.cardData)
				setEarlyGank(true)
			}

			if (isFullClearGank) {
				helpersQueue.push(LeagueOptions.full_clear_gank.cardData)
				setFullClearGank(true)
			}

			if (isSecondClearGank) {
				helpersQueue.push(LeagueOptions.second_clear_gank.cardData)
				setSecondClearGank(true)
			}

			if (isGrubs) {
				helpersQueue.push(LeagueOptions.grubs.cardData)
				setGrubs(true)
			}

			if (isRiftHerald) {
				helpersQueue.push(LeagueOptions.riftherald.cardData)
				setRiftHerald(true)
			}

			if (isDragon) {
				helpersQueue.push(LeagueOptions.dragon.cardData)
				setDragon(true)
				setTimeout(() => {
					setDragon(false)
				}, 120 * 1000)
			}

			if (isBaron) {
				helpersQueue.push(LeagueOptions.baron.cardData)
				setBaron(true)

				setTimeout(() => {
					setBaron(false)
				}, 120 * 1000)
			}

			if (isElder) {
				setDragon(false)
				helpersQueue.push(LeagueOptions.elder.cardData)
				setElder(true)
				setTimeout(() => {
					setElder(false)
				}, 120 * 1000)
			}

			if (isAtakhan) {
				helpersQueue.push(LeagueOptions.atakhan.cardData)
				setAtakhan(true)
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
	}, [gameState])


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
		</div>
	)
}

export default Screen
