from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

# Создаём приложение
app = FastAPI()

# Разрешаем доступ с любых источников (для фронта)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # можно позже ограничить доменами
    allow_methods=["*"],
    allow_headers=["*"],
)

# Модель сообщения
class Message(BaseModel):
    username: str
    text: str
    time: str

# Хранилище сообщений в памяти
messages = []

# Отдаём папку static с фронтом
app.mount("/static", StaticFiles(directory="static"), name="static")

# Главная страница
@app.get("/")
def get_index():
    return FileResponse("static/index.html")

# Получение всех сообщений
@app.get("/messages")
def get_messages():
    return messages

# Добавление нового сообщения
@app.post("/messages")
def add_message(message: Message):
    messages.append(message.dict())
    return {"status": "ok"}