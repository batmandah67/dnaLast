"use client";

import React, { useState, useEffect } from "react";
import { motion, MotionStyle } from "framer-motion";

interface MousePosition {
  x: number;
  y: number;
}

interface CursorProps {
  color?: string;
  size?: number;
  dotSize?: number;
  trailDamping?: number;
  mainDamping?: number;
  hoverScale?: number;
  hoverSelectors?: string;
}

const CustomCursor: React.FC<CursorProps> = ({
  color = "white",
  size = 32,
  dotSize = 8,
  trailDamping = 15,
  mainDamping = 30,
  hoverScale = 2,
  hoverSelectors = "button, a, input, select, textarea, img,[data-hover-cursor]",
}) => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [hoverType, setHoverType] = useState<string>("");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Check what we're hovering over
      const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
      const isHoverElement = hoveredElement?.matches(hoverSelectors) || false;

      setIsHovering(isHoverElement);

      // Get the element type or data attribute for custom scaling
      if (isHoverElement && hoveredElement) {
        const customScale = hoveredElement.getAttribute("data-cursor-scale");
        if (customScale) {
          setHoverType(customScale);
        } else {
          setHoverType(hoveredElement.tagName.toLowerCase());
        }
      } else {
        setHoverType("");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.style.cursor = "auto";
    };
  }, [hoverSelectors]);

  // Get scale based on hover type
  const getScale = () => {
    if (!isHovering) return 1;
    // Check for custom scale value
    if (hoverType && !isNaN(Number(hoverType))) {
      return Number(hoverType);
    }
    return hoverScale;
  };

  const commonMotionStyle: MotionStyle = {
    position: "fixed",
    zIndex: 9999,
    pointerEvents: "none",
  };

  return (
    <>
      {/* Main cursor */}
      <motion.div
        style={commonMotionStyle}
        animate={{
          x: mousePosition.x - size / 2,
          y: mousePosition.y - size / 2,
          scale: getScale(),
          opacity: isHovering ? 0.8 : 1,
        }}
        transition={{
          type: "spring",
          damping: mainDamping,
          mass: 0.5,
          stiffness: 400,
        }}
      >
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            border: `2px solid ${color}`,
            backgroundColor: isHovering ? color : "transparent",
            transition: "background-color 0.2s ease",
          }}
        />
      </motion.div>

      {/* Trailing cursor dot */}
      <motion.div
        style={{ ...commonMotionStyle, zIndex: 9998 }}
        animate={{
          x: mousePosition.x - dotSize / 2,
          y: mousePosition.y - dotSize / 2,
          opacity: isHovering ? 0.5 : 1,
          scale: isHovering ? 0.5 : 1,
        }}
        transition={{
          type: "spring",
          damping: trailDamping,
          mass: 0.3,
          stiffness: 200,
        }}
      >
        <div
          style={{
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            borderRadius: "50%",
            backgroundColor: color,
          }}
        />
      </motion.div>
    </>
  );
};

export default CustomCursor;
