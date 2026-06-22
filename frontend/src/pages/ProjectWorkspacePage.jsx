import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { getProjectState, continueProject, regenerateStage } from "../services/projectService"

const STAGES = [
    { key: "research",              label: "Research",          progress: 10  },
    { key: "script",                label: "Script",            progress: 20  },
    { key: "scene_planning",        label: "Scene Planning",    progress: 30  },
    { key: "image_generation",      label: "Image Generation",  progress: 50  },
    { key: "voice_generation",      label: "Voice Generation",  progress: 65  },
    { key: "subtitle_generation",   label: "Subtitles",         progress: 75  },
    { key: "video_assembly",        label: "Video Assembly",    progress: 80  },
    { key: "video_review",          label: "Video Review",      progress: 85  },
    { key: "thumbnail_generation",  label: "Thumbnails",        progress: 90  },
    { key: "seo_generation",        label: "SEO",               progress: 95  },
    { key: "publishing",            label: "Publishing",        progress: 99  },
]

const STATUS_LABEL = {
    queued:                 "Queued...",
    researching:            "Researching...",
    writing_script:         "Writing script...",
    planning_scenes:        "Planning scenes...",
    generating_images:      "Generating images...",
    generating_voice:       "Generating voice...",
    generating_subtitles:   "Generating subtitles...",
    assembling_video:       "Assembling video...",
    video_ready:            "Video ready",
    generating_thumbnail:   "Generating thumbnails...",
    generating_seo:         "Generating SEO...",
    awaiting_publish:       "Ready to publish",
    awaiting_review:        "Waiting for your review...",
    completed:              "Completed",
    failed:                 "Failed",
}

const SLOW_STAGES = new Set(["image_generation", "video_assembly", "generating_images", "assembling_video"])

function pollInterval(status, currentStep) {
    if (SLOW_STAGES.has(status) || SLOW_STAGES.has(currentStep)) return 30000
    return 3000
}

function getStageState(stageKey, currentStep, progress) {
    const stage = STAGES.find(s => s.key === stageKey)
    if (!stage) return "pending"
    if (progress >= 100) return "done"
    if (stage.progress < progress) return "done"
    if (currentStep === stageKey) return "active"
    if (stage.progress === progress) return "active"
    return "pending"
}

async function downloadFile(url, filename) {
    try {
        const res = await fetch(url)
        const blob = await res.blob()
        const a = document.createElement("a")
        a.href = URL.createObjectURL(blob)
        a.download = filename
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(a.href)
    } catch (e) {
        console.error("Download failed", e)
    }
}

