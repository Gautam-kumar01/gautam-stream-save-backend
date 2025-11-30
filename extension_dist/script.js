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

    downloadBtn.addEventListener('click', handleDownload);
    videoUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleDownload();
    });

    function handleDownload() {
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

        // Simulate Processing
        showLoading();
        
        // Simulate API delay
        setTimeout(() => {
            showResults(url);
        }, 1500);
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

    function showResults(url) {
        // Reset button
        downloadBtn.innerHTML = `<span>Get Video</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;
        downloadBtn.disabled = false;

        // Mock Data Generation
        const qualities = [
            { label: '1080p', size: '145.2 MB', badge: 'HD' },
            { label: '720p', size: '85.5 MB', badge: 'HD' },
            { label: '480p', size: '42.1 MB', badge: 'SD' },
            { label: '360p', size: '28.4 MB', badge: 'SD' },
            { label: '240p', size: '15.2 MB', badge: 'Low' },
            { label: '144p', size: '8.5 MB', badge: 'Low' }
        ];

        // Update Title (Mock)
        videoTitle.textContent = `Video from ${new URL(url).hostname}`;

        // Generate Buttons
        qualityGrid.innerHTML = qualities.map(q => `
            <a href="#" class="quality-card" onclick="alert('Download started for ${q.label}!'); return false;">
                <span class="quality-badge">${q.badge}</span>
                <div class="quality-label">${q.label}</div>
                <span class="file-size">${q.size}</span>
            </a>
        `).join('');

        resultsSection.classList.remove('hidden');
    }
});
