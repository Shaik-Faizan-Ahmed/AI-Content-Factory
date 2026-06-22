import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { getProjects } from "../services/projectService"

const QUICK_START = [
    { key: "educational",  label: "Educational",  img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&q=80&auto=format&fit=crop" },
    { key: "documentary",  label: "Documentary",  img: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=700&q=80&auto=format&fit=crop" },
    { key: "storytelling", label: "Storytelling", img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=700&q=80&auto=format&fit=crop" },
    { key: "news",         label: "News",         img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=700&q=80&auto=format&fit=crop" },
]

const STATUS_COLOR = {
    queued: "#999", completed: "#22c55e", failed: "#ef4444",
    awaiting_publish: "#22c55e", awaiting_review: "#f59e0b",
}

const STATUS_LABEL = {
    queued: "Queued", completed: "Completed", failed: "Failed",
    awaiting_publish: "Ready to Publish", awaiting_review: "Awaiting Review",
}

function statusColor(s) { return STATUS_COLOR[s] ?? "#3b82f6" }
function statusLabel(s) { return STATUS_LABEL[s] ?? "Generating" }

function DashboardPage() {
    const navigate = useNavigate()
    const [videos, setVideos] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const videoRef = useRef(null)
    const [projects, setProjects] = useState([])

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

    const handleVideoEnded = () => setCurrentIndex(prev => (prev + 1) % videos.length)
    const currentSrc = videos.length > 0 ? `/videos/hero/${videos[currentIndex]}` : null

    useEffect(() => {
        const load = async () => {
            try { const data = await getProjects(); setProjects([...data].reverse()) }
            catch (e) { console.error(e) }
        }
        load()
        const iv = setInterval(load, 10000)
        return () => clearInterval(iv)
    }, [])

    const recentProjects = projects.slice(0, 6)

    return (
        <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", margin: 0, padding: 0, background: "#fff", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>

            <Navbar />
            <div style={{ height: "56px", flexShrink: 0 }} />

            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: "16px", gap: "16px", boxSizing: "border-box" }}>

                {/* HERO */}
                <div style={{ position: "relative", width: "100%", flex: "0 0 38%", overflow: "hidden", background: "#071e30", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>

                    {currentSrc && (
                        <video ref={videoRef} key={currentIndex} autoPlay muted playsInline onEnded={handleVideoEnded}
                            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}>
                            <source src={currentSrc} type="video/mp4" />
                        </video>
                    )}
                    <div style={{ position: "absolute", inset: 0, background: "rgba(5,15,28,0.55)", zIndex: 1, pointerEvents: "none" }} />

                    <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
                        <h1 style={{ fontSize: "clamp(22px, 2.8vw, 38px)", fontWeight: "700", color: "#fff", margin: 0, letterSpacing: "-1px", textAlign: "center" }}>
                            What are we creating today?
                        </h1>
                        <button onClick={() => navigate("/generate")}
                            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "13px 30px", fontSize: "15px", fontWeight: "600", color: "#fff", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.35)", borderRadius: "999px", cursor: "pointer", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
                        >
                            <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>+</span>
                            Generate New Video
                        </button>
                    </div>
                </div>

                {/* BOTTOM ROW */}
                <div style={{ flex: 1, display: "flex", gap: "16px", overflow: "hidden", minHeight: 0 }}>

                    {/* QUICK START */}
                    <div style={{ flex: "0 0 55%", display: "flex", flexDirection: "column", minHeight: 0 }}>
                        <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase", color: "#999", marginBottom: "10px" }}>Quick Start</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "12px", flex: 1 }}>
                            {QUICK_START.map(qs => (
                                <button key={qs.key} onClick={() => navigate(`/generate?type=${qs.key}`)}
                                    style={{ position: "relative", padding: 0, border: "none", borderRadius: "10px", cursor: "pointer", overflow: "hidden", textAlign: "left" }}>
                                    <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${qs.img})`, backgroundSize: "cover", backgroundPosition: "center", transition: "transform 0.3s ease" }}
                                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
                                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.05) 100%)" }} />
                                    <div style={{ position: "absolute", bottom: "12px", left: "14px", fontSize: "14px", fontWeight: "700", color: "#fff" }}>{qs.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RECENT PROJECTS */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase", color: "#999" }}>Recent Projects</div>
                            <button onClick={() => navigate("/projects")} style={{ fontSize: "11px", fontWeight: "700", color: "#1a1a1a", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.04em" }}>View All →</button>
                        </div>
                        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                            {recentProjects.length === 0 ? (
                                <div style={{ color: "#ccc", fontSize: "13px", paddingTop: "8px" }}>No projects yet. Generate one!</div>
                            ) : recentProjects.map(p => (
                                <div key={p.project_id} onClick={() => navigate(`/projects/${p.project_id}`)}
                                    style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", background: "#f7f7f7", borderRadius: "10px", cursor: "pointer", border: "1px solid #ececec" }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = "#1a1a1a"}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = "#ececec"}
                                >
                                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#e5e5e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>🎬</div>
                                    <div style={{ flex: 1, overflow: "hidden" }}>
                                        <div style={{ fontSize: "13.5px", fontWeight: "700", color: "#1a1a1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.topic}</div>
                                        <div style={{ fontSize: "11px", color: "#999", marginTop: "2px" }}>{p.created_at ? new Date(p.created_at).toLocaleDateString() : ""}</div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
                                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: statusColor(p.status) }} />
                                        <span style={{ fontSize: "11px", fontWeight: "700", color: statusColor(p.status) }}>{statusLabel(p.status)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default DashboardPage
