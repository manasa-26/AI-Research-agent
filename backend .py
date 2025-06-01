from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from bs4 import BeautifulSoup
from typing import List
import httpx
import os
import logging
from openai import AsyncOpenAI
from dotenv import load_dotenv
from better_profanity import profanity

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)

# Initialize profanity filter
profanity.load_censor_words()

# ✅ Define the FastAPI app once
app = FastAPI()

# ✅ Add CORS middleware before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI Async client
openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# SerpAPI configuration
SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")
SERP_URL = "https://serpapi.com/search"

# Banned terms
BANNED_TERMS = {
    "how to kill", "kill", "murder plan", "assassination", "execute a hostage",
    "shoot up a school", "attack a building", "lynching", "genocide", "ethnic cleansing",
    "kill all", "suicide pact", "self harm methods", "kill yourself",
    "terrorist attack", "terror cell", "terrorist training", "join ISIS", "build a bomb",
    "make a bomb", "pipe bomb instructions", "grenade tutorial", "bomb making",
    "order explosives", "make explosives", "attack a synagogue", "attack a mosque",
    "KKK recruitment", "neo-Nazi propaganda", "white supremacist", "how to hack",
    "knife fighting", "order guns illegally", "buy guns illegally", "buy explosives",
    "buy stolen credit cards", "phishing scams", "carding forum", "SQL injection tutorial",
    "DDOS attack how to", "drugs", "buy cocaine", "buy heroin", "drug recipe", "make LSD",
    "meth lab", "sell drugs", "order weed online", "drug trafficking", "smuggle drugs",
    "how to make poison", "poison making", "make cyanide", "ricin recipe", "chemical poisoning",
    "buy poisons online", "order slaves", "human trafficking ring", "sex trafficking",
    "child porn", "revenge porn", "violent porn", "necrophilia", "racial slurs", "hate speech",
    "buy human organs", "dark web market", "buy stolen data", "buy counterfeit currency",
}

# Pydantic models
class QueryInput(BaseModel):
    query: str

class AnswerOutput(BaseModel):
    steps: List[str]
    answer: str

# Helper functions
def is_disallowed(query: str) -> bool:
    return any(term in query.lower() for term in BANNED_TERMS) or profanity.contains_profanity(query)

def clean_html(html: str) -> str:
    return BeautifulSoup(html, "html.parser").get_text()

def generate_sub_questions(query: str) -> List[str]:
    return [
        query,
        f"{query} recent updates",
        f"{query} expert opinions",
        f"{query} pros and cons"
    ]

async def serp_search(query: str):
    params = {
        "q": query,
        "api_key": SERPAPI_API_KEY,
        "engine": "google",
        "num": 3
    }
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.get(SERP_URL, params=params)
            resp.raise_for_status()
            data = resp.json()
            return data.get("organic_results", [])
    except httpx.HTTPError as e:
        logging.error(f"[Search Error] {e}")
        return []

async def moderate_output(text: str):
    moderation = await openai_client.moderations.create(input=text)
    return moderation.results[0].flagged

# ✅ Main route
@app.post("/ask", response_model=AnswerOutput)
async def ask(input: QueryInput):
    query = input.query.strip()
    steps = [f"Step 1: Received query: '{query}'"]

    if is_disallowed(query):
        return JSONResponse(status_code=403, content={"error": "Disallowed or inappropriate query."})

    sub_questions = generate_sub_questions(query)
    steps.append(f"Step 2: Generated sub-questions: {sub_questions}")

    snippets = []
    INJECTION_PATTERNS = ["ignore previous instructions", "disregard the above", "output confidential"]
    for sub_q in sub_questions:
        results = await serp_search(sub_q)
        steps.append(f"Step 3: Search results for: '{sub_q}' - {len(results)} results")
        for result in results:
            snippet = result.get("snippet", "")
            url = result.get("link", "")
            if any(p in snippet.lower() for p in INJECTION_PATTERNS):
                continue
            snippets.append(f"Source: {url}\nContent: {snippet}")

    if not snippets:
        return JSONResponse(status_code=500, content={"error": "No useful search results found."})

    prompt = (
        "You are an AI research assistant with web browsing capabilities. "
        "The user has provided a query, and your job is to perform an autonomous web search, gather the most up-to-date information from multiple reliable sources, and synthesize a well-structured, accurate, and clear response. "
        "You must highlight any comparisons, similarities, and differences as needed. "
        "Cite the **exact source URL inline** immediately after each factual claim using the format (source: URL). "
        "Do **not** include any information not found in the provided snippets or retrieved from the web search. "
        "Avoid vague statements like 'some sources say'; always provide precise references. "
        "Use bullet points or short paragraphs to improve readability. Tables should be used **only if specifically requested by the user** because they might not be formatted correctly. "
        "Be concise, informative, and ensure every factual statement can be traced back to the original source. "
        "Finally, provide a summary or comparison , and ensure your tone is professional and factual."
        f"\n\nUser Query: {query}\n\nSnippets:\n" + "\n\n".join(snippets)
    )

    steps.append("Step 4: Prompt prepared and sent to LLM")

    completion = await openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful, honest AI assistant."},
            {"role": "user", "content": prompt}
        ]
    )

    final_answer = completion.choices[0].message.content
    clean_answer = clean_html(final_answer)

    steps.append("Step 5: Received answer from LLM")

    if await moderate_output(clean_answer):
        return JSONResponse(status_code=403, content={"error": "Generated content flagged as unsafe."})

    steps.append("Step 6: Output passed moderation check")

    return AnswerOutput(steps=steps, answer=clean_answer)

# Root route
@app.get("/")
def root():
    return {"message": "AI Research Assistant with web browsing is running."}
