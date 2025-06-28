// popup-script.js - Popup functionality for APK Analyzer

// Debug: Log when script loads
console.log('Popup script loaded');

document.addEventListener('DOMContentLoaded', () => {
  // Debug: Check if chrome APIs are available
  console.log('Chrome runtime available:', !!chrome.runtime);
  if (chrome.runtime) {
    console.log('Extension URL:', chrome.runtime.getURL('analyzer.html'));
  }

  // Main button event listener
  document.getElementById('openFullScreen').addEventListener('click', async () => {
    console.log('Button clicked');
    try {
      // Method 1: Send message to background script
      console.log('Trying to send message to background script...');
      const response = await chrome.runtime.sendMessage({ action: 'openAnalyzer' });
      console.log('Message sent successfully:', response);
      window.close();
    } catch (error) {
      console.error('Method 1 failed:', error);
      
      // Method 2: Try to open directly
      try {
        console.log('Trying direct tab creation...');
        await chrome.tabs.create({
          url: chrome.runtime.getURL('analyzer.html')
        });
        console.log('Direct tab creation successful');
        window.close();
      } catch (fallbackError) {
        console.error('Method 2 failed:', fallbackError);
        
        // Method 3: Try window.open
        try {
          console.log('Trying window.open...');
          const analyzerUrl = chrome.runtime.getURL('analyzer.html');
          console.log('Analyzer URL:', analyzerUrl);
          window.open(analyzerUrl, '_blank');
          window.close();
        } catch (windowOpenError) {
          console.error('Method 3 failed:', windowOpenError);
          alert('Could not open analyzer. Please check the browser console for errors.');
        }
      }
    }
  });

  // Alternative direct link
  document.getElementById('directLink').addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Direct link clicked');
    try {
      const analyzerUrl = chrome.runtime.getURL('analyzer.html');
      console.log('Opening URL:', analyzerUrl);
      window.open(analyzerUrl, '_blank');
      window.close();
    } catch (error) {
      console.error('Direct link failed:', error);
      alert('Error: ' + error.message);
    }
  });
});
