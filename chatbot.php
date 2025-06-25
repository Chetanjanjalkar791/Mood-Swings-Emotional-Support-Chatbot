<?php
header('Content-Type: application/json');

function analyzeMood($message) {
    $message = strtolower($message);
    $positive = ['happy', 'great', 'good', 'awesome', 'fantastic', 'amazing', 'joy', 'excited', 'love'];
    $negative = ['sad', 'bad', 'angry', 'upset', 'depressed', 'unhappy', 'hate', 'tired', 'anxious'];
    $neutral = ['okay', 'fine', 'normal', 'so-so', 'meh', 'alright'];

    foreach ($positive as $word) {
        if (strpos($message, $word) !== false) {
            return '😊 I am glad to hear you are feeling positive! Want to share more?';
        }
    }
    foreach ($negative as $word) {
        if (strpos($message, $word) !== false) {
            return '😟 I am sorry you are feeling this way. Remember, it is okay to have ups and downs. Want to talk about it?';
        }
    }
    foreach ($neutral as $word) {
        if (strpos($message, $word) !== false) {
            return '😐 Sounds like you are feeling neutral. Anything I can do to help?';
        }
    }
    return '🤔 Tell me more about how you are feeling.';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['message'])) {
    $userMessage = trim($_POST['message']);
    $reply = analyzeMood($userMessage);
    echo json_encode(['reply' => $reply]);
    exit;
}

echo json_encode(['reply' => 'Invalid request.']); 