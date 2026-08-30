"use client";

import { useEffect, useRef } from "react";
import "./CronosScrollSection.css";

export default function CronosScrollSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const contentGridRef = useRef<HTMLDivElement>(null);
  const darkenerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const mobileSlotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
        contentGridRef.current.removeAttribute("style");
        darkenerRef.current.style.opacity = "0";
        overlayRef.current.removeAttribute("style");

        if (mobileSlotRef.current) {
            const slotRect = mobileSlotRef.current.getBoundingClientRect();
            const sideSpacing = 20; // px of spacing on each side

            videoWrapperRef.current.style.position = "absolute";
            videoWrapperRef.current.style.left = `${slotRect.left + sideSpacing}px`;
            videoWrapperRef.current.style.top = `${slotRect.top}px`;
            videoWrapperRef.current.style.width = `${slotRect.width - sideSpacing * 2}px`;
            videoWrapperRef.current.style.height = `${slotRect.height}px`;
            videoWrapperRef.current.style.borderRadius = "12px";
        }
        return;
        }

      const trackRect = trackRef.current.getBoundingClientRect();
      const anchorRect = anchorRef.current.getBoundingClientRect();

      const totalScrollable = trackRect.height - window.innerHeight;
      const scrolled = -trackRect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

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
                Center for Entrepreneurship & Rapid Incubation
                <span style={{ fontFamily: "Google Sans Flex, sans-serif" }}>&#174;.</span>
              </span>
              <p className="cronos-brand-desc cronos-desktop-only">
                The Maluti TVET College Incubation Center empowers student innovators and local entrepreneurs with world-class mentorship, rapid digital prototyping, technical resources, and enterprise funding pathways.
              </p>
            </div>

            <div className="cronos-col-right">
              <h2 className="cronos-main-heading">
                By bridging vocational skill development with digital innovation, we accelerate early-stage ventures into market-ready businesses built for sustainable economic impact across South Africa.
              </h2>

              <div ref={mobileSlotRef} className="cronos-mobile-video-slot" />

              <p className="cronos-brand-desc cronos-mobile-only">
                The Maluti TVET College Incubation Center empowers student innovators and local entrepreneurs with world-class mentorship, rapid digital prototyping, technical resources, and enterprise funding pathways.
              </p>

              <div className="cronos-action-block">
                <div className="cronos-btn-combo">
                  <a href="/apply" className="cronos-main-btn">
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
              <source src="/videos/entrepreneur.mp4" type="video/mp4" />
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
    </div>
  );
}