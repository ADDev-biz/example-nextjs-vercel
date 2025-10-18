"use client";

import { withPageWrapper } from "../components/withPageWrapper";
import { useState } from "react";

function GcrHealthPageContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleTestHealth = async () => {
    setIsLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await fetch('/api/gcr-health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(JSON.stringify(data, null, 2));
      } else {
        setError(data.error || 'An error occurred while testing health');
        if (data.details) {
          setError(prev => prev + ` (${data.details})`);
        }
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
      console.error('Health check error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-base-content mb-4">
          GCR Health Test
        </h2>
        <p className="text-base-content/70">
          Test the health status of the GCR system by clicking the button below.
        </p>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="text-center mb-6">
            <button
              onClick={handleTestHealth}
              disabled={isLoading}
              className={`btn btn-primary btn-lg ${
                isLoading ? 'loading' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Testing Health...
                </>
              ) : (
                'Test Health'
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="alert alert-error mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Response Display */}
          {response && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Health Response</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-96 font-mono text-sm"
                value={response}
                readOnly
                placeholder="Health response will appear here..."
              />
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-base-200 rounded-lg">
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ul className="text-sm space-y-1">
              <li>• Click "Test Health" to check the GCR system status</li>
              <li>• The button will be disabled while the test is running</li>
              <li>• The response will be displayed in the text area below</li>
              <li>• Any errors will be shown in red above the response area</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Using HOC to wrap the page with PageWrapper
const GcrHealthPage = withPageWrapper(GcrHealthPageContent, {
  title: "GCR Health Test",
  description: "Test the health status of the GCR system",
  className: "bg-gradient-to-br from-blue-50 to-indigo-100",
});

export default GcrHealthPage;
