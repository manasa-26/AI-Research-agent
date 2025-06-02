import { useState } from "react"
import "./App.css"

function App() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [answer, setAnswer] = useState("")
  const [error, setError] = useState("")
  const [steps, setSteps] = useState([])

  // Your backend configuration
  const BACKEND_URL = "http://127.0.0.1:8000"
  const ASK_ENDPOINT = "/ask"
  
  const suggestedQueries = [
    "How is generative AI used in healthcare?",
    "Latest developments in quantum computing",
    "Climate change impact on agriculture",
    "Blockchain applications in supply chain",
    "Machine learning in drug discovery",
  ]

  const recentSearches = [
    "AI ethics in autonomous vehicles",
    "Renewable energy storage solutions",
    "CRISPR gene editing advances",
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError("")
    setAnswer("")
    setSteps([])

    try {
      console.log('Sending request to:', `${BACKEND_URL}${ASK_ENDPOINT}`)
      console.log('Query:', query)

      const response = await fetch(`${BACKEND_URL}${ASK_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query  // Your backend expects 'query' field
        }),
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || `HTTP error! status: ${response.status}`
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('Response data:', data)
      
      // Your backend returns {steps: [...], answer: "..."}
      if (data.answer) {
        setAnswer(data.answer)
        setSteps(data.steps || [])
        
        // Scroll to results
        setTimeout(() => {
          const resultsSection = document.getElementById("results-section")
          if (resultsSection) {
            resultsSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
        }, 100)
      } else {
        throw new Error("No answer received from backend")
      }

    } catch (error) {
      console.error('Research failed:', error)
      setError(`Failed to get research results: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuery = (suggestedQuery) => {
    setQuery(suggestedQuery)
  }

  return (
    <div className="app-container">
      <div className="content-container">
        {/* Header */}
        <div className="header">
          <div className="header-title">
            <span className="header-icon">🧠</span>
            <h1 className="title">AI Research Assistant</h1>
          </div>
          <p className="subtitle">
            Get comprehensive research answers with real-time web browsing and AI-powered analysis
          </p>
          <div className="features">
            <div className="feature">
              <span className="feature-icon">🌐</span>
              Web Browsing
            </div>
            <div className="feature">
              <span className="feature-icon">✨</span>
              AI Analysis
            </div>
            <div className="feature">
              <span className="feature-icon">📄</span>
              Citations
            </div>
          </div>
        </div>

        {/* Main Search Interface */}
        <div className="card search-card">
          <div className="card-content">
            <form onSubmit={handleSubmit} className="search-form">
              <div className="textarea-container">
                <textarea
                  placeholder="Ask any research question... (e.g., How is generative AI transforming healthcare?)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="search-textarea"
                />
                <div className="textarea-buttons">
                  <button type="button" className="icon-button">
                    🎤
                  </button>
                  <button type="button" className="icon-button">
                    📁
                  </button>
                </div>
              </div>

              <div className="button-container">
                <button
                  type="submit"
                  className={`search-button ${isLoading ? "loading" : ""}`}
                  disabled={isLoading || !query.trim()}
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      Researching...
                    </>
                  ) : (
                    <>
                      <span className="button-icon">🔍</span>
                      Research & Analyze
                    </>
                  )}
                </button>
                <button type="button" className="action-button">
                  ⚡
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="card error-card">
            <div className="card-content">
              <div className="error-message">
                <span className="error-icon">❌</span>
                {error}
                <div className="error-details">
                  <small>Make sure your FastAPI backend is running on http://127.0.0.1:8000</small>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Queries */}
        <div className="card suggestions-card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-title-icon">📈</span>
              Trending Research Topics
            </h2>
          </div>
          <div className="card-content">
            <div className="suggestions-container">
              {suggestedQueries.map((suggestion, index) => (
                <div key={index} className="suggestion-badge" onClick={() => handleSuggestedQuery(suggestion)}>
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="card recent-searches-card">
            <div className="card-header">
              <h2 className="card-title">
                <span className="card-title-icon">🕒</span>
                Recent Searches
              </h2>
            </div>
            <div className="card-content">
              <div className="recent-searches-container">
                {recentSearches.map((search, index) => (
                  <div key={index} className="recent-search-item" onClick={() => handleSuggestedQuery(search)}>
                    <span className="recent-search-icon">📖</span>
                    <span>{search}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Processing Steps (Optional Debug Info) */}
        {steps.length > 0 && (
          <div className="card steps-card">
            <div className="card-header">
              <h2 className="card-title">
                <span className="card-title-icon">⚙️</span>
                Processing Steps
              </h2>
            </div>
            <div className="card-content">
              <div className="steps-container">
                {steps.map((step, index) => (
                  <div key={index} className="step-item">
                    <span className="step-number">{index + 1}</span>
                    <span className="step-text">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Answer Section */}
        {answer && (
          <div id="results-section" className="card results-card">
            <div className="results-header">
              <h2 className="results-title">
                <span className="results-title-icon">✨</span>
                Research Results
              </h2>
              <p className="results-subtitle">AI-powered analysis with web browsing and citations</p>
            </div>
            <div className="results-content">
              <div className="results-text">
                <div className="answer-text">{answer}</div>
              </div>
              <div className="separator"></div>
              <div className="results-footer">
                <div className="results-info">
                  <div className="info-item">
                    <span className="info-icon">🌐</span>
                    Backend Connected
                  </div>
                  <div className="info-item">
                    <span className="info-icon">🕒</span>
                    Generated just now
                  </div>
                </div>
                <div className="completion-badge">✓ Complete</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
