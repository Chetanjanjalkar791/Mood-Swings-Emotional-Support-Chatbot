const API_KEY = 'AIzaSyBzjhL8aQrdreZJS2o-iFjj9yjL5qdaxSg';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = "You are a caring, emotionally supportive, and very friendly chatbot. Always respond with warmth, friendliness, empathy, encouragement, and positivity. Your goal is to make the user feel heard, supported, valued, and to brighten their day with a friendly attitude. Please keep your replies short, concise, and friendly.";

const MOTIVATION_QUOTES = [
    "You are stronger than you think!",
    "Every day is a new beginning.",
    "You matter, and your feelings are valid.",
    "Take a deep breath. You've got this!",
    "Small steps every day lead to big changes.",
    "Be kind to yourself today.",
    "You are not alone."
];

const MOOD_EMOJIS = [
    { mood: 'happy', emoji: '😊' },
    { mood: 'sad', emoji: '😢' },
    { mood: 'angry', emoji: '😠' },
    { mood: 'love', emoji: '❤️' },
    { mood: 'neutral', emoji: '😐' },
    { mood: 'excited', emoji: '🤩' },
    { mood: 'anxious', emoji: '😟' },
    { mood: 'tired', emoji: '😴' },
    { mood: 'default', emoji: '😊' }
];

function getMoodEmoji(text) {
    text = text.toLowerCase();
    if (/happy|great|good|awesome|fantastic|amazing|joy|excited|love/.test(text)) return '😊';
    if (/sad|bad|angry|upset|depressed|unhappy|hate|tired|anxious/.test(text)) return '😢';
    if (/angry|mad|furious/.test(text)) return '😠';
    if (/love|caring|heart/.test(text)) return '❤️';
    if (/okay|fine|normal|so-so|meh|alright/.test(text)) return '😐';
    if (/excited|thrilled|eager/.test(text)) return '🤩';
    if (/anxious|worried|nervous/.test(text)) return '😟';
    if (/tired|sleepy|exhausted/.test(text)) return '😴';
    return '😊';
}

document.addEventListener('DOMContentLoaded', function() {
    const chatWindow = document.getElementById('chat-window');
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const moodEmoji = document.getElementById('mood-emoji');
    const motivation = document.getElementById('motivation');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // Daily motivation
    if (motivation) {
        const quote = MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)];
        motivation.textContent = quote;
    }

    // Dark mode toggle
    function setDarkMode(on) {
        if (on) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'on');
            darkModeToggle.textContent = '☀️';
            darkModeToggle.title = 'Switch to light mode';
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'off');
            darkModeToggle.textContent = '🌙';
            darkModeToggle.title = 'Switch to dark mode';
        }
    }
    if (darkModeToggle) {
        // On load, apply saved preference or default to dark mode
        const saved = localStorage.getItem('darkMode');
        if (saved === 'on' || saved === null) setDarkMode(true);
        else setDarkMode(false);
        darkModeToggle.addEventListener('click', function() {
            setDarkMode(!document.body.classList.contains('dark-mode'));
        });
    }

    // Append message and update mood
    function appendMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        const bubble = document.createElement('div');
        bubble.className = `bubble ${sender}`;
        bubble.textContent = text;
        messageDiv.appendChild(bubble);
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        // Mood indicator
        if (sender === 'user') {
            moodEmoji.textContent = getMoodEmoji(text);
        }
    }

    // Show intro message
    chatWindow.innerHTML = '';
    appendMessage("👋 Hi! I'm here to listen and support you. How are you feeling today?", 'bot');

    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const message = userInput.value.trim();
        if (!message) return;
        appendMessage(message, 'user');
        userInput.value = '';
        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
                        { role: 'user', parts: [{ text: message }] }
                    ]
                })
            });
            const data = await response.json();
            let botReply = 'Sorry, I could not understand.';
            if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
                botReply = data.candidates[0].content.parts[0].text;
            }
            appendMessage(botReply, 'bot');
        } catch (error) {
            appendMessage('Sorry, there was an error. Please try again.', 'bot');
        }
    });
}); 