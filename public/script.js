document.addEventListener('DOMContentLoaded', () => {
    const videoUrlInput = document.getElementById('videoUrl');
    const downloadBtn = document.getElementById('downloadBtn');
    const messageArea = document.getElementById('messageArea');
    const resultsSection = document.getElementById('resultsSection');
    const qualityGrid = document.getElementById('qualityGrid');
    const videoTitle = document.getElementById('videoTitle');

    // Blocked keywords for safety filter
    const BLOCKED_KEYWORDS = [
        'xxx', 'porn', 'adult', 'sex', 'nude', 'naked', 'erotic', 'nsfw', '18+', 'uncensored'
    ];

    // Determine API Base URL
    function getApiBaseUrl() {
        const hostname = window.location.hostname;
        // If running on localhost (but not port 3000) or via file protocol, assume backend is at localhost:3000
        if ((hostname === 'localhost' || hostname === '127.0.0.1') && window.location.port !== '3000') {
            return 'http://localhost:3000';
        }
        if (window.location.protocol === 'file:') {
            return 'http://localhost:3000';
        }
        // Otherwise (production or same-origin), use relative path
        return '';
    }

    const API_BASE_URL = getApiBaseUrl();


    // Health Check
    fetch(`${API_BASE_URL}/health`)
        .then(res => {
            if (res.ok) console.log('Server is healthy');
            else console.error('Server health check failed');
        })
        .catch(err => console.error('Server unreachable:', err));

    downloadBtn.addEventListener('click', handleDownload);
    videoUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleDownload();
    });

    async function handleDownload() {
        const url = videoUrlInput.value.trim();

        // Reset UI
        messageArea.innerHTML = '';
        messageArea.className = 'message-area';
        resultsSection.classList.add('hidden');

        // Validation
        if (!url) {
            showError('Please enter a video URL.');
            return;
        }

        if (!isValidUrl(url)) {
            showError('Please enter a valid URL (e.g., https://youtube.com/...)');
            return;
        }

        // Safety Filter
        if (isUnsafeContent(url)) {
            showError('⚠️ Content blocked. This website does not support adult or explicit content.');
            return;
        }

        // Processing
        showLoading();

        try {
            const response = await fetch(`${API_BASE_URL}/api/video-info?url=${encodeURIComponent(url)}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch video info');
            }

            const data = await response.json();
            showResults(data, url);

        } catch (error) {
            console.error(error);
            let errorMsg = error.message || 'An error occurred while fetching video details.';
            if (error.message.includes('Failed to fetch')) {
                errorMsg = 'Error: Could not connect to server. The server might be waking up (wait 30s) or is offline.';
            }
            showError(errorMsg);
            resetButton();
        }
    }

    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    function isUnsafeContent(url) {
        const lowerUrl = url.toLowerCase();
        return BLOCKED_KEYWORDS.some(keyword => lowerUrl.includes(keyword));
    }

    function showError(msg) {
        messageArea.textContent = msg;
        messageArea.className = 'message-area error-msg';
    }

    function showLoading() {
        downloadBtn.innerHTML = '<span class="loader"></span> Processing...';
        downloadBtn.disabled = true;
    }

    function resetButton() {
        downloadBtn.innerHTML = `<span>Get Video</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;
        downloadBtn.disabled = false;
    }

    function showResults(data, originalUrl) {
        resetButton();

        // Update Title and Thumbnail
        videoTitle.textContent = data.title;
        // You might want to update the thumbnail image source here if you had an img tag
        // For now, we'll just keep the placeholder or update if there's an img element
        const thumbContainer = document.querySelector('.thumbnail-placeholder');
        if (data.thumbnail) {
            thumbContainer.innerHTML = `<img src="${data.thumbnail}" alt="Video Thumbnail" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
        }

        // Generate Buttons
        if (data.qualities && data.qualities.length > 0) {
            qualityGrid.innerHTML = data.qualities.map(q => {
                const badge = q.hd ? 'HD' : 'SD';
                const downloadLink = `${API_BASE_URL}/download?url=${encodeURIComponent(originalUrl)}&itag=${q.itag}&title=${encodeURIComponent(data.title)}`;

                return `
                <a href="${downloadLink}" class="quality-card" target="_blank">
                    <span class="quality-badge">${badge}</span>
                    <div class="quality-label">${q.label}</div>
                    <span class="file-size">${q.size || 'UNK'}</span>
                </a>
            `}).join('');
        } else {
            qualityGrid.innerHTML = '<p>No download formats found.</p>';
        }

        resultsSection.classList.remove('hidden');
    }

    // 3D Visuals Removed
});
