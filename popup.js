// popup.js - APK Size Analyzer functionality

/**
 * Reads and analyzes an APK/ZIP file
 * @param {File} file - The APK/ZIP file to analyze
 * @returns {Object} - Object containing folder and extension size data
 */
async function readApk(file) {
  try {
    console.log('Reading APK file:', file.name, 'Size:', file.size);
    
    // Check file size limit (100MB)
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File "${file.name}" is too large (${humanReadableSize(file.size)}). Maximum supported size is ${humanReadableSize(MAX_FILE_SIZE)}.`);
    }
    
    const zip = await JSZip.loadAsync(file);
    const sizes = { folder: {}, ext: {} };
    const fileEntries = Object.entries(zip.files);
    
    console.log(`Processing ${fileEntries.length} entries in ${file.name}`);

    // Process all files in the ZIP/APK
    let processedCount = 0;
    for (const [fileName, fileEntry] of fileEntries) {
      if (!fileEntry.dir) { // Skip directories
        // Try different ways to get file size
        let bytes = 0;
        
        try {
          // Method 1: Try uncompressedSize property (most efficient)
          if (typeof fileEntry.uncompressedSize === 'number') {
            bytes = fileEntry.uncompressedSize;
          }
          // Method 2: Try _data if available
          else if (fileEntry._data && typeof fileEntry._data.uncompressedSize === 'number') {
            bytes = fileEntry._data.uncompressedSize;
          }
          // Method 3: For small files, get actual content (fallback)
          else if (file.size < 10 * 1024 * 1024) { // Only for files < 10MB
            const content = await fileEntry.async('uint8array');
            bytes = content.length;
          }
          // Method 4: Estimate from compressed size
          else if (typeof fileEntry.compressedSize === 'number') {
            bytes = fileEntry.compressedSize; // Not ideal but better than 0
            console.warn(`Using compressed size for ${fileName} (${bytes} bytes)`);
          }
        } catch (sizeError) {
          console.warn('Could not get size for file:', fileName, sizeError);
          bytes = 0;
        }
        
        // Folder grouping - get the top-level folder
        const pathParts = fileName.split('/');
        const folder = pathParts.length > 1 ? pathParts[0] + '/' : 'root';
        sizes.folder[folder] = (sizes.folder[folder] || 0) + bytes;
        
        // Extension grouping
        const extMatch = fileName.match(/\.(\w+)$/);
        const ext = extMatch ? '.' + extMatch[1] : 'no_ext';
        sizes.ext[ext] = (sizes.ext[ext] || 0) + bytes;
      }
      
      processedCount++;
      // Yield control occasionally for large files
      if (processedCount % 100 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    console.log('APK analysis complete. Folders:', Object.keys(sizes.folder).length, 'Extensions:', Object.keys(sizes.ext).length);
    return sizes;
  } catch (error) {
    console.error('Error reading APK:', error);
    throw new Error(`Failed to read APK file "${file.name}". Please ensure it's a valid APK or ZIP file. Error: ${error.message}`);
  }
}

/**
 * Formats bytes into human-readable format
 * @param {number} bytes - Number of bytes
 * @returns {string} - Human-readable size string
 */
function humanReadableSize(bytes) {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = Math.abs(bytes);
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  const formattedSize = size.toFixed(2);
  return `${bytes < 0 ? '-' : ''}${formattedSize} ${units[unitIndex]}`;
}

/**
 * Renders comparison table
 * @param {string} tableId - ID of the table element
 * @param {Object} dataOld - Old APK data
 * @param {Object} dataNew - New APK data
 */
function renderTable(tableId, dataOld, dataNew) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  tbody.innerHTML = '';
  
  // Get all unique keys and sort them
  const keys = [...new Set([...Object.keys(dataOld), ...Object.keys(dataNew)])].sort();
  
  keys.forEach(key => {
    const oldVal = dataOld[key] || 0;
    const newVal = dataNew[key] || 0;
    const delta = newVal - oldVal;
    
    const row = document.createElement('tr');
    
    // Add class for styling based on change
    if (delta > 0) {
      row.classList.add('increase');
    } else if (delta < 0) {
      row.classList.add('decrease');
    }
    
    row.innerHTML = `
      <td class="name">${key}</td>
      <td class="size">${humanReadableSize(oldVal)}</td>
      <td class="size">${humanReadableSize(newVal)}</td>
      <td class="change ${delta >= 0 ? 'positive' : 'negative'}">
        ${delta >= 0 ? '+' : ''}${humanReadableSize(delta)}
      </td>
    `;
    
    tbody.appendChild(row);
  });
}

/**
 * Calculates and displays total size summary
 * @param {Object} oldData - Old APK data
 * @param {Object} newData - New APK data
 */
