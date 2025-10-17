"use client";

import { withPageWrapper } from "../components/withPageWrapper";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

function ContactPageContent() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTimestamp, setPopupTimestamp] = useState("");
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(false);

  // Fetch CSRF token when user is authenticated
  useEffect(() => {
    const fetchCSRFToken = async () => {
      if (session && status === 'authenticated') {
        setIsLoadingToken(true);
        try {
          const response = await fetch('/api/csrf-token');
          if (response.ok) {
            const data = await response.json();
            setCsrfToken(data.csrfToken);
          }
        } catch (error) {
          console.error('Failed to fetch CSRF token:', error);
        } finally {
          setIsLoadingToken(false);
        }
      }
    };

    fetchCSRFToken();
  }, [session, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!session) {
      setPopupMessage('Please sign in to submit the contact form');
      setPopupTimestamp(new Date().toLocaleString());
      setShowPopup(true);
      return;
    }

    // Check if CSRF token is available
    if (!csrfToken) {
      setPopupMessage('Security token not available. Please refresh the page and try again.');
      setPopupTimestamp(new Date().toLocaleString());
      setShowPopup(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          csrfToken
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setPopupMessage(result.message);
        setPopupTimestamp(result.receivedAt);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setPopupMessage(result.error || 'An error occurred');
        setPopupTimestamp(new Date().toLocaleString());
      }
    } catch (error) {
      setPopupMessage('Failed to send message. Please try again.');
      setPopupTimestamp(new Date().toLocaleString());
    } finally {
      setIsSubmitting(false);
      setShowPopup(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-base-content mb-4">
          Get in Touch
        </h2>
        <p className="text-base-content/70">
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>hello@example.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>123 Main St, City, State 12345</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-primary text-primary-content shadow-lg">
            <div className="card-body">
              <h3 className="card-title">Business Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Send us a Message</h3>
            
            {/* Authentication Status */}
            {status === 'loading' && (
              <div className="alert alert-info">
                <span className="loading loading-spinner loading-sm"></span>
                Checking authentication...
              </div>
            )}
            
            {status === 'unauthenticated' && (
              <div className="alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                <span>Please sign in to submit the contact form.</span>
              </div>
            )}
            
            {status === 'authenticated' && !csrfToken && !isLoadingToken && (
              <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Security token not available. Please refresh the page.</span>
              </div>
            )}
            
            {status === 'authenticated' && isLoadingToken && (
              <div className="alert alert-info">
                <span className="loading loading-spinner loading-sm"></span>
                Loading security token...
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Message</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="textarea textarea-bordered h-24"
                  required
                ></textarea>
              </div>
              <div className="form-control mt-6">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting || status !== 'authenticated' || !csrfToken || isLoadingToken}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Sending...
                    </>
                  ) : status !== 'authenticated' ? (
                    'Sign In Required'
                  ) : !csrfToken ? (
                    'Loading Security Token...'
                  ) : (
                    'Send Message'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-green-500 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {popupMessage}
              </h3>
              <p className="text-gray-600 mb-4">
                Received at: {popupTimestamp}
              </p>
              <button
                onClick={() => setShowPopup(false)}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Using HOC to wrap the page with PageWrapper
const ContactPage = withPageWrapper(ContactPageContent, {
  title: "Contact Us",
  description: "Get in touch with our team",
  className: "bg-gradient-to-br from-green-50 to-emerald-100",
});

export default ContactPage;
