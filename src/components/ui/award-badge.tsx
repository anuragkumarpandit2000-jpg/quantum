"use client";

import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type AwardBadgeType = "golden-kitty" | "product-of-the-day" | "winter-arc-first" | "product-of-the-month";

interface AwardBadgeProps {
  type: AwardBadgeType;
  place?: number;
  link?: string;
  className?: string;
}

const identityMatrix =
  "1, 0, 0, 0, " +
  "0, 1, 0, 0, " +
  "0, 0, 1, 0, " +
  "0, 0, 0, 1";

const maxRotate = 0.25;
const minRotate = -0.25;
const maxScale = 1;
const minScale = 0.97;

const title: Record<AwardBadgeType, string> = {
  "golden-kitty": "Golden Kitty Awards",
  "product-of-the-day": "Product of the Day",
  "winter-arc-first": "Winter Arc Top 1%",
  "product-of-the-month": "Product of the Month",
};

export const AwardBadge: React.FC<AwardBadgeProps> = ({ type, place = 1, link = "#", className }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [firstOverlayPosition, setFirstOverlayPosition] = useState<number>(0);
  const [matrix, setMatrix] = useState<string>(identityMatrix);
  const [currentMatrix, setCurrentMatrix] = useState<string>(identityMatrix);
  const [disableInOutOverlayAnimation, setDisableInOutOverlayAnimation] = useState<boolean>(true);
  const [disableOverlayAnimation, setDisableOverlayAnimation] = useState<boolean>(false);
  const [isTimeoutFinished, setIsTimeoutFinished] = useState<boolean>(false);
  const enterTimeout = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeout1 = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeout2 = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeout3 = useRef<NodeJS.Timeout | null>(null);

  const getDimensions = () => {
    const left = ref?.current?.getBoundingClientRect()?.left || 0;
    const right = ref?.current?.getBoundingClientRect()?.right || 0;
    const top = ref?.current?.getBoundingClientRect()?.top || 0;
    const bottom = ref?.current?.getBoundingClientRect()?.bottom || 0;

    return { left, right, top, bottom };
  };

  const getMatrix = (clientX: number, clientY: number) => {
    const { left, right, top, bottom } = getDimensions();
    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;

    const scale = [
      maxScale - (maxScale - minScale) * Math.abs(xCenter - clientX) / ((xCenter - left) || 1),
      maxScale - (maxScale - minScale) * Math.abs(yCenter - clientY) / ((yCenter - top) || 1),
      maxScale - (maxScale - minScale) * (Math.abs(xCenter - clientX) + Math.abs(yCenter - clientY)) / ((xCenter - left + yCenter - top) || 1),
    ];

    const rotate = {
      x1: 0.25 * (((yCenter - clientY) / (yCenter || 1)) - ((xCenter - clientX) / (xCenter || 1))),
      x2: maxRotate - (maxRotate - minRotate) * Math.abs(right - clientX) / ((right - left) || 1),
      x3: 0,
      y0: 0,
      y2: maxRotate - (maxRotate - minRotate) * (top - clientY) / ((top - bottom) || 1),
      y3: 0,
      z0: -(maxRotate - (maxRotate - minRotate) * Math.abs(right - clientX) / ((right - left) || 1)),
      z1: (0.2 - (0.2 + 0.6) * (top - clientY) / ((top - bottom) || 1)),
      z3: 0,
    };
    return (
      `${scale[0]}, ${rotate.y0}, ${rotate.z0}, 0, ` +
      `${rotate.x1}, ${scale[1]}, ${rotate.z1}, 0, ` +
      `${rotate.x2}, ${rotate.y2}, ${scale[2]}, 0, ` +
      `${rotate.x3}, ${rotate.y3}, ${rotate.z3}, 1`
    );
  };

  const getOppositeMatrix = (_matrix: string, clientY: number, onMouseEnter?: boolean) => {
    const { top, bottom } = getDimensions();
    const oppositeY = bottom - clientY + top;
    const weakening = onMouseEnter ? 0.7 : 4;
    const multiplier = onMouseEnter ? -1 : 1;

    return _matrix
      .split(", ")
      .map((item, index) => {
        if (index === 2 || index === 4 || index === 8) {
          return ((-parseFloat(item) * multiplier) / weakening).toString();
        } else if (index === 0 || index === 5 || index === 10) {
          return "1";
        } else if (index === 6) {
          return ((multiplier * (maxRotate - ((maxRotate - minRotate) * (top - oppositeY)) / ((top - bottom) || 1))) / weakening).toString();
        } else if (index === 9) {
          return (((maxRotate - ((maxRotate - minRotate) * (top - oppositeY)) / ((top - bottom) || 1))) / weakening).toString();
        }
        return item;
      })
      .join(", ");
  };

  const onMouseEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    if (leaveTimeout1.current) clearTimeout(leaveTimeout1.current);
    if (leaveTimeout2.current) clearTimeout(leaveTimeout2.current);
    if (leaveTimeout3.current) clearTimeout(leaveTimeout3.current);
    setDisableOverlayAnimation(true);

    const { left, right, top, bottom } = getDimensions();
    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;

    setDisableInOutOverlayAnimation(false);
    enterTimeout.current = setTimeout(() => setDisableInOutOverlayAnimation(true), 350);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFirstOverlayPosition((Math.abs(xCenter - e.clientX) + Math.abs(yCenter - e.clientY)) / 1.5);
      });
    });

    const mtx = getMatrix(e.clientX, e.clientY);
    const oppositeMatrix = getOppositeMatrix(mtx, e.clientY, true);

    setMatrix(oppositeMatrix);
    setIsTimeoutFinished(false);
    setTimeout(() => {
      setIsTimeoutFinished(true);
    }, 200);
  };

  const onMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const { left, right, top, bottom } = getDimensions();
    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;

    setTimeout(() => setFirstOverlayPosition((Math.abs(xCenter - e.clientX) + Math.abs(yCenter - e.clientY)) / 1.5), 150);

    if (isTimeoutFinished) {
      setCurrentMatrix(getMatrix(e.clientX, e.clientY));
    }
  };

  const onMouseLeave = (e: MouseEvent<HTMLAnchorElement>) => {
    const oppositeMatrix = getOppositeMatrix(matrix, e.clientY);

    if (enterTimeout.current) clearTimeout(enterTimeout.current);

    setCurrentMatrix(oppositeMatrix);
    setTimeout(() => setCurrentMatrix(identityMatrix), 200);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setDisableInOutOverlayAnimation(false);
        leaveTimeout1.current = setTimeout(() => setFirstOverlayPosition(-firstOverlayPosition / 4), 150);
        leaveTimeout2.current = setTimeout(() => setFirstOverlayPosition(0), 300);
        leaveTimeout3.current = setTimeout(() => {
          setDisableOverlayAnimation(false);
          setDisableInOutOverlayAnimation(true);
        }, 500);
      });
    });
  };

  useEffect(() => {
    if (isTimeoutFinished) {
      setMatrix(currentMatrix);
    }
  }, [currentMatrix, isTimeoutFinished]);

  return (
    <a
      ref={ref}
      href={link}
      className={cn("block w-[220px] sm:w-[260px] h-auto cursor-pointer select-none", className)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
      <div
        style={{
          transform: `perspective(700px) matrix3d(${matrix})`,
          transformOrigin: "center center",
          transition: "transform 200ms ease-out",
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 54" className="w-full h-auto drop-shadow-xl">
          <defs>
            <filter id="badgeBlur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
            <mask id="badgeMask">
              <rect width="260" height="54" fill="white" rx="10" />
            </mask>
          </defs>
          <rect width="260" height="54" rx="10" fill="#0b1329" stroke="rgba(56,189,248,0.4)" strokeWidth="1.5" />
          <rect x="4" y="4" width="252" height="46" rx="8" fill="rgba(6,11,24,0.8)" stroke="#1e293b" strokeWidth="1" />
          
          {/* Trophy Icon */}
          <g transform="translate(14, 12)">
            <path
              fill="#38bdf8"
              d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3-4.8-2.5-4.8 2.5.9-5.3-3.8-3.7 5.3-.8z"
            />
          </g>

          <text fontFamily="system-ui, sans-serif" fontSize="9" fontWeight="bold" fill="#38bdf8" letterSpacing="1.2" x="48" y="20">
            QUANTUM PLATFORM
          </text>
          <text fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="bold" fill="#f8fafc" x="48" y="38">
            {title[type]} #{place}
          </text>

          {/* Holographic light gradient overlay */}
          <g style={{ mixBlendMode: "overlay" }} mask="url(#badgeMask)">
            <g
              style={{
                transform: `rotate(${firstOverlayPosition}deg)`,
                transformOrigin: "center center",
                transition: !disableInOutOverlayAnimation ? "transform 200ms ease-out" : "none",
                willChange: "transform",
              }}
            >
              <polygon points="0,0 260,54 260,0 0,54" fill="hsl(199, 89%, 60%)" filter="url(#badgeBlur)" opacity="0.4" />
            </g>
          </g>
        </svg>
      </div>
    </a>
  );
};

export default AwardBadge;
