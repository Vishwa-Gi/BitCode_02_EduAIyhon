import React, { useState } from 'react'
import axios from 'axios'
import './AiPdfMaker.css'

function AiPdfMaker() {
    const [pdfContent, setPdfContent] = useState('')
    const [response, setResponse] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        
        try {
            const result = await axios.post('http://localhost:3000/ai/get-pdf', {
                pdf: pdfContent
            })
            setResponse(result.data)
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to generate PDF')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container">
            <h1>AI Notes Maker</h1>
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="pdfContent">
                        Enter your content:
                    </label>
                    <textarea
                        id="pdfContent"
                        value={pdfContent}
                        onChange={(e) => setPdfContent(e.target.value)}
                        placeholder="Enter your content here..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !pdfContent}
                >
                    {loading ? 'Generating...' : 'Generate'}
                </button>
            </form>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {response && (
                <div className="response-container">
                    <h2>Generate:</h2>
                    <pre>
                        {JSON.stringify(response, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    )
}

export default AiPdfMaker