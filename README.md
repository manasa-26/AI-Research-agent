🧠 Project Overview
This is an AI-powered research assistant that takes user queries, fetches relevant web data, and generates concise, source-cited answers using a language model. The system consists of a fast, modern frontend built with Vite + React.js and a backend powered by FastAPI, OpenAI, and SerpAPI.

🔙 Backend – FastAPI, OpenAI, SerpAPI
The backend is designed as a modular, high-performance service that performs the following:

Query Intake: Accepts natural language input from the frontend.

Web Search Integration: Uses SerpAPI to collect real-time search results related to the query.

Information Extraction: Processes and filters relevant snippets from the search data.

LLM Summarization: Interacts with OpenAI's GPT models to produce a clear, well-structured answer with citations.

Citation Handling: Formats the LLM's output with inline numbered citations and maps them to corresponding URLs.

💻 Frontend – Vite + React.js (HTML/CSS)
The frontend is a lightweight, responsive single-page application built with Vite and React.js, styled using HTML and CSS. Key features include:

Intuitive Input Field: Users can enter research questions naturally.

Asynchronous Communication: Interacts with the backend and dynamically updates the UI.

Answer Display with Citations: Shows clearly formatted responses with inline citation numbers and external links.

Minimalist, Clean UI: Optimized for clarity, accessibility, and ease of use.

🛠️ Technologies Used
Backend:
FastAPI – High-performance Python web framework.

OpenAI GPT – For generating concise, citation-backed answers.

SerpAPI – For real-time web search data.

Python, Pydantic, Uvicorn – For API logic and async runtime.

Frontend:
Vite – Lightning-fast development and build tool.

React.js – Component-based UI library.

HTML5 & CSS3 – For markup and custom styling.

Axios / Fetch API – For communicating with the backend.

🖼️ Frontend Screenshot

![Screenshot 2025-06-01 203553](https://github.com/user-attachments/assets/7f6914f3-e6dc-4f16-b70a-21ad98b1d5e3)

Output
![Screenshot 2025-06-01 204534](https://github.com/user-attachments/assets/40d6f3b2-6f73-444b-beae-afdcca064009)
![Screenshot 2025-06-01 220948](https://github.com/user-attachments/assets/76ab7757-1f07-4086-8cc0-d270ce8cac18)



🎥 Video Demo
Watch the demo video here

https://drive.google.com/file/d/1SNKNRQmKyNphuBZTw70F7mKCgAAtwsiH/view?usp=sharing
https://drive.google.com/file/d/1hXMO7Hc5JdYKXMUvLRSb-l5gMKikjV5i/view?usp=sharing  


