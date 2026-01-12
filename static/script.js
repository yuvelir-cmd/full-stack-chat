// === Находим элементы на странице ===
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const usernameInput = document.getElementById("username");
const messagesDiv = document.querySelector(".messages");

// === Адрес сервера ===
const API_URL = "https://full-stack-chat-bpw7.onrender.com/"; // заменишь на публичный URL, когда будет ngrok/deploy

// === Функция для загрузки всех сообщений ===
async function loadMessages() {
    try {
        const response = await fetch(API_URL);
        const messages = await response.json();

        // очищаем блок сообщений
        messagesDiv.innerHTML = "";

        messages.forEach(msg => {
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("message");
            messageDiv.innerHTML = `
                <span class="username">${msg.username}</span>
                <span class="text">${msg.text}</span>
                <span class="time">${msg.time}</span>
            `;
            messagesDiv.appendChild(messageDiv);
        });

        // автоскролл вниз
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

    } catch (error) {
        console.error("Ошибка загрузки сообщений:", error);
    }
}

// === Функция для отправки нового сообщения ===
chatForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const text = messageInput.value.trim();
    const username = usernameInput.value.trim() || "Anonymous";

    if (!text) return; // не отправлять пустое сообщение

    // Время в 12-часовом формате
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const time = `${hours}:${minutes}`;

    try {
        // Отправляем сообщение на сервер
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, text, time })
        });

        // очищаем поле ввода
        messageInput.value = "";

        // подгружаем все сообщения снова
        loadMessages();

    } catch (error) {
        console.error("Ошибка отправки сообщения:", error);
    }
});

// === Автообновление сообщений каждые 2 секунды ===
setInterval(loadMessages, 2000);

// === Начальная загрузка ===
loadMessages();