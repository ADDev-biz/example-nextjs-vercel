"use client";

import { withPageWrapper } from "../components/withPageWrapper";
import { useState } from "react";

function GcrHealthPageContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'unhealthy' | null>(null);

  const handleTestHealth = async () => {
    setIsLoading(true);
    setError("");
    setResponse("");
    setHealthStatus(null);

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

        // Determine health status based on response
        // Check for common health status indicators
        const isHealthy = data.status === 'healthy' ||
                         data.health === 'healthy' ||
                         data.status === 'ok' ||
                         data.health === 'ok' ||
                         (data.status === 'up' || data.health === 'up') ||
                         (typeof data === 'object' && Object.keys(data).length > 0 && !data.error);

        setHealthStatus(isHealthy ? 'healthy' : 'unhealthy');
      } else {
        setError(data.error || 'An error occurred while testing health');
        if (data.details) {
          setError(prev => prev + ` (${data.details})`);
        }
        setHealthStatus('unhealthy');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
      console.error('Health check error:', err);
      setHealthStatus('unhealthy');
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

            {/* Health Status Indicator */}
            {healthStatus && (
              <div className="mt-4 flex justify-center">
                <div
                  className={`w-4 h-4 rounded-full ${
                    healthStatus === 'healthy'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                  title={healthStatus === 'healthy' ? 'System is healthy' : 'System is unhealthy'}
                ></div>
              </div>
            )}
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
const GcrHealthClient = withPageWrapper(GcrHealthPageContent, {
  title: "GCR Health Test",
  description: "Test the health status of the GCR system",
  className: "bg-gradient-to-br from-blue-50 to-indigo-100",
});

export default GcrHealthClient;
