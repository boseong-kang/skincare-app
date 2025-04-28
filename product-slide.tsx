import { useEffect, useRef, useState } from "react"
import { useMotionValue, animate } from "framer-motion"
import { Override } from "framer"

export function useEndlessSlider(): Override {
    const x = useMotionValue(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)
    const isDraggingRef = useRef(false)
    const lastXRef = useRef(0)
    const rightClickDrag = useRef(false)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const SCROLL_SPEED = 2.0

        const handleWheel = (event: WheelEvent) => {
            if (!isHovered) return
            if (Math.abs(event.deltaX) > 0) {
                const newValue = x.get() - event.deltaX * SCROLL_SPEED
                animate(x, newValue, {
                    damping: 15,
                    stiffness: 300,
                })
            }
        }

        const handleMouseDown = (e: MouseEvent) => {
            if (e.button === 2) {
                // right click
                e.preventDefault()
                rightClickDrag.current = true
                isDraggingRef.current = true
                lastXRef.current = e.clientX
            }
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (rightClickDrag.current && isDraggingRef.current) {
                const delta = e.clientX - lastXRef.current
                lastXRef.current = e.clientX
                x.set(x.get() + delta)
            }
        }

        const handleMouseUp = () => {
            rightClickDrag.current = false
            isDraggingRef.current = false
        }

        const disableContextMenu = (e: MouseEvent) => {
            if (rightClickDrag.current) {
                e.preventDefault()
            }
        }

        container.addEventListener("wheel", handleWheel, { passive: true })
        container.addEventListener("mousedown", handleMouseDown)
        container.addEventListener("mousemove", handleMouseMove)
        container.addEventListener("mouseup", handleMouseUp)
        container.addEventListener("contextmenu", disableContextMenu)

        return () => {
            container.removeEventListener("wheel", handleWheel)
            container.removeEventListener("mousedown", handleMouseDown)
            container.removeEventListener("mousemove", handleMouseMove)
            container.removeEventListener("mouseup", handleMouseUp)
            container.removeEventListener("contextmenu", disableContextMenu)
        }
    }, [x])

    return {
        ref: containerRef,
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        drag: "x",
        style: {
            display: "flex",
            gap: 12,
            x,
        },
        dragConstraints: { left: -400, right: 0 },
    }
}