function renderSummary(oldData, newData) {
  const oldTotal = Object.values(oldData.folder).reduce((sum, size) => sum + size, 0);
  const newTotal = Object.values(newData.folder).reduce((sum, size) => sum + size, 0);
  const totalDelta = newTotal - oldTotal;
  
  const summaryElement = document.getElementById('totalSize');
  summaryElement.innerHTML = `
    <div class="summary-item">
      <span class="label">Old APK Total:</span>
      <span class="value">${humanReadableSize(oldTotal)}</span>
    </div>
    <div class="summary-item">
      <span class="label">New APK Total:</span>
      <span class="value">${humanReadableSize(newTotal)}</span>
    </div>
    <div class="summary-item total-change">
      <span class="label">Total Change:</span>
      <span class="value ${totalDelta >= 0 ? 'positive' : 'negative'}">
        ${totalDelta >= 0 ? '+' : ''}${humanReadableSize(totalDelta)}
      </span>
    </div>
  `;
}

/**
 * Shows loading indicator
 * @param {string} message - Loading message to display
 * @param {number} progress - Progress percentage (0-100)
 */
function showLoading(message = 'Analyzing APK files...', progress = 0) {
  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('results').classList.add('hidden');
  document.getElementById('analyzeBtn').disabled = true;
  document.getElementById('loadingText').textContent = message;
  document.getElementById('progressFill').style.width = `${progress}%`;
}

/**
 * Updates loading progress
 * @param {string} message - Loading message to display
 * @param {number} progress - Progress percentage (0-100)
 */
function updateProgress(message, progress) {
  document.getElementById('loadingText').textContent = message;
  document.getElementById('progressFill').style.width = `${progress}%`;
}

/**
 * Hides loading indicator
 */
function hideLoading() {
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('analyzeBtn').disabled = false;
}

/**
 * Shows results section
 */
function showResults() {
  document.getElementById('results').classList.remove('hidden');
}

/**
 * Shows error message
 * @param {string} message - Error message to display
 */
function showError(message) {
  alert(`Error: ${message}`);
}

// Event listener for the analyze button
document.getElementById('analyzeBtn').addEventListener('click', async () => {
  const fileOld = document.getElementById('fileOld').files[0];
  const fileNew = document.getElementById('fileNew').files[0];
  
  // Validate file selection
  if (!fileOld || !fileNew) {
    showError('Please select both APK files before analyzing.');
    return;
  }
  
  // Validate file types
  const validExtensions = ['.apk', '.zip'];
  const oldFileExt = fileOld.name.toLowerCase().substring(fileOld.name.lastIndexOf('.'));
  const newFileExt = fileNew.name.toLowerCase().substring(fileNew.name.lastIndexOf('.'));
  
  if (!validExtensions.includes(oldFileExt) || !validExtensions.includes(newFileExt)) {
    showError('Please select valid APK or ZIP files.');
    return;
  }
  
  try {
    showLoading('Preparing analysis...', 0);
    console.log('Starting APK analysis...');
    
    // Read and analyze APK files sequentially to avoid memory issues
    updateProgress('Reading old APK: ' + fileOld.name, 10);
    console.log('Reading old APK:', fileOld.name);
    const oldData = await readApk(fileOld);
    
    updateProgress('Reading new APK: ' + fileNew.name, 50);
    console.log('Reading new APK:', fileNew.name);
    const newData = await readApk(fileNew);
    
    updateProgress('Generating comparison tables...', 80);
    console.log('Rendering results...');
    // Render comparison tables
    renderTable('folderTable', oldData.folder, newData.folder);
    renderTable('extTable', oldData.ext, newData.ext);
    
    updateProgress('Finalizing results...', 95);
    // Render summary
    renderSummary(oldData, newData);
    
    updateProgress('Complete!', 100);
    // Show results
    setTimeout(() => {
      hideLoading();
      showResults();
    }, 500); // Brief delay to show completion
    
    console.log('Analysis complete!');
    
  } catch (error) {
    hideLoading();
    console.error('Analysis failed:', error);
    showError(error.message || 'An unexpected error occurred during analysis.');
  }
});

// Optional: Add drag and drop functionality
function setupDragAndDrop() {
  ['fileOld', 'fileNew'].forEach(inputId => {
    const input = document.getElementById(inputId);
    const container = input.parentElement;
    
    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      container.classList.add('dragover');
    });
    
    container.addEventListener('dragleave', () => {
      container.classList.remove('dragover');
    });
    
    container.addEventListener('drop', (e) => {
      e.preventDefault();
      container.classList.remove('dragover');
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        input.files = files;
      }
    });
  });
}

// Initialize drag and drop when the DOM is loaded
document.addEventListener('DOMContentLoaded', setupDragAndDrop);