export default function ProjectWorkspacePage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [state, setState] = useState(null)
    const [loading, setLoading] = useState(true)
    const [acting, setActing] = useState(false)
    const [selectedThumbnail, setSelectedThumbnail] = useState(0)
    const [publishPlatforms, setPublishPlatforms] = useState({ youtube: true, instagram: true, tiktok: false, facebook: false })
    const audioRef = useRef(null)
    const pollRef = useRef(null)

    const schedulePoll = (status, currentStep) => {
        clearInterval(pollRef.current)
        pollRef.current = setInterval(fetchState, pollInterval(status, currentStep))
    }

    const fetchState = async () => {
        try {
            const data = await getProjectState(id)
            setState(data)
            if (data.status === "completed" || data.status === "failed") {
                clearInterval(pollRef.current)
            } else {
                schedulePoll(data.status, data.current_step)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchState()
        return () => clearInterval(pollRef.current)
    }, [id])

    const handleContinue = async (stage) => {
        setActing(true)
        try { await continueProject(id, stage) } catch (e) { console.error(e) }
        setActing(false)
        fetchState()
    }

    const handleRegenerate = async (stage) => {
        setActing(true)
        try { await regenerateStage(id, stage) } catch (e) { console.error(e) }
        setActing(false)
        fetchState()
    }

    if (loading) return <Shell><div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)", color: "#888", fontSize: "16px" }}>Loading project...</div></Shell>

    if (state?.status === "failed") return (
        <Shell>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)", flexDirection: "column", gap: "16px" }}>
                <div style={{ fontSize: "48px" }}>⚠️</div>
                <div style={{ fontSize: "20px", fontWeight: "700", color: "#1a1a1a" }}>Pipeline Failed</div>
                <div style={{ fontSize: "14px", color: "#888" }}>An error occurred during generation.</div>
                <button onClick={() => navigate("/dashboard")} style={{ marginTop: "16px", padding: "12px 24px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>Back to Dashboard</button>
            </div>
        </Shell>
    )

    if (state?.status === "completed") return <CompletedScreen topic={state.topic} navigate={navigate} />

    const currentStep = state?.current_step ?? "queued"
    const progress = state?.progress ?? 0
    const isReview = state?.mode === "review"
    const isAwaiting = state?.status === "awaiting_review" || state?.status === "awaiting_publish"

    return (
        <Shell>
            <div style={{ display: "flex", width: "100%", height: "calc(100vh - 56px)" }}>

                <div style={{ width: "30%", minWidth: "300px", height: "100%", overflowY: "auto", boxSizing: "border-box", padding: "28px 24px", borderRight: "1px solid #ececec", display: "flex", flexDirection: "column", gap: "28px" }}>

                    <div>
                        <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase", color: "#999", marginBottom: "6px" }}>Project</div>
                        <div style={{ fontSize: "17px", fontWeight: "700", color: "#1a1a1a", marginBottom: "14px" }}>{state?.topic}</div>
                        <div style={{ background: "#f0f0f0", borderRadius: "999px", height: "6px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${progress}%`, background: "#1a1a1a", borderRadius: "999px", transition: "width 0.6s ease" }} />
                        </div>
                        <div style={{ fontSize: "12px", color: "#999", marginTop: "6px" }}>{progress}%</div>
                    </div>

                    <div>
                        <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase", color: "#999", marginBottom: "12px" }}>Pipeline</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            {STAGES.map(stage => {
                                const s = getStageState(stage.key, currentStep, progress)
                                return (
                                    <div key={stage.key} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "7px 10px", borderRadius: "8px", background: s === "active" ? "#f0f0f0" : "transparent" }}>
                                        <span style={{ fontSize: "13px", width: "18px", textAlign: "center", flexShrink: 0 }}>
                                            {s === "done" ? "✓" : s === "active" ? "⏳" : "⬜"}
                                        </span>
                                        <span style={{ fontSize: "13px", fontWeight: s === "active" ? "700" : "500", color: s === "pending" ? "#ccc" : "#1a1a1a" }}>
                                            {stage.label}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <StageControls
                        state={state}
                        currentStep={currentStep}
                        isReview={isReview}
                        isAwaiting={isAwaiting}
                        acting={acting}
                        onContinue={handleContinue}
                        onRegenerate={handleRegenerate}
                        publishPlatforms={publishPlatforms}
                        setPublishPlatforms={setPublishPlatforms}
                        selectedThumbnail={selectedThumbnail}
                        setSelectedThumbnail={setSelectedThumbnail}
                        audioRef={audioRef}
                    />

                </div>

                <div style={{ flex: 1, height: "100%", overflowY: "auto", boxSizing: "border-box", padding: "32px 40px", background: "#fafafa" }}>
                    <StageOutput
                        state={state}
                        currentStep={currentStep}
                        selectedThumbnail={selectedThumbnail}
                        setSelectedThumbnail={setSelectedThumbnail}
                        audioRef={audioRef}
                    />
                </div>

            </div>
        </Shell>
    )
}

function Shell({ children }) {
    return (
        <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", margin: 0, padding: 0, background: "#fff" }}>
            <Navbar />
            <div style={{ height: "56px" }} />
            {children}
        </div>
    )
}

function Btn({ label, onClick, secondary, disabled }) {
    return (
        <button onClick={onClick} disabled={disabled} style={{ width: "100%", padding: "11px", fontSize: "13.5px", fontWeight: "700", color: secondary ? "#1a1a1a" : "#fff", background: secondary ? "#f3f3f3" : "#1a1a1a", border: "none", borderRadius: "10px", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}>
            {label}
        </button>
    )
}

function StageControls({ state, currentStep, isReview, isAwaiting, acting, onContinue, onRegenerate, publishPlatforms, setPublishPlatforms, audioRef }) {
    const isPubStage = currentStep === "publishing" || state?.status === "awaiting_publish"

    if (isPubStage) {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase", color: "#999" }}>Platforms</div>
                {["youtube", "instagram", "tiktok", "facebook"].map(p => (
                    <label key={p} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "600", color: "#1a1a1a", textTransform: "capitalize" }}>
                        <input type="checkbox" checked={publishPlatforms[p]} onChange={e => setPublishPlatforms(prev => ({ ...prev, [p]: e.target.checked }))} />
                        {p}
                    </label>
                ))}
                <div style={{ height: "8px" }} />
                <Btn label="Publish Now" onClick={() => onContinue("publishing")} disabled={acting} />
                <Btn label="Schedule" onClick={() => {}} secondary disabled={acting} />
            </div>
        )
    }

    if (!isReview || !isAwaiting) {
        return (
            <div>
                <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase", color: "#999", marginBottom: "8px" }}>Status</div>
                <div style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a" }}>{STATUS_LABEL[state?.status] ?? "Processing..."}</div>
            </div>
        )
    }

    const controls = {
        research:         <><Btn label="Continue" onClick={() => onContinue("research")} disabled={acting} /><Btn label="Regenerate" onClick={() => onRegenerate("research")} secondary disabled={acting} /></>,
        script:           <><Btn label="Continue" onClick={() => onContinue("script")} disabled={acting} /><Btn label="Regenerate" onClick={() => onRegenerate("script")} secondary disabled={acting} /></>,
        scene_planning:   <><Btn label="Continue" onClick={() => onContinue("scene_planning")} disabled={acting} /><Btn label="Regenerate All" onClick={() => onRegenerate("scene_planning")} secondary disabled={acting} /></>,
        image_generation: <><Btn label="Continue" onClick={() => onContinue("image_generation")} disabled={acting} /><Btn label="Regenerate All" onClick={() => onRegenerate("image_generation")} secondary disabled={acting} /></>,
        voice_generation: (
            <>
                <button onClick={() => audioRef.current?.play()} style={{ width: "100%", padding: "11px", fontSize: "13.5px", fontWeight: "700", color: "#fff", background: "#1a1a1a", border: "none", borderRadius: "10px", cursor: "pointer" }}>▶ Play</button>
                <button onClick={() => audioRef.current?.pause()} style={{ width: "100%", padding: "11px", fontSize: "13.5px", fontWeight: "700", color: "#1a1a1a", background: "#f3f3f3", border: "none", borderRadius: "10px", cursor: "pointer" }}>⏸ Pause</button>
                <Btn label="Continue" onClick={() => onContinue("voice_generation")} disabled={acting} />
                <Btn label="Regenerate" onClick={() => onRegenerate("voice_generation")} secondary disabled={acting} />
            </>
        ),
        video_review: (
            <>
                <Btn label="Continue" onClick={() => onContinue("video_review")} disabled={acting} />
                <Btn label="Regenerate Video" onClick={() => onRegenerate("video_review")} secondary disabled={acting} />
                {state?.video_url && (
                    <button onClick={() => downloadFile(state.video_url, `${state.topic ?? "video"}.mp4`)}
                        style={{ width: "100%", padding: "11px", fontSize: "13.5px", fontWeight: "700", color: "#1a1a1a", background: "#f3f3f3", border: "none", borderRadius: "10px", cursor: "pointer" }}>
                        ⬇ Download Video
                    </button>
                )}
            </>
        ),
        thumbnail_generation: <><Btn label="Continue" onClick={() => onContinue("thumbnail_generation")} disabled={acting} /><Btn label="Generate More" onClick={() => onRegenerate("thumbnail_generation")} secondary disabled={acting} /></>,
        seo_generation:       <><Btn label="Continue" onClick={() => onContinue("seo_generation")} disabled={acting} /><Btn label="Regenerate SEO" onClick={() => onRegenerate("seo_generation")} secondary disabled={acting} /></>,
    }

    const content = controls[currentStep]
    if (!content) return null
    return <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>{content}</div>
}

