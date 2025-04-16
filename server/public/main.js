document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("input");
    const messages = document.getElementById("messages");

    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            sendMessage().then(() => {
                input.value = "";
            });
        }
    });

    document.querySelector("button").addEventListener("click", sendMessage);
    input.focus();
});

async function sendMessage() {
    const input = document.getElementById("input");
    const messages = document.getElementById("messages");
    const userMessage = input.value.trim();

    if (!userMessage) {
        alert("Please provide a question.");
        return;
    }

    const userDiv = document.createElement("div");
    userDiv.className = "bg-red-600 text-white p-2 rounded-md self-end max-w-xs ml-auto shadow";
    userDiv.textContent = userMessage;
    messages.appendChild(userDiv);

    try {
        const res = await fetch("http://localhost:3000/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage }),
        });

        const data = await res.json();
        let botMessage = data.reply;

        if (!botMessage) {
            botMessage = "I couldn't generate a response.";
        } else if (typeof botMessage !== "string") {
            botMessage = JSON.stringify(botMessage, null, 2);
        }

        const botDiv = document.createElement("div");
        botDiv.className = "bg-white text-red-700 p-2 rounded-md self-start max-w-xs mr-auto shadow";
        botDiv.textContent = botMessage;

        messages.appendChild(botDiv);
        messages.scrollTop = messages.scrollHeight;

    } catch (err) {
        console.error("Error:", err);
        alert("There was an error processing your request. Please try again.");
    }
}
