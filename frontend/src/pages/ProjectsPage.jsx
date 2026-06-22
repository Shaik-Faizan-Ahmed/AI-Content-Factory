import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { getProjects } from "../services/projectService"

const STATUS_COLOR = {
    queued:             "#999",
    researching:        "#3b82f6",
    writing_script:     "#3b82f6",
    planning_scenes:    "#3b82f6",
    generating_images:  "#8b5cf6",
    generating_voice:   "#8b5cf6",
    assembling_video:   "#f59e0b",
    video_ready:        "#f59e0b",
    generating_thumbnail: "#f59e0b",
    generating_seo:     "#f59e0b",
    awaiting_review:    "#f59e0b",
    awaiting_publish:   "#22c55e",
    completed:          "#22c55e",
    failed:             "#ef4444",
}

const STATUS_LABEL = {
    queued:             "Queued",
    researching:        "Researching",
    writing_script:     "Writing Script",
    planning_scenes:    "Planning Scenes",
    generating_images:  "Generating Images",
    generating_voice:   "Generating Voice",
    assembling_video:   "Assembling Video",
    video_ready:        "Video Ready",
    generating_thumbnail: "Generating Thumbnails",
    generating_seo:     "Generating SEO",
    awaiting_review:    "Awaiting Review",
    awaiting_publish:   "Ready to Publish",
    completed:          "Completed",
    failed:             "Failed",
}

const FILTERS = ["All", "Queued", "Generating", "Completed", "Failed"]

export default function ProjectsPage() {
    const navigate = useNavigate()
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("All")
    const [search, setSearch] = useState("")

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getProjects()
                setProjects(data.reverse())
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        load()
        const interval = setInterval(load, 10000)
        return () => clearInterval(interval)
    }, [])

    const filtered = projects.filter(p => {
        const matchSearch = p.topic.toLowerCase().includes(search.toLowerCase())
        if (!matchSearch) return false
        if (filter === "All") return true
        if (filter === "Queued") return p.status === "queued"
        if (filter === "Completed") return p.status === "completed"
        if (filter === "Failed") return p.status === "failed"
        if (filter === "Generating") return !["queued", "completed", "failed"].includes(p.status)
        return true
    })

    return (
        <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", margin: 0, padding: 0, background: "#fff", minHeight: "100vh" }}>
            <Navbar />
            <div style={{ height: "56px" }} />

            <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 40px" }}>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
                    <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#1a1a1a", margin: 0 }}>Projects</h1>
                    <button onClick={() => navigate("/generate")} style={{ padding: "10px 20px", fontSize: "13.5px", fontWeight: "700", color: "#fff", background: "#1a1a1a", border: "none", borderRadius: "10px", cursor: "pointer" }}>+ New Project</button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search projects..."
                        style={{ flex: 1, maxWidth: "340px", padding: "10px 14px", fontSize: "14px", fontFamily: "inherit", background: "#f7f7f7", border: "1px solid #e5e5e5", borderRadius: "10px", outline: "none" }}
                    />
                    <div style={{ display: "flex", gap: "8px" }}>
                        {FILTERS.map(f => (
                            <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 16px", fontSize: "13px", fontWeight: "600", color: filter === f ? "#fff" : "#1a1a1a", background: filter === f ? "#1a1a1a" : "#f3f3f3", border: "none", borderRadius: "999px", cursor: "pointer" }}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div style={{ color: "#aaa", fontSize: "15px" }}>Loading...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ color: "#aaa", fontSize: "15px" }}>No projects found.</div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                        {filtered.map(p => (
                            <div
                                key={p.project_id}
                                onClick={() => navigate(`/projects/${p.project_id}`)}
                                style={{ background: "#f7f7f7", border: "1px solid #ececec", borderRadius: "14px", padding: "20px", cursor: "pointer", transition: "border-color 0.2s" }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = "#1a1a1a"}
                                onMouseLeave={e => e.currentTarget.style.borderColor = "#ececec"}
                            >
                                <div style={{ width: "100%", aspectRatio: "16/9", background: "#e5e5e5", borderRadius: "8px", marginBottom: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
                                    🎬
                                </div>
                                <div style={{ fontSize: "15px", fontWeight: "700", color: "#1a1a1a", marginBottom: "8px", lineHeight: 1.3 }}>{p.topic}</div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "700", color: STATUS_COLOR[p.status] ?? "#999" }}>
                                        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: STATUS_COLOR[p.status] ?? "#999", display: "inline-block" }} />
                                        {STATUS_LABEL[p.status] ?? p.status}
                                    </span>
                                    <span style={{ fontSize: "11px", color: "#bbb" }}>
                                        {p.created_at ? new Date(p.created_at).toLocaleDateString() : ""}
                                    </span>
                                </div>
                                {typeof p.progress === "number" && (
                                    <div style={{ marginTop: "12px", background: "#e5e5e5", borderRadius: "999px", height: "4px", overflow: "hidden" }}>
                                        <div style={{ height: "100%", width: `${p.progress}%`, background: STATUS_COLOR[p.status] ?? "#1a1a1a", borderRadius: "999px" }} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
