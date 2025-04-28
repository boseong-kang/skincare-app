import * as React from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

export default function Ring({
    percent = 0.75,
    size = 32,
    strokeWidth = 4,
}: {
    percent?: number
    size?: number
    strokeWidth?: number
}) {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius

    const progress = useMotionValue(0)
    const strokeDashoffset = useTransform(
        progress,
        (val) => circumference * (1 - val)
    )

    React.useEffect(() => {
        animate(progress, percent, { duration: 0.5, ease: "easeOut" })
    }, [percent])

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{ transform: "rotate(-90deg)" }}
        >
            {/* 배경 링 */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#D9D9D9"
                strokeWidth={strokeWidth}
                fill="none"
            />
            {/* 진행 링 */}
            <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#90D97E" // ✅ 여기만 바뀐 부분!
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                fill="none"
            />
        </svg>
    )
}

addPropertyControls(Ring, {
    percent: {
        title: "Progress",
        type: ControlType.Number,
        min: 0,
        max: 1,
        defaultValue: 0.75,
    },
    size: {
        title: "Size",
        type: ControlType.Number,
        min: 16,
        max: 128,
        defaultValue: 32,
    },
    strokeWidth: {
        title: "Stroke",
        type: ControlType.Number,
        min: 1,
        max: 10,
        defaultValue: 4,
    },
})
