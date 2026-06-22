import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { createProject } from "../services/projectService"

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   STATIC OPTION DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const VIDEO_TYPES = [
    "YouTube Long Form",
    "YouTube Shorts",
    "TikTok",
    "Instagram Reel",
    "Product Ad",
    "Educational",
    "Documentary",
    "Storytelling",
    "News",
    "Podcast Clips",
]

const DURATIONS = ["30 sec", "60 sec", "90 sec", "3 min", "5 min", "10 min"]

const VOICES = [
    { name: "Male",        tag: "Standard"  },
    { name: "Female",      tag: "Standard"  },
    { name: "Narrator",    tag: "Standard"  },
    { name: "Energetic",   tag: "Character" },
    { name: "Corporate",   tag: "Character" },
    { name: "Funny",       tag: "Character" },
    { name: "Custom Voice Clone", tag: "Future", disabled: true },
]

const STYLES = [
    { name: "Documentary",        img: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&q=80&auto=format&fit=crop" },
    { name: "Cinematic",          img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80&auto=format&fit=crop" },
    { name: "Realistic",          img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80&auto=format&fit=crop" },
    { name: "Pixar",               img: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&q=80&auto=format&fit=crop" },
    { name: "Anime",               img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80&auto=format&fit=crop" },
    { name: "Motion Graphics",     img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80&auto=format&fit=crop" },
    { name: "AI Generated",        img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=80&auto=format&fit=crop" },
    { name: "Product Commercial",  img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80&auto=format&fit=crop" },
]

const LANGUAGES = ["English", "Hindi", "Spanish", "French"]

const SCRIPT_OPTIONS = ["Auto Script", "Custom Script"]
const SCENE_COUNTS = ["Auto", "5", "10", "15", "20"]
const ASPECT_RATIOS = ["16:9", "9:16", "1:1", "4:5"]
const MUSIC_OPTIONS = ["Auto", "Upload Music", "No Music"]
const SUBTITLE_STYLES = ["YouTube Style", "TikTok Style", "Minimal", "Bold"]

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SMALL REUSABLE UI PIECES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function SectionLabel({ children }) {
    return (
        <h3 style={{
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#666",
            margin: "0 0 14px 0",
        }}>
            {children}
        </h3>
    )
}

function PillOption({ active, onClick, children }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: "9px 16px",
                fontSize: "13.5px",
                fontWeight: "600",
                color: active ? "#ffffff" : "#1a1a1a",
                background: active ? "#1a1a1a" : "#f3f3f3",
                border: active ? "1px solid #1a1a1a" : "1px solid #e5e5e5",
                borderRadius: "999px",
                cursor: "pointer",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
            }}
        >
            {children}
        </button>
    )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function GenerateProjectPage() {

    const navigate = useNavigate()

    const [topic, setTopic] = useState("")
    const [videoType, setVideoType] = useState("Educational")
    const [duration, setDuration] = useState(2) // index into DURATIONS
    const [voiceOpen, setVoiceOpen] = useState(false)
    const [voiceSearch, setVoiceSearch] = useState("")
    const [voice, setVoice] = useState("Narrator")
    const [style, setStyle] = useState("Anime")
    const [language, setLanguage] = useState("English")
    const [mode, setMode] = useState("autopilot")

    const [advancedOpen, setAdvancedOpen] = useState(false)
    const [scriptMode, setScriptMode] = useState("Auto Script")
    const [customScript, setCustomScript] = useState("")
    const [sceneCount, setSceneCount] = useState("Auto")
    const [aspectRatio, setAspectRatio] = useState("16:9")
    const [music, setMusic] = useState("Auto")
    const [musicFileName, setMusicFileName] = useState("")
    const [subtitleStyle, setSubtitleStyle] = useState("YouTube Style")

    const [generating, setGenerating] = useState(false)

    const filteredVoices = VOICES.filter(v =>
        v.name.toLowerCase().includes(voiceSearch.toLowerCase())
    )

    const selectedStyleObj = STYLES.find(s => s.name === style)

    const handleGenerate = async () => {
        if (!topic.trim() || generating) return
        setGenerating(true)
        try {
            const result = await createProject({
                topic,
                video_type: videoType.toLowerCase().replace(/ /g, "_"),
                duration: [30, 60, 90, 180, 300, 600][duration],
                voice: voice.toLowerCase(),
                style: style.toLowerCase().replace(/ /g, "_"),
                language: language.toLowerCase(),
                mode,
            })
            navigate(`/projects/${result.project_id}`)
        } catch (error) {
            console.error(error)
            setGenerating(false)
        }
    }

    return (
        <div style={{
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            margin: 0,
            padding: 0,
            background: "#ffffff",
        }}>

            <Navbar />
            <div style={{ height: "56px" }} />

            <div style={{
                display: "flex",
                width: "100%",
                height: "calc(100vh - 56px)",
                boxSizing: "border-box",
            }}>

                {/* ━━━━━━━━━━━━━━━━━━━━━ LEFT PANEL (30%, scrollable) ━━━━━━━━━━━━━━━━━━━━━ */}
                <div style={{
                    width: "30%",
                    minWidth: "380px",
                    height: "100%",
                    overflowY: "auto",
                    boxSizing: "border-box",
                    padding: "32px 28px 120px 28px",
                    borderRight: "1px solid #ececec",
                }}>

                    {/* IDEA INPUT */}
                    <div style={{ marginBottom: "32px" }}>
                        <SectionLabel>What do you want to create?</SectionLabel>
                        <textarea
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            placeholder="How Black Holes Work"
                            rows={3}
                            style={{
                                width: "100%",
                                boxSizing: "border-box",
                                padding: "14px 16px",
                                fontSize: "15px",
                                fontFamily: "inherit",
                                color: "#1a1a1a",
                                background: "#f7f7f7",
                                border: "1px solid #e5e5e5",
                                borderRadius: "12px",
                                resize: "vertical",
                                outline: "none",
                            }}
                        />
                    </div>

                    {/* VIDEO TYPE */}
                    <div style={{ marginBottom: "32px" }}>
                        <SectionLabel>Video Type</SectionLabel>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                            {VIDEO_TYPES.map(vt => {
                                const active = videoType === vt
                                return (
                                    <button
                                        key={vt}
                                        onClick={() => setVideoType(vt)}
                                        style={{
                                            padding: "14px 12px",
                                            fontSize: "13px",
                                            fontWeight: "600",
                                            textAlign: "left",
                                            color: active ? "#ffffff" : "#1a1a1a",
                                            background: active ? "#1a1a1a" : "#f7f7f7",
                                            border: active ? "1px solid #1a1a1a" : "1px solid #e5e5e5",
                                            borderRadius: "10px",
                                            cursor: "pointer",
                                            transition: "all 0.15s ease",
                                        }}
                                    >
                                        {vt}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* DURATION SLIDER */}
                    <div style={{ marginBottom: "32px" }}>
                        <SectionLabel>Duration</SectionLabel>
                        <div style={{
                            textAlign: "center",
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "#1a1a1a",
                            marginBottom: "14px",
                        }}>
                            {DURATIONS[duration]}
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={DURATIONS.length - 1}
                            step={1}
                            value={duration}
                            onChange={e => setDuration(Number(e.target.value))}
                            style={{ width: "100%", accentColor: "#1a1a1a" }}
                        />
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "11px",
                            color: "#999",
                            marginTop: "6px",
                        }}>
                            {DURATIONS.map(d => <span key={d}>{d}</span>)}
                        </div>
                    </div>

                    {/* VOICE SELECTOR (dropdown) */}
                    <div style={{ marginBottom: "32px" }}>
                        <SectionLabel>Voice</SectionLabel>

                        <button
                            onClick={() => setVoiceOpen(o => !o)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                                boxSizing: "border-box",
                                padding: "12px 14px",
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#1a1a1a",
                                background: "#f7f7f7",
                                border: "1px solid #e5e5e5",
                                borderRadius: "10px",
                                cursor: "pointer",
                            }}
                        >
                            {voice}
                            <span style={{
                                fontSize: "14px",
                                color: "#888",
                                transform: voiceOpen ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.2s ease",
                            }}>
                                ⌄
                            </span>
                        </button>

                        {voiceOpen && (
                            <div style={{
                                marginTop: "10px",
                                border: "1px solid #e5e5e5",
                                borderRadius: "10px",
                                overflow: "hidden",
                                background: "#fff",
                            }}>
                                <input
                                    type="text"
                                    value={voiceSearch}
                                    onChange={e => setVoiceSearch(e.target.value)}
                                    placeholder="Search voices..."
                                    autoFocus
                                    style={{
                                        width: "100%",
                                        boxSizing: "border-box",
                                        padding: "12px 14px",
                                        fontSize: "13.5px",
                                        fontFamily: "inherit",
                                        background: "#f7f7f7",
                                        border: "none",
                                        borderBottom: "1px solid #e5e5e5",
                                        outline: "none",
                                    }}
                                />
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    {filteredVoices.map(v => {
                                        const active = voice === v.name
                                        return (
                                            <div
                                                key={v.name}
                                                onClick={() => {
                                                    if (v.disabled) return
                                                    setVoice(v.name)
                                                    setVoiceOpen(false)
                                                    setVoiceSearch("")
                                                }}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    padding: "10px 14px",
                                                    background: active ? "#1a1a1a" : "#ffffff",
                                                    cursor: v.disabled ? "not-allowed" : "pointer",
                                                    opacity: v.disabled ? 0.5 : 1,
                                                    borderBottom: "1px solid #f0f0f0",
                                                }}
                                            >
                                                <div>
                                                    <div style={{
                                                        fontSize: "13.5px",
                                                        fontWeight: "600",
                                                        color: active ? "#ffffff" : "#1a1a1a",
                                                    }}>
                                                        {v.name}
                                                    </div>
                                                    <div style={{
                                                        fontSize: "11px",
                                                        color: active ? "rgba(255,255,255,0.6)" : "#999",
                                                    }}>
                                                        {v.tag}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={e => e.stopPropagation()}
                                                    disabled={v.disabled}
                                                    style={{
                                                        fontSize: "11px",
                                                        fontWeight: "600",
                                                        padding: "5px 10px",
                                                        borderRadius: "999px",
                                                        border: "1px solid",
                                                        borderColor: active ? "rgba(255,255,255,0.4)" : "#ccc",
                                                        background: "transparent",
                                                        color: active ? "#ffffff" : "#1a1a1a",
                                                        cursor: v.disabled ? "not-allowed" : "pointer",
                                                    }}
                                                >
                                                    ▶ Preview
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* STYLE SELECTOR */}
                    <div style={{ marginBottom: "32px" }}>
                        <SectionLabel>Style</SectionLabel>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                            {STYLES.map(s => {
                                const active = style === s.name
                                return (
                                    <button
                                        key={s.name}
                                        onClick={() => setStyle(s.name)}
                                        style={{
                                            position: "relative",
                                            height: "84px",
                                            padding: 0,
                                            border: active ? "2px solid #1a1a1a" : "2px solid transparent",
                                            borderRadius: "10px",
                                            overflow: "hidden",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <div style={{
                                            position: "absolute",
                                            inset: 0,
                                            backgroundImage: `url(${s.img})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }} />
                                        <div style={{
                                            position: "absolute",
                                            inset: 0,
                                            background: active
                                                ? "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1))"
                                                : "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.05))",
                                        }} />
                                        <div style={{
                                            position: "absolute",
                                            bottom: "8px",
                                            left: "10px",
                                            right: "10px",
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            color: "#ffffff",
                                            textAlign: "left",
                                        }}>
                                            {s.name}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* LANGUAGE */}
                    <div style={{ marginBottom: "32px" }}>
                        <SectionLabel>Language</SectionLabel>
                        <select
                            value={language}
                            onChange={e => setLanguage(e.target.value)}
                            style={{
                                width: "100%",
                                boxSizing: "border-box",
                                padding: "12px 14px",
                                fontSize: "14px",
                                fontFamily: "inherit",
                                fontWeight: "600",
                                color: "#1a1a1a",
                                background: "#f7f7f7",
                                border: "1px solid #e5e5e5",
                                borderRadius: "10px",
                                outline: "none",
                                cursor: "pointer",
                            }}
                        >
                            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>

                    {/* GENERATION MODE TOGGLE */}
                    <div style={{ marginBottom: "32px" }}>
                        <SectionLabel>Generation Mode</SectionLabel>
                        <div style={{
                            display: "inline-flex",
                            background: "#f3f3f3",
                            border: "1px solid #e5e5e5",
                            borderRadius: "10px",
                            padding: "4px",
                            width: "100%",
                            boxSizing: "border-box",
                        }}>
                            {[
                                { key: "autopilot", label: "Autopilot"  },
                                { key: "review",    label: "Review Mode" },
                            ].map(({ key, label }) => {
                                const active = mode === key
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setMode(key)}
                                        style={{
                                            flex: 1,
                                            fontSize: "13px",
                                            fontWeight: "700",
                                            padding: "10px 0",
                                            borderRadius: "7px",
                                            border: "none",
                                            cursor: "pointer",
                                            background: active ? "#1a1a1a" : "transparent",
                                            color: active ? "#ffffff" : "#1a1a1a",
                                            transition: "all 0.15s ease",
                                        }}
                                    >
                                        {label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* ADVANCED SETTINGS (collapsed) */}
                    <div style={{ marginBottom: "32px" }}>
                        <button
                            onClick={() => setAdvancedOpen(o => !o)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                                padding: "14px 16px",
                                fontSize: "13px",
                                fontWeight: "700",
                                letterSpacing: "0.04em",
                                textTransform: "uppercase",
                                color: "#1a1a1a",
                                background: "#f7f7f7",
                                border: "1px solid #e5e5e5",
                                borderRadius: "10px",
                                cursor: "pointer",
                            }}
                        >
                            Advanced Settings
                            <span style={{
                                fontSize: "14px",
                                transform: advancedOpen ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.2s ease",
                            }}>
                                ⌄
                            </span>
                        </button>

                        {advancedOpen && (
                            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>

                                {/* Script */}
                                <div>
                                    <SectionLabel>Script</SectionLabel>
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                        {SCRIPT_OPTIONS.map(o => (
                                            <PillOption key={o} active={scriptMode === o} onClick={() => setScriptMode(o)}>
                                                {o}
                                            </PillOption>
                                        ))}
                                    </div>
                                    {scriptMode === "Custom Script" && (
                                        <textarea
                                            value={customScript}
                                            onChange={e => setCustomScript(e.target.value)}
                                            placeholder="Paste or write your script here..."
                                            rows={6}
                                            style={{
                                                width: "100%",
                                                boxSizing: "border-box",
                                                marginTop: "12px",
                                                padding: "14px 16px",
                                                fontSize: "13.5px",
                                                fontFamily: "inherit",
                                                color: "#1a1a1a",
                                                background: "#f7f7f7",
                                                border: "1px solid #e5e5e5",
                                                borderRadius: "10px",
                                                resize: "vertical",
                                                outline: "none",
                                            }}
                                        />
                                    )}
                                </div>

                                {/* Scene Count */}
                                <div>
                                    <SectionLabel>Scene Count</SectionLabel>
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                        {SCENE_COUNTS.map(o => (
                                            <PillOption key={o} active={sceneCount === o} onClick={() => setSceneCount(o)}>
                                                {o}
                                            </PillOption>
                                        ))}
                                    </div>
                                </div>

                                {/* Aspect Ratio */}
                                <div>
                                    <SectionLabel>Aspect Ratio</SectionLabel>
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                        {ASPECT_RATIOS.map(o => (
                                            <PillOption key={o} active={aspectRatio === o} onClick={() => setAspectRatio(o)}>
                                                {o}
                                            </PillOption>
                                        ))}
                                    </div>
                                </div>

                                {/* Background Music */}
                                <div>
                                    <SectionLabel>Background Music</SectionLabel>
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                        {MUSIC_OPTIONS.map(o => (
                                            <PillOption key={o} active={music === o} onClick={() => setMusic(o)}>
                                                {o}
                                            </PillOption>
                                        ))}
                                    </div>
                                    {music === "Upload Music" && (
                                        <label style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "6px",
                                            marginTop: "12px",
                                            padding: "24px 16px",
                                            border: "1.5px dashed #ccc",
                                            borderRadius: "10px",
                                            background: "#fafafa",
                                            cursor: "pointer",
                                            textAlign: "center",
                                        }}>
                                            <span style={{ fontSize: "20px" }}>↑</span>
                                            <span style={{ fontSize: "13px", fontWeight: "600", color: "#1a1a1a" }}>
                                                {musicFileName || "Click to upload an audio file"}
                                            </span>
                                            <span style={{ fontSize: "11px", color: "#999" }}>
                                                MP3, WAV up to 20MB
                                            </span>
                                            <input
                                                type="file"
                                                accept="audio/*"
                                                onChange={e => setMusicFileName(e.target.files?.[0]?.name || "")}
                                                style={{ display: "none" }}
                                            />
                                        </label>
                                    )}
                                </div>

                                {/* Subtitle Style */}
                                <div>
                                    <SectionLabel>Subtitle Style</SectionLabel>
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                        {SUBTITLE_STYLES.map(o => (
                                            <PillOption key={o} active={subtitleStyle === o} onClick={() => setSubtitleStyle(o)}>
                                                {o}
                                            </PillOption>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>

                    {/* GENERATE BUTTON */}
                    <button
                        onClick={handleGenerate}
                        disabled={!topic.trim() || generating}
                        style={{
                            width: "100%",
                            padding: "16px",
                            fontSize: "15px",
                            fontWeight: "700",
                            color: "#ffffff",
                            background: !topic.trim() ? "#bbb" : "#1a1a1a",
                            border: "none",
                            borderRadius: "12px",
                            cursor: !topic.trim() || generating ? "not-allowed" : "pointer",
                            opacity: generating ? 0.7 : 1,
                        }}
                    >
                        {generating ? "Generating..." : "Generate Project"}
                    </button>

                </div>

                {/* ━━━━━━━━━━━━━━━━━━━━━ RIGHT PANEL (70%, sticky preview) ━━━━━━━━━━━━━━━━━━━━━ */}
                <div style={{
                    width: "70%",
                    height: "100%",
                    position: "sticky",
                    top: 0,
                    boxSizing: "border-box",
                    padding: "40px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fafafa",
                }}>

                    <div style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#999",
                        marginBottom: "20px",
                    }}>
                        Live Preview · Mock Only
                    </div>

                    {/* Preview Card */}
                    <div style={{
                        position: "relative",
                        width: aspectRatio === "9:16" ? "360px" : aspectRatio === "1:1" ? "520px" : aspectRatio === "4:5" ? "440px" : "720px",
                        maxWidth: "100%",
                        aspectRatio: aspectRatio.replace(":", " / "),
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                    }}>
                        <div style={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage: `url(${selectedStyleObj?.img})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }} />
                        <div style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.25) 100%)",
                        }} />

                        {/* Top badges */}
                        <div style={{
                            position: "absolute",
                            top: "16px",
                            left: "16px",
                            display: "flex",
                            gap: "8px",
                        }}>
                            <span style={{
                                fontSize: "11px",
                                fontWeight: "700",
                                color: "#fff",
                                background: "rgba(255,255,255,0.18)",
                                backdropFilter: "blur(8px)",
                                padding: "6px 12px",
                                borderRadius: "999px",
                            }}>
                                {style}
                            </span>
                            <span style={{
                                fontSize: "11px",
                                fontWeight: "700",
                                color: "#fff",
                                background: "rgba(255,255,255,0.18)",
                                backdropFilter: "blur(8px)",
                                padding: "6px 12px",
                                borderRadius: "999px",
                            }}>
                                {videoType}
                            </span>
                        </div>

                        {/* Bottom info */}
                        <div style={{
                            position: "absolute",
                            bottom: "20px",
                            left: "20px",
                            right: "20px",
                        }}>
                            <div style={{
                                fontSize: "20px",
                                fontWeight: "700",
                                color: "#ffffff",
                                marginBottom: "6px",
                                lineHeight: 1.2,
                            }}>
                                {topic.trim() || "Your idea will appear here"}
                            </div>
                            <div style={{
                                fontSize: "12.5px",
                                color: "rgba(255,255,255,0.8)",
                                display: "flex",
                                gap: "10px",
                            }}>
                                <span>{voice} Voice</span>
                                <span>·</span>
                                <span>{DURATIONS[duration]}</span>
                                <span>·</span>
                                <span>{language}</span>
                            </div>
                        </div>

                        {/* Play button center */}
                        <div style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "64px",
                            height: "64px",
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.2)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255,255,255,0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "22px",
                            color: "#fff",
                        }}>
                            ▶
                        </div>
                    </div>

                    <p style={{
                        fontSize: "12.5px",
                        color: "#999",
                        marginTop: "20px",
                        textAlign: "center",
                        maxWidth: "400px",
                    }}>
                        This is a mock preview based on your selections. Actual generation begins after you click "Generate Project".
                    </p>

                </div>

            </div>

        </div>
    )
}

export default GenerateProjectPage
