# How to Host Your Backend on the Cloud (Free)

Since I cannot create accounts or deploy code for you directly, I have prepared a "Ready-to-Deploy" package and this guide to help you host your server on **Render.com** (a popular free hosting service).

## Step 1: Get Your Code Ready
1.  I have created a folder called `backend` in your artifacts.
2.  It contains `index.js` (the server code) and `package.json` (settings).
3.  **Upload this code to GitHub**:
    *   Create a new repository on [GitHub.com](https://github.com).
    *   Upload the files from the `backend` folder to that repository.

## Step 2: Deploy on Render
1.  Go to [dashboard.render.com](https://dashboard.render.com/) and sign up/login.
2.  Click **"New +"** and select **"Web Service"**.
3.  Connect your GitHub account and select the repository you just created.
4.  **Configure the settings**:
    *   **Name**: `gautam-stream-save-backend` (or anything you like).
    *   **Region**: Choose the one closest to you (e.g., Singapore or Frankfurt).
    *   **Branch**: `main` (or `master`).
    *   **Root Directory**: Leave blank (or `.` ).
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node index.js`
    *   **Plan**: Select **"Free"**.
5.  Click **"Create Web Service"**.

## Step 3: Get Your Live URL
1.  Render will take a minute to build and deploy.
2.  Once done, you will see a URL at the top like: `https://gautam-stream-save-backend.onrender.com`.
3.  **Copy this URL**.

## Step 4: Update Your Website
1.  Open your `website.html` file.
2.  Find the JavaScript code where we fetch data (currently it's mocked).
3.  You would replace the mock logic with a real fetch call to your new URL:
    ```javascript
    // Example of how to connect
    fetch('https://YOUR-RENDER-URL.onrender.com/api/video-info?url=' + videoUrl)
        .then(response => response.json())
        .then(data => renderResults(data));
    ```
