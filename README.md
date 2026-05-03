#  RejeshaTech: AI-Enhanced Tech Support

Welcome to the official repository for **RejeshaTech**! 

To be frank, this has been quite the journey. Built as my final year Applied Computer Science (ACS) project at Daystar University, RejeshaTech aims to bridge the gap between clients with faulty gadgets and the *fundis* (technicians) who can fix them, regardless of their location in Kenya. 

Restoring tech, renewing trust!

---

## 1. The Timeline (Since March 2026)

*   **March 2026 (The Idea & Design Phase):** Started wrestling with the core concept after drawing inspiration from my attachment at Suetech. Laid down the initial UI layouts, sketched the ERDs, and realized that fitting a multi-role system into one app was going to be... intense.
*   **April 2026 (Backend Battles & Routing Headaches):** The month of misadventures! Fought with Expo Router's `_layout.jsx` files to get nested modals working without cluttering the root code. Battled Aiven MySQL connections and finally got Cloudinary to accept image uploads without crashing the server.
*   **May 2026 (The Polish):** Refined the UI, fixed the infamous "Network Error 404" fetch bugs (shoutout to Expo Web), implemented robust RBAC (Role-Based Access Control) on registration, and added a few cheeky Easter eggs just in time for the panel presentation. 

---

##  2. The Tech Stack

I wanted a modern, JavaScript-heavy stack that could handle cross-platform delivery natively.
*   **Frontend:** React Native (powered by Expo & Expo Router for flawless web/mobile navigation).
*   **Backend:** Node.js & Express.
*   **Database:** MySQL (Hosted on the cloud via Aiven).
*   **Asset Management:** Cloudinary (Because saving raw image strings directly to SQL is a recipe for disaster).
*   **Hosting:** Render (for that sweet, sweet BaaS deployment).
*   **AI Integration:** Gemini API (Google AI Studio) to act as our preliminary tech-support assistant.

---

##  3. Setup & Installation (The `.env` Survival Guide)

If you are cloning this to run locally, please learn from my misadventures. Environment variables in Expo will humble you.

**Prerequisites:** You need Node.js and MySQL installed locally (or an Aiven cloud string).

1. **Clone & Install:**
   ```bash
   git clone <your-repo-link>
   cd rejesha-tech
   
   # Open two terminals. One for API, one for UI.
   cd rejesha-tech-api && npm install
   cd ../rejesha-tech-ui && npm install

   
2. **Backend .env (rejesha-tech-api)**
1. **Clone & Install:**
1. **Clone & Install:**