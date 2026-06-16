from fastapi import FastAPI

from api.routes.project_routes import (
    router as project_router
)

app = FastAPI(
    title="AI Content Factory"
)

app.include_router(
    project_router
)


@app.get("/")
def health_check():

    return {
        "status": "ok"
    }