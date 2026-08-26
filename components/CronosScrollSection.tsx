"use client";

import React, { useEffect, useRef } from "react";

export default function CronosScrollSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const contentGridRef = useRef<HTMLDivElement>(null);
  const darkenerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Explicitly enforce video play promise on mount
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay muted fallback triggered:", err);
      });
    }

    const updateVideoPosition = () => {
      if (
        !trackRef.current ||
        !anchorRef.current ||
        !videoWrapperRef.current ||
        !contentGridRef.current ||
        !darkenerRef.current ||
        !overlayRef.current
      )
        return;

      if (window.innerWidth <= 768) {
        videoWrapperRef.current.style.cssText = "";
        contentGridRef.current.style.opacity = "1";
        contentGridRef.current.style.transform = "none";
        return;
      }

      const trackRect = trackRef.current.getBoundingClientRect();
      const anchorRect = anchorRef.current.getBoundingClientRect();

      const totalScrollable = trackRect.height - window.innerHeight;
      const scrolled = -trackRect.top;
      let progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      const startLeft = anchorRect.left;
      const startTop = anchorRect.top;
      const startWidth = anchorRect.width;
      const startHeight = anchorRect.height;

      const endLeft = 0;
      const endTop = 0;
      const endWidth = window.innerWidth;
      const endHeight = window.innerHeight;

      const currentLeft = startLeft + (endLeft - startLeft) * progress;
      const currentTop = startTop + (endTop - startTop) * progress;
      const currentWidth = startWidth + (endWidth - startWidth) * progress;
      const currentHeight = startHeight + (endHeight - startHeight) * progress;
      const borderRadius = 6 * (1 - progress);

      videoWrapperRef.current.style.left = `${currentLeft}px`;
      videoWrapperRef.current.style.top = `${currentTop}px`;
      videoWrapperRef.current.style.width = `${currentWidth}px`;
      videoWrapperRef.current.style.height = `${currentHeight}px`;
      videoWrapperRef.current.style.borderRadius = `${borderRadius}px`;

      if (progress > 0.15) {
        const fadeProgress = Math.min(1, (progress - 0.15) / 0.35);
        contentGridRef.current.style.opacity = (1 - fadeProgress).toString();
        contentGridRef.current.style.transform = `scale(${1 - fadeProgress * 0.15})`;
      } else {
        contentGridRef.current.style.opacity = "1";
        contentGridRef.current.style.transform = "scale(1)";
      }

      if (progress > 0.5) {
        const overlayProgress = Math.min(1, (progress - 0.5) / 0.5);
        darkenerRef.current.style.opacity = (overlayProgress * 0.65).toString();
        overlayRef.current.style.opacity = overlayProgress.toString();
        overlayRef.current.style.transform = `translateY(${(1 - overlayProgress) * 20}px)`;
      } else {
        darkenerRef.current.style.opacity = "0";
        overlayRef.current.style.opacity = "0";
        overlayRef.current.style.transform = "translateY(1px)";
      }
    };

    window.addEventListener("scroll", updateVideoPosition, { passive: true });
    window.addEventListener("resize", updateVideoPosition);
    updateVideoPosition();

    return () => {
      window.removeEventListener("scroll", updateVideoPosition);
      window.removeEventListener("resize", updateVideoPosition);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="cronos-scroll-section-wrapper">
      <div ref={trackRef} className="cronos-scroll-track">
        <div className="cronos-sticky-viewport">
          <div ref={contentGridRef} className="cronos-content-grid">
            <div className="cronos-col-left">
              <span className="cronos-sub-brand">
                Center for Entrepreneurship & Rapid Incubation<span style={{ fontFamily: "Google Sans Flex, sans-serif" }}>&#174;.</span>
              </span>
              <p className="cronos-brand-desc">
                The Maluti TVET College Incubation Center empowers student innovators and local entrepreneurs with world-class mentorship, rapid digital prototyping, technical resources, and enterprise funding pathways.
              </p>
            </div>

            <div className="cronos-col-right">
              <h2 className="cronos-main-heading">
                By bridging vocational skill development with digital innovation, we accelerate early-stage ventures into market-ready businesses built for sustainable economic impact across South Africa.
              </h2>

              <div className="cronos-action-block">
                <div className="cronos-btn-combo">
                  <a href="/application-guide" className="cronos-main-btn">
                    Explore Incubation Programs
                  </a>
                </div>
              </div>

              <div ref={anchorRef} className="cronos-video-anchor" />
            </div>
          </div>

          <div ref={videoWrapperRef} className="cronos-video-container-wrapper">
            <video
              ref={videoRef}
              className="cronos-video-element"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              crossOrigin="anonymous"
              poster="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
            >
              <source
                src="videos/entrepreneur.mp4"
                type="video/mp4"
              />
            </video>
            <div ref={darkenerRef} className="cronos-video-darkener" />

            <div ref={overlayRef} className="cronos-fullscreen-overlay">
              <div className="cronos-overlay-inner">
                <h3 className="cronos-overlay-heading">Empowering Future Founders</h3>
                <p className="cronos-overlay-text">
                  Transforming technical knowledge into high-growth, sustainable enterprises.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cronos-scroll-section-wrapper {
          --cronos-font-sans: 'Google Sans Flex', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          --cronos-bg-color: #ffffff;
          --cronos-text-primary: #0f172a;
          --cronos-text-secondary: #475569;
          --cronos-radius: 50px;
          font-family: var(--cronos-font-sans);
          background-color: var(--cronos-bg-color);
          color: var(--cronos-text-primary);
          margin: 0;
          padding: 120px 0 60px 0;
          box-sizing: border-box;
          overflow: clip;
        }
        .cronos-scroll-track {
          position: relative;
          height: 290vh;
        }
        .cronos-sticky-viewport {
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cronos-content-grid {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 4rem;
          align-items: stretch;
          z-index: 2;
          transition: opacity 0.3s ease-out, transform 0.3s ease-out;
        }
        .cronos-col-left {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-bottom: 3rem;
        }
        .cronos-sub-brand {
          font-size: 4rem;
          font-weight: 400;
          line-height: 1;
          color: #000000;
          text-align: left;
          letter-spacing: -0.03em;
        }
        .cronos-brand-desc {
          font-size: 1.125rem;
          line-height: 1.6;
          color: var(--cronos-text-secondary);
          text-align: left;
          max-width: 420px;
          margin: 0;
        }
        .cronos-col-right {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .cronos-main-heading {
          font-size: 1.75rem;
          font-weight: 400;
          line-height: 1.4;
          letter-spacing: -0.01em;
          color: var(--cronos-text-primary);
          margin: 0;
          text-align: left;
        }
        .cronos-action-block {
          display: flex;
          justify-content: flex-start;
        }
        .cronos-btn-combo {
          display: inline-flex;
          align-items: stretch;
        }
        .cronos-main-btn {
          font-family: inherit;
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 0.02em;
          color: #ffffff;
          background: #080d1b;
          border: none;
          padding: 14px 25px;
          cursor: pointer;
          border-radius: 50px;
          text-decoration: none;
          display: inline-block;
          transition: background-color 0.15s ease;
        }
        .cronos-main-btn:hover {
          background-color: #080d11;
        }
        .cronos-video-anchor {
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 5px;
        }
        .cronos-video-container-wrapper {
          position: absolute;
          z-index: 100;
          border-radius: 5px;
          overflow: hidden;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
          will-change: transform, width, height, top, left, border-radius;
          pointer-events: none;
        }
        .cronos-video-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .cronos-video-darkener {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0.6);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .cronos-fullscreen-overlay {
          position: absolute;
          top: 0;
          left: 150px;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
          padding: 2rem;
        }
        .cronos-overlay-inner {
          text-align: left;
          max-width: 600px;
          line-height: 1;
        }
        .cronos-overlay-heading {
          font-size: 3rem;
          font-weight: 500;
          letter-spacing: -0.02em;
          color: #ffffff;
          margin-bottom: 1rem;
        }
        .cronos-overlay-text {
          font-size: 1.25rem;
          line-height: 1.6;
          color: #f1f5f9;
          font-weight: 400;
        }
        @media (max-width: 768px) {
          .cronos-sticky-viewport {
            height: auto;
            position: relative;
            overflow: visible;
            padding: 3rem 0;
          }
          .cronos-scroll-track {
            height: auto !important;
          }
          .cronos-content-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
            opacity: 1 !important;
          }
          .cronos-col-left {
            padding-bottom: 0;
            gap: 1.5rem;
          }
          .cronos-brand-desc {
            max-width: 100%;
          }
          .cronos-video-anchor {
            display: none;
          }
          .cronos-video-container-wrapper {
            display: flex;
            position: absolute;
            top: auto !important;
            left: auto !important;
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 16 / 9;
            margin-top: 2rem;
            transform: none !important;
            box-shadow: none;
          }
          .cronos-video-darkener {
            opacity: 0.4 !important;
          }
          .cronos-fullscreen-overlay {
            position: absolute;
            left: 0;
            opacity: 1 !important;
            transform: none !important;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
          }
          .cronos-overlay-heading {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
          }
          .cronos-overlay-text {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}