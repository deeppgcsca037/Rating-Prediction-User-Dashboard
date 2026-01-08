import React, { useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)

  const handleRatingClick = (value) => {
    setRating(value)
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    
    if (!reviewText.trim()) {
      setError('Please write a review')
      return
    }

    if (reviewText.length > 5000) {
      setError('Review text is too long (maximum 5000 characters)')
      return
    }

    setSubmitting(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch(`${API_URL}/api/submit-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: rating,
          review_text: reviewText,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review')
      }

      if (data.success) {
        setResponse({
          reviewId: data.review_id,
          aiResponse: data.ai_response,
        })
        // Reset form
        setRating(0)
        setReviewText('')
      } else {
        throw new Error(data.error || 'Submission failed')
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>Share Your Experience</h1>
          <p>Your feedback helps us improve</p>
        </header>

        {!response ? (
          <form onSubmit={handleSubmit} className="review-form">
            <div className="rating-section">
              <label>Rate your experience</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`star ${rating >= value ? 'selected' : ''}`}
                    onClick={() => handleRatingClick(value)}
                    disabled={submitting}
                  >
                    ★
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="rating-text">
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </p>
              )}
            </div>

            <div className="review-section">
              <label htmlFor="review-text">Write your review</label>
              <textarea
                id="review-text"
                value={reviewText}
                onChange={(e) => {
                  setReviewText(e.target.value)
                  setError(null)
                }}
                placeholder="Tell us about your experience..."
                rows="6"
                maxLength={5000}
                disabled={submitting}
              />
              <div className="char-count">
                {reviewText.length} / 5000 characters
              </div>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="submit-button"
              disabled={submitting || rating === 0 || !reviewText.trim()}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <div className="success-container">
            <div className="success-icon">✓</div>
            <h2>Thank You!</h2>
            <p className="success-message">Your review has been submitted successfully.</p>
            
            {response.aiResponse && (
              <div className="ai-response">
                <h3>Our Response:</h3>
                <p>{response.aiResponse}</p>
              </div>
            )}

            <button
              className="submit-button"
              onClick={() => {
                setResponse(null)
                setRating(0)
                setReviewText('')
              }}
            >
              Submit Another Review
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App


