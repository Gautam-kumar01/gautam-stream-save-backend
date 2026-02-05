# How to Fix "Unable to Retrieve Video" with Cookies

If monitoring shows that the server is blocked by YouTube (common on Render/Heroku), you need to provide a `cookies.txt` file.

## Step 1: Get the Extension
1.  Install the **Get cookies.txt LOCALLY** extension for Chrome or Firefox.
    *   [Chrome Link](https://chrome.google.com/webstore/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc)
    *   [Firefox Link](https://addons.mozilla.org/en-US/firefox/addon/get-cookies-txt-locally/)

## Step 2: Export Cookies
1.  Go to **[YouTube.com](https://www.youtube.com)**.
2.  **Log in** to your account (preferably a dummy account, not your main one, just to be safe).
3.  Click the extension icon.
4.  Click **"Export"** to download the `cookies.txt` file.

## Step 3: Upload to GitHub
1.  Rename the downloaded file to exactly `cookies.txt`.
2.  Go to your GitHub repository: `https://github.com/Gautam-kumar01/gautam-stream-save-backend`
3.  Click **"Add file"** -> **"Upload files"**.
4.  Drag and drop your `cookies.txt`.
5.  Click **"Commit changes"**.

## Step 4: Done!
Render will automatically redeploy. The server will detect the file and use it to authenticate, bypassing the block.
