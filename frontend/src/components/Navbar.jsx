import { useNavigate } from "react-router-dom"

function Navbar() {
    const navigate = useNavigate()

    return (
        <nav style={{
            position: "fixed",
            top: 0, left: 0, right: 0,
            zIndex: 1000,
            background: "#ffffff",
            boxSizing: "border-box",
            padding: "0 40px",
            display: "flex",
            alignItems: "center",
            height: "56px",
            WebkitFontSmoothing: "antialiased",
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                height: "32px",
                boxSizing: "border-box",
                color: "rgb(12,12,12)",
                position: "relative",
            }}>

                <div onClick={() => navigate("/dashboard")} style={{ fontWeight: "700", fontSize: "18px", color: "rgb(12,12,12)", letterSpacing: "-0.5px", cursor: "pointer", lineHeight: "24px", userSelect: "none" }}>
                    nova
                </div>

                <div style={{ display: "flex", gap: "32px", alignItems: "center", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
                    {[
                        { label: "Dashboard", path: "/dashboard" },
                        { label: "Projects",  path: "/projects"  },
                        { label: "Generate",  path: "/generate"  },
                    ].map(({ label, path }) => (
                        <a key={label} onClick={() => navigate(path)} style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.09em", color: "rgb(12,12,12)", textDecoration: "none", lineHeight: "24px", opacity: 0.9, cursor: "pointer" }}>
                            {label.toUpperCase()}
                        </a>
                    ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button style={{ padding: "5px 14px", fontSize: "12.5px", fontWeight: "500", color: "rgb(12,12,12)", background: "transparent", border: "1px solid rgb(200,200,200)", borderRadius: "999px", cursor: "pointer", lineHeight: "20px", whiteSpace: "nowrap" }}>
                        Enterprise Sales
                    </button>
                    <button style={{ padding: "5px 12px", fontSize: "12.5px", fontWeight: "500", color: "rgb(12,12,12)", background: "transparent", border: "none", cursor: "pointer", lineHeight: "20px" }}>
                        Login
                    </button>
                    <button onClick={() => navigate("/generate")} style={{ padding: "5px 16px", fontSize: "12.5px", fontWeight: "600", color: "#fff", background: "rgb(12,12,12)", border: "none", borderRadius: "999px", cursor: "pointer", lineHeight: "20px", whiteSpace: "nowrap" }}>
                        Try Nova
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
