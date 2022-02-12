from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from bson.objectid import ObjectId
from .models import TaskModel, UpdateTaskModel

router = APIRouter()


@router.get("/", response_description="List all tasks")
async def list_tasks(request: Request):
    tasks = []
    cursor = request.app.mongodb["tasks"].find()

    async for document in cursor:
        tasks.append(TaskModel(**document))
    
    return tasks[0]

@router.get("/{id}", response_description="Get a single task")
async def show_task(id: str, request: Request):
    response = await request.app.mongodb["tasks"].find_one({"_id": id})
    print(id)
    if response:
        return response

    raise HTTPException(status_code=404, detail=f"Task {id} not found")

@router.post("/", response_description="Add new task")
async def create_task(request: Request, task: TaskModel = Body(...)):
    task = jsonable_encoder(task)
    new_task = await request.app.mongodb["tasks"].insert_one(task)
    created_task = await request.app.mongodb["tasks"].find_one(
        {"_id": new_task.inserted_id}
    )

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_task)