# FastAPIアプリケーションのメインファイル
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime

# FastAPIアプリケーションインスタンスを作成
app = FastAPI(
    title="ToDo API",
    description="FastAPI + React のサンプル ToDo アプリケーション",
    version="1.0.0"
)

# CORS設定（Reactからのリクエストを許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Reactの開発サーバー
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE等すべて許可
    allow_headers=["*"],
)

# データモデル定義（Pydantic）
class TodoItem(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    completed: bool = False
    created_at: datetime

class TodoCreate(BaseModel):
    title: str
    description: Optional[str] = None

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

# インメモリデータストア（実際の開発ではデータベースを使用）
todos: List[TodoItem] = []

# ルートエンドポイント（API動作確認用）
@app.get("/")
async def read_root():
    return {"message": "FastAPI + React ToDo API is running!"}

# 全てのTodoを取得
@app.get("/api/todos", response_model=List[TodoItem])
async def get_todos():
    return todos

# 新しいTodoを作成
@app.post("/api/todos", response_model=TodoItem)
async def create_todo(todo: TodoCreate):
    new_todo = TodoItem(
        id=str(uuid.uuid4()),
        title=todo.title,
        description=todo.description,
        completed=False,
        created_at=datetime.now()
    )
    todos.append(new_todo)
    return new_todo

# 特定のTodoを取得
@app.get("/api/todos/{todo_id}", response_model=TodoItem)
async def get_todo(todo_id: str):
    for todo in todos:
        if todo.id == todo_id:
            return todo
    return {"error": "Todo not found"}

# Todoを更新
@app.put("/api/todos/{todo_id}", response_model=TodoItem)
async def update_todo(todo_id: str, todo_update: TodoUpdate):
    for i, todo in enumerate(todos):
        if todo.id == todo_id:
            # 更新されたフィールドのみを変更
            update_data = todo_update.dict(exclude_unset=True)
            updated_todo = todo.copy(update=update_data)
            todos[i] = updated_todo
            return updated_todo
    return {"error": "Todo not found"}

# Todoを削除
@app.delete("/api/todos/{todo_id}")
async def delete_todo(todo_id: str):
    for i, todo in enumerate(todos):
        if todo.id == todo_id:
            deleted_todo = todos.pop(i)
            return {"message": "Todo deleted", "todo": deleted_todo}
    return {"error": "Todo not found"}

# 開発用：サンプルデータを追加
@app.on_event("startup")
async def create_sample_data():
    sample_todos = [
        TodoCreate(title="FastAPIの学習", description="RESTful APIの基本を理解する"),
        TodoCreate(title="Reactアプリの作成", description="フロントエンドのUIを構築"),
        TodoCreate(title="DevContainer環境の構築", description="開発環境を整える")
    ]
    
    for sample in sample_todos:
        new_todo = TodoItem(
            id=str(uuid.uuid4()),
            title=sample.title,
            description=sample.description,
            completed=False,
            created_at=datetime.now()
        )
        todos.append(new_todo)