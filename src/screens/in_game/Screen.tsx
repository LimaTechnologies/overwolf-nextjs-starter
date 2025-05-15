"use client"

import { type FC, useState } from "react"
import NotificationBanner from "./components/notification-banner"

const Screen: FC = () => {
  const [showBanner, setShowBanner] = useState(true)

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
          accentColor="#00ff00"
          onClose={handleBannerClose}
          autoClose={true}
          autoCloseDelay={5000} // 5 seconds
        />
      )}

      <div className="p-4">
        teste
        {/* Button to show the banner again */}
        {!showBanner && (
          <button
            className="mt-4 px-4 py-2 bg-slate-800 rounded-md hover:bg-slate-700"
            onClick={() => setShowBanner(true)}
          >
            Show Banner Again
          </button>
        )}
      </div>
    </div>
  )
}

export default Screen
