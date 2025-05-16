"use client"

import { type FC, useEffect, useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import ToxicLeakEffect from "./toxic-leak-effect"

interface NotificationBannerProps {
    title: string
    description: string
    iconUrl?: string
    accentColor?: string
    onClose?: () => void
    autoClose?: boolean
    autoCloseDelay?: number
}

const NotificationBanner: FC<NotificationBannerProps> = ({
    title,
    description,
    iconUrl,
    accentColor = "#00ff00", // Bright green default
    onClose,
    autoClose = true, // Default to auto-close
    autoCloseDelay = 5000, // 5 seconds by default
}) => {
    const [isVisible, setIsVisible] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const [showEffect, setShowEffect] = useState(false)

    useEffect(() => {
        // Trigger animation after component mounts
        const showTimer = setTimeout(() => {
            setIsVisible(true)
            // Delay the effect slightly for better UX
            setTimeout(() => setShowEffect(true), 300)
        }, 100)

        // Auto close functionality
        let closeTimer: NodeJS.Timeout | null = null
        if (autoClose) {
            closeTimer = setTimeout(() => {
                handleClose()
            }, autoCloseDelay)
        }

        return () => {
            clearTimeout(showTimer)
            if (closeTimer) clearTimeout(closeTimer)
        }
    }, [autoClose, autoCloseDelay])

    const handleClose = () => {
        setIsClosing(true)
        setShowEffect(false)
        setTimeout(() => {
            setIsVisible(false)
            if (onClose) onClose()
        }, 500) // Match transition duration
    }

    // Parse the description to highlight specific text (like percentages or colored words)
    const highlightText = (text: string) => {
        // This is a simple implementation - you can make it more sophisticated
        return text.split(" ").map((word, index) => {
            if (word.includes("%") || word === "pink") {
                return (
                    <span key={index} style={{ color: accentColor }}>
                        {word}{" "}
                    </span>
                )
            }
            return word + " "
        })
    }

    if (!isVisible && !isClosing) {
        return null
    }

    return (
        <>
            {/* Toxic leak effect outside the card */}
            {showEffect && <ToxicLeakEffect color={accentColor} intensity={8} />}

            <div
                className={cn(
                    "notification-banner fixed right-0 z-50 overflow-hidden rounded-l-lg shadow-lg transition-all duration-500",
                    isVisible && !isClosing
                        ? "translate-x-0 opacity-100 rotate-0 scale-100"
                        : isClosing
                            ? "translate-x-full opacity-0 rotate-3 scale-95"
                            : "translate-x-full opacity-0 rotate-3 scale-95",
                )}
                style={{
                    top: "20%",
                    backgroundColor: "#111",
                    maxWidth: "400px",
                    transformOrigin: "right center",
                }}
            >
                <div className="relative text-slate-200 rounded-l-lg shadow-lg">
                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute right-2 top-2 z-10 rounded-full p-1 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                    >
                        <X size={18} style={{ color: accentColor }} />
                    </button>

                    <div className="flex">
                        {/* Icon touching the left and top corner */}
                        <div
                            className="flex-shrink-0"
                            style={{
                                backgroundColor: accentColor,
                                borderBottomRightRadius: "0.75rem",
                                width: "48px",
                                height: "48px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {iconUrl ? (
                                <Image src={iconUrl || "/placeholder.svg"} alt="" width={32} height={32} className="object-contain" />
                            ) : (
                                <div className="w-8 h-8 bg-black bg-opacity-20 rounded-full"></div>
                            )}
                        </div>

                        {/* Title next to the icon */}
                        <div className="flex-1 p-3 pl-4">
                            <h3 className="font-bold uppercase tracking-wider text-xl" style={{ color: accentColor }}>
                                {title}
                            </h3>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="px-4 pb-4 pt-1">
                        <p className="text-sm text-slate-300">{highlightText(description)}</p>
                    </div>

                    {/* Green line at the bottom - right aligned */}
                    <div
                        className="absolute bottom-0 right-0 h-1"
                        style={{
                            backgroundColor: accentColor,
                            width: "70%",
                            borderTopLeftRadius: "0.5rem",
                            borderBottomRightRadius: "0.5rem",
                        }}
                    ></div>
                </div>
            </div>
        </>
    )
}

export default NotificationBanner