function Card({ children }) {
    return <div style={{ background: "#fff", border: "1px solid #ececec", borderRadius: "14px", padding: "28px" }}>{children}</div>
}

function SectionLabel({ children }) {
    return <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase", color: "#999", marginBottom: "14px" }}>{children}</div>
}

function ImageCarousel({ images }) {
    const [index, setIndex] = useState(0)
    const total = images.length
    if (total === 0) return <div style={{ color: "#bbb", fontSize: "14px", padding: "20px 0" }}>Generating images... check back in 30 seconds.</div>

    const prev = () => setIndex(i => (i - 1 + total) % total)
    const next = () => setIndex(i => (i + 1) % total)
    const img = images[index]

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: "12px", overflow: "hidden", background: "#eee" }}>
                <img src={img.url} alt={`Scene ${img.scene_number}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "999px" }}>
                    Scene {img.scene_number}
                </div>
                {total > 1 && (
                    <>
                        <button onClick={prev} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "36px", height: "36px", borderRadius: "50%", background: "rgba(0,0,0,0.45)", color: "#fff", border: "none", fontSize: "16px", cursor: "pointer" }}>‹</button>
                        <button onClick={next} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", width: "36px", height: "36px", borderRadius: "50%", background: "rgba(0,0,0,0.45)", color: "#fff", border: "none", fontSize: "16px", cursor: "pointer" }}>›</button>
                    </>
                )}
            </div>
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                {images.map((img, i) => (
                    <div key={i} onClick={() => setIndex(i)} style={{ flexShrink: 0, width: "72px", height: "48px", borderRadius: "6px", overflow: "hidden", border: i === index ? "2px solid #1a1a1a" : "2px solid transparent", cursor: "pointer" }}>
                        <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                ))}
                {images.length < (/* expected scene count */ images.length + 1) && (
                    <div style={{ flexShrink: 0, width: "72px", height: "48px", borderRadius: "6px", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#bbb" }}>...</div>
                )}
            </div>
            <div style={{ fontSize: "12px", color: "#999", textAlign: "center" }}>{index + 1} of {total} images generated</div>
        </div>
    )
}

function StageOutput({ state, currentStep, selectedThumbnail, setSelectedThumbnail, audioRef }) {
    const empty = <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#ccc", fontSize: "15px" }}>Pipeline starting...</div>
    if (!state) return empty

    if (currentStep === "research" && state.research) return (
        <Card><SectionLabel>Research</SectionLabel><div style={{ fontSize: "15px", lineHeight: 1.75, color: "#333", whiteSpace: "pre-wrap" }}>{state.research}</div></Card>
    )

    if (currentStep === "script" && state.script) return (
        <Card><SectionLabel>Script</SectionLabel><div style={{ fontSize: "14.5px", lineHeight: 1.75, color: "#333", whiteSpace: "pre-wrap", fontFamily: "monospace" }}>{state.script}</div></Card>
    )

    if (currentStep === "scene_planning") return (
        <Card>
            <SectionLabel>Scene Plan</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {(state.scene_plan ?? []).map((scene, i) => (
                    <div key={i} style={{ padding: "16px", background: "#f7f7f7", borderRadius: "10px" }}>
                        <div style={{ fontSize: "11px", fontWeight: "700", color: "#aaa", marginBottom: "6px" }}>SCENE {scene.scene_number}</div>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a", marginBottom: "6px", lineHeight: 1.4 }}>{scene.narration}</div>
                        <div style={{ fontSize: "13px", color: "#666", marginBottom: "4px" }}>{scene.visual_description}</div>
                        <div style={{ fontSize: "11px", color: "#bbb" }}>{scene.duration}s</div>
                    </div>
                ))}
            </div>
        </Card>
    )

    if (currentStep === "image_generation") return (
        <Card>
            <SectionLabel>Generated Images</SectionLabel>
            <ImageCarousel images={state.image_urls ?? []} />
        </Card>
    )

    if (currentStep === "voice_generation") return (
        <Card>
            <SectionLabel>Voice Preview</SectionLabel>
            {state.audio_url
                ? <audio ref={audioRef} controls src={state.audio_url} style={{ width: "100%", marginTop: "8px" }} />
                : <div style={{ color: "#bbb", fontSize: "14px" }}>Generating audio...</div>
            }
        </Card>
    )

    if (currentStep === "subtitle_generation") return (
        <Card><SectionLabel>Generating Subtitles</SectionLabel><div style={{ color: "#888", fontSize: "14px" }}>Creating subtitle file...</div></Card>
    )

    if (currentStep === "video_assembly") return (
        <Card>
            <SectionLabel>Video Assembly</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {["Combining Images", "Adding Voice", "Burning Subtitles", "Finalizing Video"].map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "15px", color: "#555" }}>
                        <span>⏳</span>{s}
                    </div>
                ))}
            </div>
        </Card>
    )

    if (currentStep === "video_review") return (
        <Card>
            <SectionLabel>Video Review</SectionLabel>
            {state.video_url
                ? <video controls src={state.video_url} style={{ width: "100%", borderRadius: "10px" }} />
                : <div style={{ color: "#bbb", fontSize: "14px" }}>Video not ready yet...</div>
            }
        </Card>
    )

    if (currentStep === "thumbnail_generation") {
        const thumbs = state.thumbnail_urls ?? []
        return (
            <Card>
                <SectionLabel>Thumbnails</SectionLabel>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                    {thumbs.map((url, i) => (
                        <div key={i} onClick={() => setSelectedThumbnail(i)} style={{ borderRadius: "8px", overflow: "hidden", aspectRatio: "16/9", border: selectedThumbnail === i ? "3px solid #1a1a1a" : "3px solid transparent", cursor: "pointer" }}>
                            <img src={url} alt={`Thumbnail ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                    ))}
                    {thumbs.length === 0 && <div style={{ color: "#bbb", fontSize: "14px" }}>Generating thumbnails...</div>}
                </div>
            </Card>
        )
    }

    if (currentStep === "seo_generation") {
        const seo = state.seo_data ?? {}
        return (
            <div style={{ display: "flex", gap: "24px" }}>
                <div style={{ flex: 1 }}>
                    <Card>
                        <SectionLabel>SEO</SectionLabel>
                        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                            {[["Title", seo.title], ["Description", seo.description], ["Tags", Array.isArray(seo.tags) ? seo.tags.join(", ") : seo.tags], ["Category", seo.category], ["Hashtags", Array.isArray(seo.hashtags) ? seo.hashtags.join(" ") : seo.hashtags]].map(([k, v]) => (
                                <div key={k}>
                                    <div style={{ fontSize: "11px", fontWeight: "700", color: "#bbb", marginBottom: "4px" }}>{k.toUpperCase()}</div>
                                    <div style={{ fontSize: "14px", color: v ? "#333" : "#ddd", lineHeight: 1.5 }}>{v || "Generating..."}</div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
                {state.video_url && (
                    <div style={{ width: "340px", flexShrink: 0 }}>
                        <video controls src={state.video_url} style={{ width: "100%", borderRadius: "12px" }} />
                    </div>
                )}
            </div>
        )
    }

    if (currentStep === "publishing" || state?.status === "awaiting_publish") {
        const seo = state.seo_data ?? {}
        return (
            <Card>
                <SectionLabel>Publishing Preview</SectionLabel>
                {state.video_url && <video controls src={state.video_url} style={{ width: "100%", borderRadius: "10px", marginBottom: "16px" }} />}
                {(state.thumbnail_urls ?? [])[0] && <img src={state.thumbnail_urls[0]} alt="Thumbnail" style={{ width: "100%", borderRadius: "10px", marginBottom: "16px" }} />}
                <div style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px" }}>{seo.title}</div>
                <div style={{ fontSize: "13.5px", color: "#555", lineHeight: 1.5 }}>{seo.description}</div>
            </Card>
        )
    }

    if (state.research) return (
        <Card><SectionLabel>Research</SectionLabel><div style={{ fontSize: "15px", lineHeight: 1.75, color: "#333", whiteSpace: "pre-wrap" }}>{state.research}</div></Card>
    )

    return empty
}

function CompletedScreen({ topic, navigate }) {
    return (
        <Shell>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)", textAlign: "center", padding: "40px" }}>
                <div style={{ fontSize: "64px", marginBottom: "24px" }}>🎉</div>
                <h1 style={{ fontSize: "34px", fontWeight: "700", color: "#1a1a1a", margin: "0 0 10px 0" }}>Project Completed</h1>
                <div style={{ fontSize: "15px", color: "#888", marginBottom: "40px" }}>{topic}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start", marginBottom: "48px" }}>
                    {["Video Generated", "Thumbnail Generated", "SEO Generated", "Publishing Completed"].map(item => (
                        <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", fontWeight: "600", color: "#1a1a1a" }}>
                            <span style={{ color: "#22c55e", fontSize: "16px" }}>✓</span>{item}
                        </div>
                    ))}
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={() => navigate("/generate")} style={{ padding: "13px 28px", fontSize: "14px", fontWeight: "700", color: "#fff", background: "#1a1a1a", border: "none", borderRadius: "10px", cursor: "pointer" }}>Generate New Project</button>
                    <button onClick={() => navigate("/projects")} style={{ padding: "13px 28px", fontSize: "14px", fontWeight: "700", color: "#1a1a1a", background: "#f3f3f3", border: "none", borderRadius: "10px", cursor: "pointer" }}>Go To Projects</button>
                </div>
            </div>
        </Shell>
    )
}
