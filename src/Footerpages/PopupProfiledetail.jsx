import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../config";

function Popup({ onClose }) {
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const { data } = await axios.post(
          `${apiUrl}/pages`,
          { page_id: 1 }
        );
        console.log("API Response:", data);

        if (data && data.status === "success" && data.Page) {
          setTerm(data.Page);
        } else {
          setTerm(null);
        }
      } catch (error) {
        console.error("Error fetching page content:", error);
        setError("Failed to load terms and conditions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  return (
    <div className="popup-overlay_termspopup">
      <div className="popup-content_termspopup">
        {/* Close Button */}
        <button onClick={onClose} className="close-button_termspopup">X</button>

        {/* Loading State */}
        {loading && (
          <div className="loader">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}

        {/* Terms and Conditions */}
        {term && (
          <div className="terms-container">
            <h3 className="text-center term-head">{term.page_name}</h3>
            <div 
              className="term-description_termspopup" 
              dangerouslySetInnerHTML={{ __html: term.description }} 
            />
            {!loading && (
              <div className="button-container">
                <button onClick={onClose} className="btn btn_main">Accept</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Popup;
