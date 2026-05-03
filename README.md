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
    Create a .env file in the rejesha-tech-api folder.

    Code snippet
    DB_HOST=your_aiven_host
    DB_USER=your_aiven_user
    DB_PASSWORD=your_aiven_password
    DB_NAME=db1
    PORT=5000
    CLOUDINARY_UPLOAD_PRESET=rejesha_tech_products
    # ... add your Cloudinary keys here
3. **Frontend .env (rejesha-tech-ui) - CRITICAL :**
    Create a .env file in the rejesha-tech-ui folder. In Expo, your variables MUST start with EXPO_PUBLIC_ or the frontend will silently ignore them and throw a 404!

    Code snippet
    EXPO_PUBLIC_BASE_URL=http://localhost:5000 
    # Change to your Render URL when deploying!
    Run the App:

    Bash
    # Terminal 1 (API)
    npm start

    # Terminal 2 (UI)
    npx expo start
4. **Successful Features of v1**
    Flawless Cross-Platform Routing: Heavy use of Expo's (tabs), (auth), and (modals) route groups keeps the layout clean while delivering perfect slide-up animations on mobile and forced back-arrows on the web.

    Role-Based Access Control: Users register their Primary and Secondary roles (Client, Technician, or Teacher). The app dictates what they can view and edit based on this.

    Cloudinary Integration: Technicians can upload images of parts directly from their phone gallery, which are securely hosted and linked to our Aiven database.

    The "Tunaanza Upya" Easter Egg: A custom reset modal that triggers a legendary meme video while silently truncating the dummy database tables.

5. **Features That Fell Short (For Now)**
    Let's be honest, no v1 is perfect. Here is what is slated for v2 (hopefully before graduation in November!):

    True Password Resets: Currently, the "Forgot Password" UI is beautifully routed, but the actual backend email-verification logic is missing. It just pops a "Coming Soon" alert and safely routes you back to login.

    Live AI Image Diagnostics: Getting the Gemini API to consistently and accurately diagnose a bloated Realme battery from a blurry user photo is harder than it looks. The text-based diagnostics work, but the image-recognition portion needs more prompt engineering.

    Dynamic Maps: The UI is ready, but fully integrating the Google Maps SDK to trace exact GPS coordinates of nearby fundis proved to be out of scope for the current deadline.

6. **Acknowledgements**
    Massive thanks to my supervisor, Dr. Joshua Okemwa, for the guidance, and to the team at Suetech Business Systems for the attachment experience that birthed this idea.

    To the Daystar panel reviewing this: Thank you for your time. Enjoy the app!