from fastapi import FastAPI

from api.routes.project_routes import (
    router as project_router
)
from fastapi.middleware.cors import (
    CORSMiddleware
)
from fastapi.staticfiles import (
    StaticFiles
)

app = FastAPI(
    title="AI Content Factory"
)

app.mount(
    "/storage",
    StaticFiles(
        directory="storage"
    ),
    name="storage"
)

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)

app.include_router(
    project_router
)


@app.get("/")
def health_check():

    return {
        "status": "ok"
    }