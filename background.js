// background.js - Service Worker for APK Analyzer

console.log('Background script loaded');

chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked');
  // Open the full-screen analyzer when the extension icon is clicked
  openAnalyzer();
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  if (request.action === 'openAnalyzer') {
    console.log('Opening analyzer from message');
    openAnalyzer();
    sendResponse({ success: true });
    return true; // Keep the message channel open for async response
  }
});

function openAnalyzer() {
  console.log('Opening analyzer...');
  try {
    const url = chrome.runtime.getURL('analyzer.html');
    console.log('Analyzer URL:', url);
    chrome.tabs.create({
      url: url
    }).then((tab) => {
      console.log('Tab created successfully:', tab.id);
    }).catch((error) => {
      console.error('Failed to create tab:', error);
    });
  } catch (error) {
    console.error('Error in openAnalyzer:', error);
  }
}

// Handle any runtime errors
chrome.runtime.onStartup.addListener(() => {
  console.log('APK Analyzer extension started');
});

chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed/updated:', details.reason);
  if (details.reason === 'install') {
    // Open the analyzer on first install
    console.log('First install - opening analyzer');
    openAnalyzer();
  }
});
