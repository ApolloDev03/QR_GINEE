import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../config";

function TermsCondition() {
  const [term, setTerm] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const page_id = 1; // Define page_id here

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const { data } = await axios.post(
          `${apiUrl}/pages`,
          { page_id }
        );
        console.log("API Response:", data);

        if (data && data.status === "success" && data.Page) {
          setTerm(data.Page);
        } else {
          setTerm(null); // Set null if data.Page is not present
        }
      } catch (error) {
        console.error("Error fetching page content:", error);
        setError("Failed to load terms and conditions.");
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchTerms();
  }, [page_id]);

  if (loading) {
    return (
      <div className="loader">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    );
  }

  return (
    <section className="section-gap">
      <div className="main-term">
        <div className="container">
          {error ? (
            <p>{error}</p>
          ) : (
            term && (
              <div>
                <h2 className="text-center term-head">{term.page_name}</h2>
                <p className="term-description" dangerouslySetInnerHTML={{ __html: term.description }} />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default TermsCondition;
