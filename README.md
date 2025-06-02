# 🧠 AI-Powered Research Assistant

An AI-powered research assistant that takes user queries, fetches real-time web data, and generates concise, source-cited answers using a language model.

Built with a modern frontend (Vite + React.js) and a modular backend (FastAPI, OpenAI, SerpAPI), this assistant helps users get accurate answers with references—fast.

---

## 🔙 Backend – FastAPI, OpenAI, SerpAPI

The backend is a modular, high-performance service built with FastAPI. It handles:

- **📝 Query Intake**: Accepts natural language input from the frontend.
- **🌐 Web Search Integration**: Uses SerpAPI to gather relevant real-time web data.
- **📑 Information Extraction**: Filters and selects the most relevant snippets.
- **🧠 LLM Summarization**: Utilizes OpenAI's GPT models to produce a well-structured answer.
- **🔗 Citation Handling**: Formats output with inline numbered citations, mapped to actual URLs.

**Technologies:**
- FastAPI
- OpenAI GPT
- SerpAPI
- Python, Pydantic
- Uvicorn (async server)

---

## 💻 Frontend – Vite + React.js

A clean and responsive single-page application built for speed and simplicity.

### Features:
- **🔎 Intuitive Input Field**: Users can enter research questions naturally.
- **⚡ Asynchronous Communication**: Smooth interaction with backend API.
- **📘 Answer Display with Citations**: Clearly formatted answers with numbered inline citations and clickable links.
- **🧼 Minimalist UI**: Optimized for clarity, accessibility, and ease of use.

**Technologies:**
- Vite
- React.js
- HTML5 & CSS3
- Axios / Fetch API

---

## 🖼️ Screenshots

### Input Interface
![Screenshot 2025-06-01 203553](https://github.com/user-attachments/assets/7f6914f3-e6dc-4f16-b70a-21ad98b1d5e3)

### Output Example
![Screenshot 2025-06-01 204534](https://github.com/user-attachments/assets/40d6f3b2-6f73-444b-beae-afdcca064009)
![Screenshot 2025-06-01 220948](https://github.com/user-attachments/assets/76ab7757-1f07-4086-8cc0-d270ce8cac18)

---

## 🎥 Video Demo

Watch the demo here:

- [Demo Video 1](https://drive.google.com/file/d/1SNKNRQmKyNphuBZTw70F7mKCgAAtwsiH/view?usp=sharing)
- [Demo Video 2](https://drive.google.com/file/d/1hXMO7Hc5JdYKXMUvLRSb-l5gMKikjV5i/view?usp=sharing)

---

## 🛠️ How It Works

1. User submits a research query via the frontend.
2. The backend sends the query to SerpAPI for web results.
3. Relevant snippets are extracted and cleaned.
4. OpenAI GPT generates a summary with numbered citations.
5. Response with citations is sent back and rendered in the UI.

---
