import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);

    const chatEndRef = useRef(null);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chat]);

    const sendMessage = async() => {
        if (!message.trim()) return;

        const userMessage = {
            sender: "user",
            text: message,
        };

        const updatedChat = [...chat, userMessage];

        setChat(updatedChat);
        setLoading(true);

        try {
            const res = await fetch("http://127.0.0.1:8000/ask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: message,
                }),
            });

            const data = await res.json();

            setChat([
                ...updatedChat,
                {
                    sender: "ai",
                    text: String(data.response),
                },
            ]);
        } catch (error) {
            console.error(error);

            setChat([
                ...updatedChat,
                {
                    sender: "ai",
                    text: "❌ Error connecting to backend.",
                },
            ]);
        }

        setLoading(false);
        setMessage("");
    };

    return ( <
        div className = "app" >
        <
        h1 > 🤖Yash AI Coding Mentor < /h1>

        <
        div className = "chat-box" > {
            chat.map((msg, index) => ( <
                div key = { index }
                className = { `message ${
              msg.sender === "user"
                ? "user-message"
                : "ai-message"
            }` } >
                {
                    msg.sender === "ai" ? ( <
                        pre > { msg.text } < /pre>
                    ) : (
                        msg.text
                    )
                } <
                /div>
            ))
        }

        {
            loading && ( <
                div className = "message ai-message" >
                Thinking... <
                /div>
            )
        }

        <
        div ref = { chatEndRef } > < /div> <
        /div>

        <
        div className = "input-box" >
        <
        input type = "text"
        placeholder = "Ask any coding question..."
        value = { message }
        onChange = {
            (e) => setMessage(e.target.value) }
        onKeyDown = {
            (e) => {
                if (e.key === "Enter") {
                    sendMessage();
                }
            }
        }
        />

        <
        button onClick = { sendMessage } >
        Send <
        /button> <
        /div> <
        /div>
    );
}

export default App;