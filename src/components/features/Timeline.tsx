import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import faceIcon from '../../assets/images/face-1.png';
import './Timeline.css';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function Timeline() {
    const sectionRef = useRef<HTMLElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const glowPathRef = useRef<SVGPathElement>(null);
    const faceRef = useRef<SVGImageElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    const events = [
        { time: "DAY 1 - 09:00 AM", title: "REGISTRATION", desc: "Check-in and collect your swagger. The heist begins." },
        { time: "DAY 1 - 11:00 AM", title: "OPENING CEREMONY", desc: "Briefing from the Professor. Rules of engagement." },
        { time: "DAY 1 - 12:00 PM", title: "HACKING C0MMENCES", desc: "The vault is open. Start writing code." },
        { time: "DAY 1 - 05:00 PM", title: "MENTORING ROUND 1", desc: "Experts review your early infiltration plans." },
        { time: "DAY 1 - 09:00 PM", title: "DINNER", desc: "Fuel up. The night holds infinite possibilities." },
        { time: "DAY 2 - 02:00 AM", title: "MIDNIGHT MINI-GAME", desc: "Stay awake, stay sharp. Win tactical advantages." },
        { time: "DAY 2 - 08:00 AM", title: "BREAKFAST", desc: "Morning rations. Push through the final barrier." },
        { time: "DAY 2 - 12:00 PM", title: "HACKING CONCLUDES", desc: "Pens down, keyboards away. The code is sealed." },
        { time: "DAY 2 - 01:00 PM", title: "JUDGING PITCHES", desc: "Present your masterplan to the final panel." },
        { time: "DAY 2 - 03:00 PM", title: "CLOSING CEREMONY", desc: "Bounties awarded and final debrief. Who escaped?" },
    ];

    useEffect(() => {
        const section = sectionRef.current;
        const path = pathRef.current;
        const face = faceRef.current;
        const header = headerRef.current;

        if (!section || !path || !face) return;

        // ── Header parallax float ──
        if (header) {
            gsap.to(header, {
                yPercent: -15,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "top top",
                    scrub: 1,
                }
            });
        }

        // ── Event card entrance + active class toggling ──
        const eventCards = gsap.utils.toArray('.timeline-event') as HTMLElement[];
        eventCards.forEach((card, i) => {
            // Entrance animation
            gsap.fromTo(card,
                { opacity: 0, x: i % 2 === 0 ? -60 : 60, scale: 0.92 },
                {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: "back.out(1.2)",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        end: "top 55%",
                        scrub: 1,
                    }
                }
            );

            // Active class toggle — lights up cards when they're in the viewport centre
            ScrollTrigger.create({
                trigger: card,
                start: "top 75%",
                end: "bottom 25%",
                toggleClass: { targets: card, className: "active" },
            });
        });

        // ── The Master Timeline for the Face Object and Line Drawing ──
        const masterTl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 20%",
                end: "bottom 80%",
                scrub: 1,
            }
        });

        // Initialize animations after a small delay to ensure SVG dimensions are set
        requestAnimationFrame(() => {
            if (!face || !path || !glowPathRef.current) return;

            // Centre the face on the origin of the path
            gsap.set(face, { xPercent: -50, yPercent: -50, transformOrigin: "50% 50%" });

            // Move the face along the path
            masterTl.to(face, {
                motionPath: {
                    path: path,
                    autoRotate: -90,
                    align: path,
                    alignOrigin: [0.5, 0.5],
                },
                ease: "none",
            }, 0);

            // Draw the red glow line — Using the same path as the mask
            const glowPath = glowPathRef.current;
            const glowLength = glowPath.getTotalLength();
            
            // Set initial state
            gsap.set(glowPath, { 
                strokeDasharray: glowLength, 
                strokeDashoffset: glowLength,
                visibility: 'visible' 
            });

            masterTl.to(glowPath, {
                strokeDashoffset: 0,
                ease: "none"
            }, 0);
        });

    }, []);

    return (
        <section className="timeline-section" ref={sectionRef} id="timeline">
            <div className="timeline-header" ref={headerRef}>
                <h2>THE <span className="text-red">MASTERPLAN</span></h2>
                <p>30 HOURS TO INFILTRATE</p>
            </div>

            <div className="timeline-container">
                {/* Background SVG Curve */}
                <div className="timeline-svg-container">
                    <svg
                        ref={svgRef}
                        className="timeline-svg"
                        viewBox="0 0 1000 2000"
                        preserveAspectRatio="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Reference Path (Dotted) */}
                        <path
                            id="route-path"
                            ref={pathRef}
                            d="M 500 0 C 800 300, 200 600, 500 1000 C 800 1400, 200 1700, 500 2000"
                            fill="none"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="4"
                            strokeDasharray="10 15"
                            vectorEffect="non-scaling-stroke"
                        />
                        {/* Fill Path (Solid Red) animated alongside mask */}
                        <path
                            className="glow-path"
                            ref={glowPathRef}
                            d="M 500 0 C 800 300, 200 600, 500 1000 C 800 1400, 200 1700, 500 2000"
                            fill="none"
                            stroke="#e50914"
                            strokeWidth="6"
                            filter="drop-shadow(0 0 10px #e50914)"
                            style={{ visibility: 'hidden' }}
                        />
                        {/* The sliding face image - moved inside SVG for perfect sync */}
                        <image
                            href={faceIcon}
                            className="timeline-face-pin"
                            ref={faceRef}
                            width="60"
                            height="60"
                            style={{ overflow: 'visible' }}
                        />
                    </svg>
                </div>

                {/* Event Nodes plotted using CSS layout */}
                <div className="timeline-events-grid">
                    {events.map((evt, index) => {
                        const isLeft = index % 2 === 0;
                        const stepLabel = `STEP ${String(index + 1).padStart(2, '0')}`;
                        return (
                            <div key={index} className={`timeline-event ${isLeft ? 'left' : 'right'}`}>
                                <span className="timeline-dot" />
                                <div className="event-content" data-step={stepLabel}>
                                    <h4 className="event-time">{evt.time}</h4>
                                    <h3 className="event-title">{evt.title}</h3>
                                    <p className="event-desc">{evt.desc}</p>
                                </div>
                                <div className="event-connector"></div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* Background elements */}
            <div className="timeline-bg-glow" aria-hidden="true" />
        </section>
    );
}
