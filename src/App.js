import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaGithub, FaLinkedin, FaCopy, FaEnvelope } from "react-icons/fa";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [emailContent, setEmailContent] = useState("");
  const [formData, setFormData] = useState({
    recipient: "",
    subject: "",
    tone: "professional",
    purpose: "",
    additionalInfo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(
        process.env.REACT_APP_GEMINI_API_KEY
      );
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Write an email with the following details:
        To: ${formData.recipient}
        Subject: ${formData.subject}
        Tone: ${formData.tone}
        Purpose: ${formData.purpose}
        Additional Information: ${formData.additionalInfo}
        
        Please format it as a proper email.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setEmailContent(text);
    } catch (error) {
      console.error("Error generating email:", error);
      setEmailContent("Error generating email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailContent);
    alert("Email copied to clipboard!");
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-container">
          <FaEnvelope className="logo-icon" />
          <h1>Eloquence AI</h1>
        </div>
        <p>Generate professional emails with AI</p>
      </header>

      <main className="App-main">
        <div className="form-container">
          <form onSubmit={generateEmail}>
            <div className="form-group">
              <label htmlFor="recipient">Recipient</label>
              <input
                type="text"
                id="recipient"
                name="recipient"
                value={formData.recipient}
                onChange={handleChange}
                placeholder="e.g., HR Manager, Client, etc."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Brief subject of your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tone">Tone</label>
              <select
                id="tone"
                name="tone"
                value={formData.tone}
                onChange={handleChange}
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="purpose">Purpose</label>
              <textarea
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="What do you want to achieve with this email?"
                rows="3"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="additionalInfo">Additional Information</label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Any other details you want to include"
                rows="3"
              ></textarea>
            </div>

            <button type="submit" className="generate-btn" disabled={loading}>
              {loading ? "Generating..." : "Generate Email"}
            </button>
          </form>
        </div>

        {emailContent && (
          <div className="result-container">
            <h2>Generated Email</h2>
            <div className="email-content">
              <pre>{emailContent}</pre>
            </div>
            <button onClick={copyToClipboard} className="copy-btn">
              <FaCopy /> Copy to Clipboard
            </button>
          </div>
        )}
      </main>

      <footer className="App-footer">
        <div className="developer-info">
          <p>Developed by Ashutosh Swamy</p>
          <div className="social-links">
            <a
              href="https://github.com/ashutoshswamy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub />
            </a>
            <a
              href="https://linkedin.com/in/ashutoshswamy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
