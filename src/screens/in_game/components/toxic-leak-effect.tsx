"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface ToxicLeakEffectProps {
    color?: string
    intensity?: number
}

const ToxicLeakEffect: React.FC<ToxicLeakEffectProps> = ({
    color = "#00ff00",
    intensity = 8, // Reduced intensity for better UX
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const animationRef = useRef<number>(0)

    // Particle class for toxic dripping effect
    class Particle {
        x: number
        y: number
        size: number
        speedY: number
        gravity: number
        life: number
        maxLife: number
        alpha: number
        color: string
        dripping: boolean
        droplets: Particle[]
        isDroplet: boolean

        constructor(x: number, y: number, color: string, isDroplet = false) {
            this.x = x
            this.y = y
            this.size = isDroplet ? Math.random() * 2 + 1 : Math.random() * 3 + 2
            this.speedY = isDroplet ? Math.random() * 1 + 2 : Math.random() * 0.5 + 0.2
            this.gravity = 0.05
            this.life = 0
            this.maxLife = isDroplet ? Math.random() * 30 + 20 : Math.random() * 100 + 50
            this.alpha = 1
            this.color = color
            this.dripping = !isDroplet && Math.random() > 0.7
            this.droplets = []
            this.isDroplet = isDroplet
        }

        update() {
            this.y += this.speedY
            this.speedY += this.gravity
            this.life++

            // Slow alpha reduction for main drops
            if (this.isDroplet) {
                this.alpha = 1 - this.life / this.maxLife
            } else {
                this.alpha = 1 - (this.life / this.maxLife) * 0.7
            }

            // Create droplets for dripping particles with reduced probability
            if (this.dripping && !this.isDroplet && Math.random() > 0.98 && this.life < this.maxLife * 0.7) {
                this.droplets.push(new Particle(this.x, this.y, this.color, true))
            }

            // Update droplets
            for (let i = 0; i < this.droplets.length; i++) {
                this.droplets[i].update()
                if (this.droplets[i].isDead()) {
                    this.droplets.splice(i, 1)
                    i--
                }
            }
        }

        draw(ctx: CanvasRenderingContext2D) {
            ctx.globalAlpha = this.alpha

            // Draw main particle
            ctx.beginPath()
            if (this.isDroplet) {
                // Droplets are small circles
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
            } else {
                // Main drips are elongated
                ctx.ellipse(this.x, this.y, this.size, this.size * 1.5, 0, 0, Math.PI * 2)
            }
            ctx.fillStyle = this.color
            ctx.fill()

            // Add subtle glow
            ctx.shadowBlur = 5
            ctx.shadowColor = this.color

            // Draw droplets
            for (const droplet of this.droplets) {
                droplet.draw(ctx)
            }
        }

        isDead() {
            return this.life >= this.maxLife
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        // Set canvas dimensions
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        particlesRef.current = []

        const animate = () => {
            // Clear the canvas completely instead of using semi-transparent fill
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Get notification element position
            const notification = document.querySelector(".notification-banner") as HTMLElement
            if (!notification) {
                animationRef.current = requestAnimationFrame(animate)
                return
            }

            const rect = notification.getBoundingClientRect()

            // Add new particles from bottom edge with reduced probability
            if (Math.random() < intensity / 200) {
                // Create particles along the bottom edge
                const x = rect.right - Math.random() * (rect.width * 0.8) // Concentrate on right side
                const y = rect.bottom

                // Create main toxic drip
                particlesRef.current.push(new Particle(x, y, color))
            }

            // Update and draw particles
            particlesRef.current.forEach((particle, index) => {
                particle.update()
                particle.draw(ctx)

                // Remove dead particles
                if (particle.isDead()) {
                    particlesRef.current.splice(index, 1)
                }
            })

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        // Handle window resize
        const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        window.addEventListener("resize", handleResize)

        return () => {
            cancelAnimationFrame(animationRef.current)
            window.removeEventListener("resize", handleResize)
        }
    }, [color, intensity])

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-40"
            style={{ opacity: 0.8 }}
        />
    )
}

export default ToxicLeakEffect
