import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import DashboardPage from "./pages/DashboardPage"
import GenerateProjectPage from "./pages/GenerateProjectPage"
import ProjectWorkspacePage from "./pages/ProjectWorkspacePage"
import ProjectsPage from "./pages/ProjectsPage"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/generate" element={<GenerateProjectPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectWorkspacePage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
