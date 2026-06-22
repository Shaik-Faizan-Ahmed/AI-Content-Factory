import { useState, useEffect, useRef } from "react"
import Navbar from "../components/Navbar"

/*
 * HERO VIDEO PLAYLIST
 * -------------------
 * Videos live in /public/videos/hero/
 * To add a new video:
 *   1. Drop the .mp4 into /public/videos/hero/
 *   2. Add the filename to /public/videos/hero/manifest.json
 * That's it. No code changes needed here.
 */

function LandingPage() {

    const [videos, setVideos] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const videoRef = useRef(null)

    useEffect(() => {
        fetch("/videos/hero/manifest.json")
            .then(r => r.json())
            .then(files => setVideos(files))
            .catch(() => {})
    }, [])

    useEffect(() => {
        const vid = videoRef.current
        if (!vid || videos.length === 0) return
        vid.load()
        vid.play().catch(() => {})
    }, [currentIndex, videos])

    const handleVideoEnded = () => {
        setCurrentIndex(prev => (prev + 1) % videos.length)
    }

    const currentSrc = videos.length > 0
        ? `/videos/hero/${videos[currentIndex]}`
        : null

    return (
        <div style={{
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            margin: 0,
            padding: 0,
        }}>

            <Navbar />

            <div style={{ height: "56px" }} />

            {/* ━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "20px",
            }}>
                <div style={{
                    position: "relative",
                    width: "100%",
                    height: "calc(100vh - 56px - 40px)",
                    overflow: "hidden",
                    background: "#071e30",
                    borderRadius: "14px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "0 0 48px 0",
                    boxSizing: "border-box",
                }}>

                    {currentSrc && (
                        <video
                            ref={videoRef}
                            key={currentIndex}
                            autoPlay
                            muted
                            playsInline
                            onEnded={handleVideoEnded}
                            style={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                zIndex: 0,
                            }}
                        >
                            <source src={currentSrc} type="video/mp4" />
                        </video>
                    )}

                    <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(5, 15, 28, 0.32)",
                        zIndex: 1,
                        pointerEvents: "none",
                    }} />

                    <div style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "260px",
                        background: "linear-gradient(to top, rgba(4,12,24,0.80) 0%, transparent 100%)",
                        zIndex: 2,
                        pointerEvents: "none",
                    }} />

                    <div style={{
                        position: "relative",
                        zIndex: 3,
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        padding: "0 48px",
                        width: "100%",
                        boxSizing: "border-box",
                    }}>

                        <div style={{ maxWidth: "520px" }}>
                            <h1 style={{
                                fontSize: "clamp(36px, 4.2vw, 56px)",
                                fontWeight: "700",
                                color: "#ffffff",
                                lineHeight: 1.06,
                                letterSpacing: "-1.5px",
                                margin: "0 0 28px 0",
                            }}>
                                Building AI to<br />Create the World
                            </h1>

                            <button
                                onClick={() => window.location.href = "/dashboard"}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "10px 20px",
                                    fontSize: "13.5px",
                                    fontWeight: "500",
                                    color: "#0a0a0a",
                                    background: "#ffffff",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                }}
                            >
                                Get Started
                                <span style={{ fontSize: "15px" }}>›</span>
                            </button>
                        </div>

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "14px",
                            alignItems: "flex-start",
                            paddingBottom: "4px",
                        }}>
                            {[
                                "NOVA CHARACTERS",
                                "CONTENT PIPELINE",
                                "VOICE AND SCRIPT",
                                "PUBLISH EVERYWHERE",
                            ].map(item => (
                                <a key={item} href="#" style={{
                                    fontSize: "11px",
                                    fontWeight: "600",
                                    letterSpacing: "0.1em",
                                    color: "rgba(255,255,255,0.70)",
                                    textDecoration: "none",
                                }}
                                    onMouseEnter={e => e.target.style.color = "#ffffff"}
                                    onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.70)"}
                                >
                                    {item}
                                </a>
                            ))}
                        </div>

                    </div>
                </div>
            </div>

            {/* ━━ SECTION: FROM IDEA TO PUBLISHED VIDEO ━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div style={{
                width: "100%",
                height: "100vh",
                background: "#fdf0f3",
                padding: "60px 40px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}>

              <div style={{
                width: "100%",
                maxWidth: "1600px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "167.2px",
                justifyContent: "center",
              }}>

                <h2 style={{
                    textAlign: "center",
                    fontFamily: "Georgia, serif",
                    fontWeight: "400",
                    fontSize: "56px",
                    color: "#2b0f12",
                    margin: "0 0 18px 0",
                    letterSpacing: "-0.5px",
                    maxWidth: "832px",
                    WebkitFontSmoothing: "antialiased",
                }}>
                    From Idea to Published Video
                </h2>

                <p style={{
                    textAlign: "center",
                    fontSize: "18px",
                    fontWeight: "400",
                    color: "#3a2326",
                    maxWidth: "832px",
                    margin: "0",
                    lineHeight: 1.5,
                    WebkitFontSmoothing: "antialiased",
                }}>
                    One workflow that researches, writes, creates, optimizes, and publishes content for you.
                </p>

              </div>

              <div style={{ height: "40px" }} />

              <div style={{
                width: "100%",
                maxWidth: "1600px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "24px",
                    width: "1680px",
                    maxWidth: "100%",
                    height: "476.425px",
                }}>

                    {/* CARD 1 — Research & Script */}
                    <div style={{
                        background: "#ebeaea",
                        borderRadius: "16px",
                        padding: "20px",
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                    }}>
                        <div style={{
                            background: "#e3e1fb",
                            borderRadius: "10px",
                            overflow: "hidden",
                            flex: 1,
                            minHeight: 0,
                            marginBottom: "20px",
                            position: "relative",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                            display: "flex",
                            flexDirection: "column",
                        }}>
                            <div style={{
                                height: "36px",
                                flexShrink: 0,
                                background: "repeating-linear-gradient(115deg, #c9c6f7 0px, #c9c6f7 3px, #e3e1fb 3px, #e3e1fb 7px)",
                            }} />
                            <div style={{
                                height: "38px",
                                flexShrink: 0,
                                background: "#f7f7f5",
                                display: "flex",
                                alignItems: "center",
                                gap: "14px",
                                padding: "0 16px",
                                fontSize: "15px",
                                color: "#999",
                            }}>
                                <span>⌂</span><span>≡</span><span>◔</span>
                            </div>
                            <div style={{
                                background: "#ffffff",
                                flex: 1,
                                padding: "20px 22px",
                                overflow: "hidden",
                            }}>
                                <div style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a", marginBottom: "10px", lineHeight: 1.3 }}>
                                    How Black Holes Bend Light...
                                </div>
                                <div style={{ fontSize: "12px", fontWeight: "700", color: "#2f9e44", marginBottom: "8px" }}>
                                    Narrator
                                </div>
                                <div style={{ fontSize: "12.5px", color: "#555", lineHeight: 1.65 }}>
                                    Somewhere in the depths of space, gravity grows so strong that not even light
                                    can escape. These are the universe's most mysterious objects — and today we're
                                    diving into how they actually work, what happens at
                                </div>
                            </div>
                        </div>
                        <h3 style={{ fontFamily: "system-ui, Roboto, Arial, sans-serif", fontSize: "20px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 6px 0", WebkitFontSmoothing: "antialiased" }}>
                            Research &amp; Script Automatically
                        </h3>
                        <p style={{ fontFamily: "system-ui, Roboto, Arial, sans-serif", fontSize: "16px", fontWeight: "400", color: "#555", lineHeight: 1.5, margin: 0, WebkitFontSmoothing: "antialiased" }}>
                            Turn a simple idea into a researched script without writing a single word.
                        </p>
                    </div>

                    {/* CARD 2 — Create Complete Videos */}
                    <div style={{
                        background: "#ebeaea",
                        borderRadius: "16px",
                        padding: "20px",
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                    }}>
                        <div style={{
                            background: "linear-gradient(135deg, #6b1530 0%, #4a0f22 100%)",
                            borderRadius: "10px",
                            flex: 1,
                            minHeight: 0,
                            marginBottom: "20px",
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                        }}>
                            <div style={{
                                width: "82%",
                                height: "66%",
                                borderRadius: "8px",
                                overflow: "hidden",
                                position: "relative",
                                background: "linear-gradient(160deg, #4a4a4a 0%, #2a2a2a 100%)",
                            }}>
                                <div style={{
                                    position: "absolute",
                                    top: "18%",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    width: "88px",
                                    height: "88px",
                                    borderRadius: "50%",
                                    background: "#c79b7a",
                                }} />
                                <div style={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    padding: "10px 14px",
                                    background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
                                }}>
                                    <div style={{ color: "#fff", fontSize: "13px", fontWeight: "600", borderLeft: "2px solid #fff", paddingLeft: "8px" }}>
                                        Maya Chen
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3 style={{ fontFamily: "system-ui, Roboto, Arial, sans-serif", fontSize: "20px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 6px 0", WebkitFontSmoothing: "antialiased" }}>
                            Create Complete Videos
                        </h3>
                        <p style={{ fontFamily: "system-ui, Roboto, Arial, sans-serif", fontSize: "16px", fontWeight: "400", color: "#555", lineHeight: 1.5, margin: 0, WebkitFontSmoothing: "antialiased" }}>
                            Generate visuals, narration, subtitles, and a finished video from one workflow.
                        </p>
                    </div>

                    {/* CARD 3 — Optimize & Publish */}
                    <div style={{
                        background: "#ebeaea",
                        borderRadius: "16px",
                        padding: "20px",
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                    }}>
                        <div style={{
                            borderRadius: "10px",
                            flex: 1,
                            minHeight: 0,
                            marginBottom: "20px",
                            overflow: "hidden",
                            position: "relative",
                            background: "linear-gradient(180deg, #cfd8df 0%, #b7c2cb 35%, #9aa6ad 100%)",
                        }}>
                            <div style={{
                                position: "absolute",
                                bottom: "20px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "70px",
                                height: "170px",
                            }}>
                                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#f0c8a0", margin: "0 auto 4px auto" }} />
                                <div style={{ width: "56px", height: "60px", borderRadius: "14px", background: "#e8973e", margin: "0 auto" }} />
                                <div style={{ width: "50px", height: "55px", background: "#5b6b78", margin: "0 auto", borderRadius: "0 0 8px 8px" }} />
                            </div>
                            <div style={{
                                position: "absolute",
                                top: "16px",
                                left: "16px",
                                fontSize: "11px",
                                color: "#fff",
                                background: "rgba(0,0,0,0.35)",
                                padding: "4px 10px",
                                borderRadius: "6px",
                                fontWeight: "600",
                                letterSpacing: "0.04em",
                            }}>
                                ↑ Departure
                            </div>
                        </div>
                        <h3 style={{ fontFamily: "system-ui, Roboto, Arial, sans-serif", fontSize: "20px", fontWeight: "600", color: "#1a1a1a", margin: "0 0 6px 0", WebkitFontSmoothing: "antialiased" }}>
                            Optimize &amp; Publish
                        </h3>
                        <p style={{ fontFamily: "system-ui, Roboto, Arial, sans-serif", fontSize: "16px", fontWeight: "400", color: "#555", lineHeight: 1.5, margin: 0, WebkitFontSmoothing: "antialiased" }}>
                            Generate thumbnails, titles, descriptions, and publish across platforms.
                        </p>
                    </div>

                </div>
              </div>

            </div>

            {/* ━━ SECTION: USE CASES CAROUSEL ━━━━━━━━━━━━━━━━━━━━━━━ */}
            <UseCasesSection />

            {/* ━━ SECTION: CREATE CONTENT YOUR WAY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <CreateContentSection />

        </div>
    )
}

const USE_CASES = [
    {
        title: "Educational Videos",
        subtitle: "Turn complex topics into engaging lessons with research, visuals, narration, and subtitles.",
        img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80&auto=format&fit=crop",
    },
    {
        title: "Storytelling",
        subtitle: "Bring stories to life with AI-generated scenes, narration, and cinematic visuals.",
        img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=900&q=80&auto=format&fit=crop",
    },
    {
        title: "News & Commentary",
        subtitle: "Transform current events and trending topics into professional news-style videos.",
        img: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=900&q=80&auto=format&fit=crop",
    },
    {
        title: "Product Ads",
        subtitle: "Create scroll-stopping advertisements with visuals, voiceovers, and optimized messaging.",
        img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80&auto=format&fit=crop",
    },
    {
        title: "Podcast Clips",
        subtitle: "Convert long-form conversations into shareable short-form content automatically.",
        img: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=900&q=80&auto=format&fit=crop",
    },
    {
        title: "Shorts & Reels",
        subtitle: "Generate platform-ready vertical videos optimized for TikTok, Instagram, and YouTube.",
        img: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=900&q=80&auto=format&fit=crop",
    },
]

function UseCaseCard({ title, subtitle, img }) {
    const [hovered, setHovered] = useState(false)

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden",
                height: "600px",
                flexShrink: 0,
                width: "320px",
                cursor: "pointer",
                background: "#1a1a1a",
            }}
        >
            <div style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 0.5s ease, clip-path 0.5s ease",
                transform: hovered ? "scale(1.0)" : "scale(1.0)",
                clipPath: hovered ? "inset(150px 0 0 0)" : "inset(0 0 0 0)",
            }} />

            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "140px",
                background: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)",
                pointerEvents: "none",
                opacity: hovered ? 0 : 1,
                transition: "opacity 0.3s ease",
            }} />

            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: hovered ? "150px" : "0px",
                background: "#3a0d1f",
                transition: "height 0.5s ease",
                overflow: "hidden",
            }} />

            <div style={{
                position: "absolute",
                top: "24px",
                left: "24px",
                right: "24px",
                zIndex: 2,
            }}>
                <h3 style={{
                    color: "#ffffff",
                    fontSize: "24px",
                    fontWeight: "600",
                    margin: 0,
                    fontFamily: "system-ui, Roboto, Arial, sans-serif",
                }}>
                    {title}
                </h3>

                <p style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "14px",
                    fontWeight: "400",
                    lineHeight: 1.5,
                    margin: "10px 0 0 0",
                    maxHeight: hovered ? "100px" : "0px",
                    opacity: hovered ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.4s ease, opacity 0.3s ease",
                }}>
                    {subtitle}
                </p>
            </div>
        </div>
    )
}

function UseCasesSection() {
    const scrollRef = useRef(null)

    const scrollByAmount = (dir) => {
        const el = scrollRef.current
        if (!el) return
        el.scrollBy({ left: dir * 340, behavior: "smooth" })
    }

    return (
        <div style={{
            width: "100%",
            background: "#2b0f12",
            padding: "80px 40px",
            boxSizing: "border-box",
        }}>

            <h2 style={{
                textAlign: "center",
                fontFamily: "Georgia, serif",
                fontWeight: "400",
                fontSize: "48px",
                color: "#ffffff",
                margin: "0 0 16px 0",
                WebkitFontSmoothing: "antialiased",
            }}>
                Built for Every Kind of Creator
            </h2>

            <p style={{
                textAlign: "center",
                fontSize: "18px",
                fontWeight: "400",
                color: "rgba(255,255,255,0.75)",
                maxWidth: "700px",
                margin: "0 auto 48px auto",
                lineHeight: 1.5,
            }}>
                One platform, endless content formats — generated automatically.
            </p>

            <div style={{ position: "relative", maxWidth: "1600px", margin: "0 auto" }}>

                <div
                    ref={scrollRef}
                    style={{
                        display: "flex",
                        gap: "20px",
                        overflowX: "auto",
                        scrollSnapType: "x mandatory",
                        paddingBottom: "8px",
                        scrollbarWidth: "none",
                    }}
                >
                    {USE_CASES.map(uc => (
                        <div key={uc.title} style={{ scrollSnapAlign: "start" }}>
                            <UseCaseCard {...uc} />
                        </div>
                    ))}
                </div>

                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    marginTop: "28px",
                }}>
                    <button
                        onClick={() => scrollByAmount(-1)}
                        style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            border: "none",
                            background: "rgba(255,255,255,0.12)",
                            color: "#ffffff",
                            fontSize: "18px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        ←
                    </button>
                    <button
                        onClick={() => scrollByAmount(1)}
                        style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            border: "none",
                            background: "#7a1f3d",
                            color: "#ffffff",
                            fontSize: "18px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        →
                    </button>
                </div>

            </div>
        </div>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CREATE CONTENT YOUR WAY — sci-fi toggle section
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function CreateContentSection() {
    const [mode, setMode] = useState("autopilot")

    return (
        <div style={{
            width: "100%",
            background: "#000000",
            boxSizing: "border-box",
            padding: "100px 40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.07)",
        }}>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700&family=Exo+2:wght@300;400;500&display=swap');
            `}</style>

            <h2 style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: "clamp(28px, 3.5vw, 52px)",
                fontWeight: "700",
                color: "#ffffff",
                textAlign: "center",
                letterSpacing: "2px",
                textTransform: "uppercase",
                margin: "0 0 20px 0",
                WebkitFontSmoothing: "antialiased",
            }}>
                Create Content Your Way
            </h2>

            <p style={{
                fontFamily: "'Exo 2', 'system-ui', sans-serif",
                fontSize: "18px",
                fontWeight: "300",
                color: "rgba(255,255,255,0.6)",
                textAlign: "center",
                letterSpacing: "0.5px",
                margin: "0 0 56px 0",
                maxWidth: "520px",
                lineHeight: 1.6,
                WebkitFontSmoothing: "antialiased",
            }}>
                Choose between fully automated creation or complete creative control.
            </p>

            <div
                role="group"
                aria-label="Content creation mode"
                style={{
                    display: "inline-flex",
                    background: "#000000",
                    border: "1px solid rgba(255,255,255,0.22)",
                    borderRadius: "6px",
                    padding: "4px",
                    gap: "0px",
                }}
            >
                {[
                    { key: "autopilot", label: "Autopilot" },
                    { key: "review",    label: "Review"    },
                ].map(({ key, label }) => {
                    const active = mode === key
                    return (
                        <button
                            key={key}
                            onClick={() => setMode(key)}
                            style={{
                                fontFamily: "'Orbitron', monospace",
                                fontSize: "12px",
                                fontWeight: "600",
                                letterSpacing: "2px",
                                textTransform: "uppercase",
                                padding: "13px 40px",
                                borderRadius: "4px",
                                border: "none",
                                cursor: "pointer",
                                background: active ? "#ffffff" : "transparent",
                                color: active ? "#000000" : "#ffffff",
                                transition: "background 0.2s ease, color 0.2s ease",
                                WebkitFontSmoothing: "antialiased",
                            }}
                        >
                            {label}
                        </button>
                    )
                })}
            </div>

        </div>
    )
}

export default LandingPage
