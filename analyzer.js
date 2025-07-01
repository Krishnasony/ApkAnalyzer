// analyzer.js - Full Screen APK Size Analyzer

// Debug: Check if libraries loaded
console.log('APK Analyzer: Script loading...');
console.log('JSZip available:', typeof JSZip !== 'undefined');
console.log('Chart available:', typeof Chart !== 'undefined');
if (typeof Chart !== 'undefined') {
  console.log('Chart.js version:', Chart.version);
} else {
  console.error('Chart.js is not loaded!');
}

class APKAnalyzer {
  // SDK Detection patterns - comprehensive list of Android libraries and SDKs
  static SDK_PATTERNS = {
    // Google/Firebase SDKs
    'Firebase': [
      'com/google/firebase/',
      'com/google/android/gms/',
      'firebase-',
      'com/google/firebase'
    ],
    'Google Play Services': [
      'com/google/android/gms/',
      'play-services-'
    ],
    'Google AdMob': [
      'com/google/android/gms/ads/',
      'com/google/ads/',
      'admob-'
    ],
    'Google Analytics': [
      'com/google/analytics/',
      'com/google/android/gms/analytics/',
      'analytics-'
    ],
    'Google Maps': [
      'com/google/android/gms/maps/',
      'play-services-maps'
    ],
    
    // Meta/Facebook SDKs
    'Facebook SDK': [
      'com/facebook/',
      'facebook-android-sdk',
      'facebook-core',
      'facebook-login'
    ],
    'Facebook Audience Network': [
      'com/facebook/ads/',
      'audience-network-sdk'
    ],
    
    // UI Libraries
    'Android Support/AndroidX': [
      'android/support/',
      'androidx/',
      'support-v4',
      'appcompat-v7',
      'appcompat'
    ],
    'Material Design': [
      'com/google/android/material/',
      'design-',
      'material-'
    ],
    'Constraint Layout': [
      'androidx/constraintlayout/',
      'constraintlayout-'
    ],
    'RecyclerView': [
      'androidx/recyclerview/',
      'recyclerview-'
    ],
    'ViewPager2': [
      'androidx/viewpager2/',
      'viewpager2-'
    ],
    'Fragment': [
      'androidx/fragment/',
      'fragment-'
    ],
    'CardView': [
      'androidx/cardview/',
      'cardview-'
    ],
    
    // Networking Libraries
    'OkHttp': [
      'okhttp3/',
      'com/squareup/okhttp/',
      'okhttp-'
    ],
    'Retrofit': [
      'retrofit2/',
      'com/squareup/retrofit/',
      'retrofit-'
    ],
    'Volley': [
      'com/android/volley/',
      'volley-'
    ],
    'Apache HTTP': [
      'org/apache/http/',
      'httpclient-'
    ],
    
    // Image Loading Libraries
    'Glide': [
      'com/bumptech/glide/',
      'glide-'
    ],
    'Picasso': [
      'com/squareup/picasso/',
      'picasso-'
    ],
    'Fresco': [
      'com/facebook/fresco/',
      'fresco-'
    ],
    'Coil': [
      'coil-kt/',
      'io/coil-kt/',
      'coil-'
    ],
    'Universal Image Loader': [
      'com/nostra13/universalimageloader/',
      'universal-image-loader'
    ],
    
    // JSON Processing
    'Gson': [
      'com/google/gson/',
      'gson-'
    ],
    'Jackson': [
      'com/fasterxml/jackson/',
      'jackson-'
    ],
    'Moshi': [
      'com/squareup/moshi/',
      'moshi-'
    ],
    
    // Database Libraries
    'Room': [
      'androidx/room/',
      'room-'
    ],
    'Realm': [
      'io/realm/',
      'realm-android'
    ],
    'SQLite': [
      'android/database/sqlite/'
    ],
    'ObjectBox': [
      'io/objectbox/',
      'objectbox-'
    ],
    'GreenDAO': [
      'org/greenrobot/greendao/',
      'greendao-'
    ],
    
    // Dependency Injection
    'Dagger': [
      'dagger/',
      'com/google/dagger/'
    ],
    'Hilt': [
      'dagger/hilt/',
      'hilt-android'
    ],
    'Koin': [
      'org/koin/',
      'koin-'
    ],
    
    // Reactive Programming
    'RxJava': [
      'io/reactivex/',
      'rxjava'
    ],
    'RxAndroid': [
      'rxandroid'
    ],
    'RxBinding': [
      'com/jakewharton/rxbinding',
      'rxbinding'
    ],
    
    // Event Bus
    'EventBus': [
      'org/greenrobot/eventbus/',
      'eventbus-'
    ],
    'Otto': [
      'com/squareup/otto/',
      'otto-'
    ],
    
    // Testing Libraries
    'JUnit': [
      'junit/',
      'org/junit/'
    ],
    'Mockito': [
      'org/mockito/',
      'mockito-'
    ],
    'Espresso': [
      'androidx/test/espresso/',
      'espresso-'
    ],
    'Robolectric': [
      'org/robolectric/',
      'robolectric-'
    ],
    
    // Logging
    'Timber': [
      'timber/',
      'com/jakewharton/timber/'
    ],
    'SLF4J': [
      'org/slf4j/',
      'slf4j-'
    ],
    
    // Crash Reporting & Analytics
    'Crashlytics': [
      'com/crashlytics/',
      'firebase-crashlytics'
    ],
    'Bugsnag': [
      'com/bugsnag/',
      'bugsnag-'
    ],
    'Flurry': [
      'com/flurry/',
      'flurry-'
    ],
    'Mixpanel': [
      'com/mixpanel/',
      'mixpanel-'
    ],
    'Amplitude': [
      'com/amplitude/',
      'amplitude-'
    ],
    
    // Push Notifications
    'Firebase Messaging': [
      'com/google/firebase/messaging/',
      'firebase-messaging'
    ],
    'OneSignal': [
      'com/onesignal/',
      'onesignal-'
    ],
    'Pusher': [
      'com/pusher/',
      'pusher-'
    ],
    
    // Payment SDKs
    'Stripe': [
      'com/stripe/',
      'stripe-'
    ],
    'PayPal': [
      'com/paypal/',
      'paypal-'
    ],
    'Square': [
      'com/squareup/sdk/',
      'square-'
    ],
    'Braintree': [
      'com/braintreepayments/',
      'braintree-'
    ],
    
    // Social Media SDKs
    'Twitter SDK': [
      'com/twitter/',
      'twitter-'
    ],
    'LinkedIn SDK': [
      'com/linkedin/',
      'linkedin-'
    ],
    'Instagram': [
      'com/instagram/',
      'instagram-'
    ],
    
    // Video & Media
    'ExoPlayer': [
      'com/google/android/exoplayer/',
      'exoplayer-'
    ],
    'YouTube Player': [
      'com/google/android/youtube/',
      'youtube-player'
    ],
    'Lottie': [
      'com/airbnb/lottie/',
      'lottie-'
    ],
    'Wistia': [
      'com/wistia/',
      'wistia-'
    ],
    
    // Camera & Image Processing
    'CameraX': [
      'androidx/camera/',
      'camera-'
    ],
    'ZXing': [
      'com/google/zxing/',
      'zxing-'
    ],
    'ML Kit': [
      'com/google/mlkit/',
      'play-services-mlkit'
    ],
    
    // Location & Maps
    'Mapbox': [
      'com/mapbox/',
      'mapbox-'
    ],
    'HERE Maps': [
      'com/here/',
      'here-'
    ],
    
    // Animation Libraries
    'ViewPropertyAnimator': [
      'com/nineoldandroids/',
      'nineoldandroids-'
    ],
    'Spring Animation': [
      'androidx/dynamicanimation/',
      'dynamicanimation-'
    ],
    
    // Barcode & QR Code
    'ZBar': [
      'net/sourceforge/zbar/',
      'zbar-'
    ],
    'QR Code Reader': [
      'com/dlazaro66/qrcodereaderview/',
      'qrcodereaderview-'
    ],
    
    // Cloud Storage
    'AWS SDK': [
      'com/amazonaws/',
      'aws-android-sdk'
    ],
    'Dropbox SDK': [
      'com/dropbox/',
      'dropbox-'
    ],
    'Google Drive': [
      'com/google/api/services/drive/',
      'play-services-drive'
    ],
    
    // Native Libraries & NDK
    'Native Code (.so)': [
      'lib/',
      '.so'
    ],
    'OpenCV': [
      'org/opencv/',
      'opencv-'
    ],
    'FFmpeg': [
      'ffmpeg',
      'libavcodec',
      'libavformat'
    ],
    
    // Kotlin & Coroutines
    'Kotlin Runtime': [
      'kotlin/',
      'kotlinx/',
      'kotlin-stdlib'
    ],
    'Kotlin Coroutines': [
      'kotlinx/coroutines/',
      'kotlinx-coroutines'
    ],
    
    // Architecture Components
    'Navigation': [
      'androidx/navigation/',
      'navigation-'
    ],
    'Lifecycle': [
      'androidx/lifecycle/',
      'lifecycle-'
    ],
    'ViewModel': [
      'androidx/lifecycle/viewmodel/',
      'viewmodel-'
    ],
    'LiveData': [
      'androidx/lifecycle/livedata/',
      'livedata-'
    ],
    'WorkManager': [
      'androidx/work/',
      'work-'
    ],
    'Paging': [
      'androidx/paging/',
      'paging-'
    ],
    'DataBinding': [
      'androidx/databinding/',
      'databinding-'
    ],
    
    // Security
    'Biometric': [
      'androidx/biometric/',
      'biometric-'
    ],
    'Security Crypto': [
      'androidx/security/',
      'security-'
    ],
    
    // Communication
    'WebRTC': [
      'org/webrtc/',
      'webrtc-'
    ],
    'Socket.IO': [
      'io/socket/',
      'socket.io-'
    ],
    'MQTT': [
      'org/eclipse/paho/',
      'paho-'
    ],
    
    // Utility Libraries
    'Apache Commons': [
      'org/apache/commons/',
      'commons-'
    ],
    'Guava': [
      'com/google/common/',
      'guava-'
    ],
    'Joda Time': [
      'org/joda/time/',
      'joda-time'
    ],
    'ThreeTen': [
      'org/threeten/',
      'threetenbp'
    ],
    
    // Additional specific patterns for better categorization
    'App Main Code': [
      'classes.dex',
      'classes2.dex', 
      'classes3.dex'
    ],
    'Manifest & Signatures': [
      'AndroidManifest.xml',
      'META-INF/MANIFEST.MF',
      'META-INF/CERT.',
      'META-INF/*.RSA',
      'META-INF/*.SF'
    ],
    'ProGuard/R8': [
      'proguard',
      'r8-'
    ],
    'Build Tools': [
      'com/android/build/',
      'build-tools'
    ],
    'Annotation Processing': [
      'javax/annotation/',
      'org/jetbrains/annotations/',
      'androidx/annotation/'
    ]
  };

  constructor() {
    this.oldFileData = null;
    this.newFileData = null;
    this.detailedOldData = null;
    this.detailedNewData = null;
    this.isAnalyzing = false;
    this.currentPath = '';
    this.currentPage = 1;
    this.itemsPerPage = 50;
    this.charts = {};
    this.init();
  }

  init() {
    console.log('APKAnalyzer initializing...');
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
      console.error('Chart.js is not loaded!');
      this.showError('Chart.js library failed to load. Please refresh the page.');
      return;
    } else {
      console.log('Chart.js loaded successfully, version:', Chart.version);
    }
    
    // Check if we're in an extension context
    console.log('Extension context:', {
      isExtension: !!chrome?.runtime,
      location: window.location.href,
      protocol: window.location.protocol
    });
    
    this.setupEventListeners();
    this.setupDragAndDrop();
    this.setupTabs();
    this.setupDetailedAnalysis();
    
    // Test file input accessibility after setup
    setTimeout(() => {
      this.testFileInputs();
    }, 100);
  }
  
  testFileInputs() {
    console.log('Testing file input accessibility...');
    
    const fileOldInput = document.getElementById('fileOld');
    const fileNewInput = document.getElementById('fileNew');
    
    if (fileOldInput) {
      console.log('Old file input properties:', {
        hidden: fileOldInput.hidden,
        disabled: fileOldInput.disabled,
        display: getComputedStyle(fileOldInput).display,
        visibility: getComputedStyle(fileOldInput).visibility,
        pointerEvents: getComputedStyle(fileOldInput).pointerEvents
      });
    }
    
    if (fileNewInput) {
      console.log('New file input properties:', {
        hidden: fileNewInput.hidden,
        disabled: fileNewInput.disabled,
        display: getComputedStyle(fileNewInput).display,
        visibility: getComputedStyle(fileNewInput).visibility,
        pointerEvents: getComputedStyle(fileNewInput).pointerEvents
      });
    }
  }

  setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // File input listeners
    const fileOldInput = document.getElementById('fileOld');
    const fileNewInput = document.getElementById('fileNew');
    
    if (fileOldInput) {
      fileOldInput.addEventListener('change', (e) => {
        console.log('Old file input changed:', e.target.files?.[0]?.name);
        if (e.target.files && e.target.files[0]) {
          this.handleFileSelect(e.target.files[0], 'old');
        }
      });
    }

    if (fileNewInput) {
      fileNewInput.addEventListener('change', (e) => {
        console.log('New file input changed:', e.target.files?.[0]?.name);
        if (e.target.files && e.target.files[0]) {
          this.handleFileSelect(e.target.files[0], 'new');
        }
      });
    }

    // Analyze button
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => {
        console.log('Analyze button clicked');
        console.log('Current files:', {
          oldFile: this.oldFile?.name || 'not selected',
          newFile: this.newFile?.name || 'not selected'
        });
        
        if (!this.oldFile || !this.newFile) {
          this.showError('Please select both APK files before analyzing.');
          return;
        }
        
        this.analyzeFiles();
      });
    }

    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportResults();
      });
    }
  }

  setupDragAndDrop() {
    console.log('Setting up drag and drop handlers...');
    
    const dropZoneOld = document.getElementById('dropZoneOld');
    const dropZoneNew = document.getElementById('dropZoneNew');
    
    // Drag and drop handlers for both zones
    [dropZoneOld, dropZoneNew].forEach((zone, index) => {
      if (!zone) return;
      
      const fileType = index === 0 ? 'old' : 'new';
      
      zone.addEventListener('dragenter', (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
      });
      
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
      });
      
      zone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        if (!zone.contains(e.relatedTarget)) {
          zone.classList.remove('dragover');
        }
      });
      
      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
        
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
          console.log('File dropped:', files[0].name, 'for type:', fileType);
          this.handleFileSelect(files[0], fileType);
        } else {
          console.log('No files found in drop event');
        }
      });
    });
  }

  setupTabs() {
    document.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', () => {
        const tabName = button.dataset.tab;
        this.switchTab(tabName);
      });
    });
  }

  setupDetailedAnalysis() {
    // Search functionality
    document.getElementById('fileSearch').addEventListener('input', (e) => {
      this.searchFiles(e.target.value);
    });

    // Sort functionality
    document.getElementById('sortBy').addEventListener('change', (e) => {
      this.sortFiles(e.target.value);
    });

    // Filter functionality
    document.getElementById('filterBy').addEventListener('change', (e) => {
      this.filterFiles(e.target.value);
    });

    // Pagination
    document.getElementById('prevPage').addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.renderFileExplorer();
      }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
      const maxPages = Math.ceil(this.filteredFiles?.length / this.itemsPerPage) || 1;
      if (this.currentPage < maxPages) {
        this.currentPage++;
        this.renderFileExplorer();
      }
    });
  }

  switchTab(tabName) {
    // Remove active class from all tabs and panels
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));

    // Add active class to selected tab and panel
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');

    // Initialize charts when switching to relevant tabs
    if (this.oldFileData && this.newFileData) {
      setTimeout(() => {
        switch(tabName) {
          case 'overview':
            this.renderOverviewCharts();
            break;
          case 'folders':
            this.renderFoldersChart();
            break;
          case 'extensions':
            this.renderExtensionsChart();
            break;
          case 'sdks':
            this.renderSDKsChart();
            break;
          case 'details':
            this.renderFileExplorer();
            break;
        }
      }, 100);
    }
  }

  handleFileSelect(file, type) {
    console.log(`Handling file select: ${file?.name} for ${type}`);
    if (!file) {
      console.log('No file provided');
      return;
    }

    const dropZone = document.getElementById(type === 'old' ? 'dropZoneOld' : 'dropZoneNew');
    const fileInfo = document.getElementById(type === 'old' ? 'fileInfoOld' : 'fileInfoNew');

    if (!dropZone || !fileInfo) {
      console.error('Drop zone or file info element not found:', {
        dropZone: !!dropZone,
        fileInfo: !!fileInfo,
        type
      });
      return;
    }

    // Validate file type
    const validExtensions = ['.apk', '.zip'];
    const fileExt = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExt)) {
      console.log('Invalid file extension:', fileExt);
      this.showError('Please select a valid APK or ZIP file.');
      return;
    }

    console.log(`Valid file selected: ${file.name} (${this.humanReadableSize(file.size)})`);

    // Add visual feedback immediately
    dropZone.style.borderColor = '#27ae60';
    dropZone.style.background = '#e8f5e8';

    // Update UI
    dropZone.classList.add('has-file');
    fileInfo.innerHTML = `
      <strong>${file.name}</strong><br>
      Size: ${this.humanReadableSize(file.size)}
    `;

    // Store file reference
    if (type === 'old') {
      this.oldFile = file;
      console.log('Old file stored:', this.oldFile.name);
    } else {
      this.newFile = file;
      console.log('New file stored:', this.newFile.name);
    }

    // Show success message briefly
    fileInfo.style.background = 'rgba(39, 174, 96, 0.2)';
    setTimeout(() => {
      fileInfo.style.background = 'rgba(52, 152, 219, 0.1)';
    }, 1000);

    this.updateAnalyzeButton();
  }

  updateAnalyzeButton() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const hasFiles = this.oldFile && this.newFile;
    
    console.log('Updating analyze button:', {
      hasOldFile: !!this.oldFile,
      hasNewFile: !!this.newFile,
      hasFiles,
      isAnalyzing: this.isAnalyzing
    });
    
    analyzeBtn.disabled = !hasFiles || this.isAnalyzing;
    
    if (hasFiles && !this.isAnalyzing) {
      analyzeBtn.innerHTML = '<span class="button-icon">🔍</span> Analyze APK Files';
    } else if (this.isAnalyzing) {
      analyzeBtn.innerHTML = '<span class="button-icon">⏳</span> Analyzing...';
    } else {
      analyzeBtn.innerHTML = '<span class="button-icon">🔍</span> Select both APK files first';
    }
  }

  async analyzeFiles() {
    console.log('analyzeFiles called with:', {
      oldFile: this.oldFile?.name || 'null',
      newFile: this.newFile?.name || 'null',
      isAnalyzing: this.isAnalyzing
    });
    
    if (!this.oldFile || !this.newFile) {
      this.showError('Both APK files must be selected before analysis.');
      return;
    }
    
    if (this.isAnalyzing) {
      console.log('Analysis already in progress');
      return;
    }

    this.isAnalyzing = true;
    this.updateAnalyzeButton();

    try {
      this.showLoading('Preparing analysis...', 0);

      // Read old APK
      this.updateProgress('Reading old APK: ' + this.oldFile.name, 10);
      this.oldFileData = await this.readApk(this.oldFile);

      // Read new APK
      this.updateProgress('Reading new APK: ' + this.newFile.name, 50);
      this.newFileData = await this.readApk(this.newFile);

      // Generate results
      this.updateProgress('Generating comparison tables...', 80);
      this.renderResults();

      this.updateProgress('Complete!', 100);
      
      // Show results after brief delay
      setTimeout(() => {
        this.hideLoading();
        this.showResults();
      }, 500);

    } catch (error) {
      this.hideLoading();
      this.showError(error.message || 'An unexpected error occurred during analysis.');
      console.error('Analysis failed:', error);
    } finally {
      this.isAnalyzing = false;
      this.updateAnalyzeButton();
    }
  }

  async readApk(file) {
    console.log('Reading APK file:', file.name, 'Size:', file.size);
    
    // Check file size limit (200MB for full screen version)
    const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File "${file.name}" is too large (${this.humanReadableSize(file.size)}). Maximum supported size is ${this.humanReadableSize(MAX_FILE_SIZE)}.`);
    }

    try {
      const zip = await JSZip.loadAsync(file);
      const sizes = { folder: {}, ext: {}, sdk: {} };
      const detailedData = { files: [], folders: new Set() };
      const fileEntries = Object.entries(zip.files);
      
      console.log(`Processing ${fileEntries.length} entries in ${file.name}`);

      let processedCount = 0;
      for (const [fileName, fileEntry] of fileEntries) {
        if (!fileEntry.dir) {
          let bytes = 0;
          
          try {
            // Use the most reliable method for getting file size
            if (typeof fileEntry.uncompressedSize === 'number') {
              bytes = fileEntry.uncompressedSize;
            } else if (fileEntry._data && typeof fileEntry._data.uncompressedSize === 'number') {
              bytes = fileEntry._data.uncompressedSize;
            } else {
              // For files where we can't get uncompressed size, use compressed size
              bytes = fileEntry.compressedSize || 0;
            }
          } catch (sizeError) {
            console.warn('Could not get size for file:', fileName, sizeError);
            bytes = 0;
          }
          
          // Folder grouping
          const pathParts = fileName.split('/');
          const folder = pathParts.length > 1 ? pathParts[0] + '/' : 'root';
          sizes.folder[folder] = (sizes.folder[folder] || 0) + bytes;
          
          // Extension grouping
          const extMatch = fileName.match(/\.(\w+)$/);
          const ext = extMatch ? '.' + extMatch[1] : 'no_ext';
          sizes.ext[ext] = (sizes.ext[ext] || 0) + bytes;

          // SDK Detection
          const detectedSDKs = this.detectSDKs(fileName);
          for (const sdk of detectedSDKs) {
            sizes.sdk[sdk] = (sizes.sdk[sdk] || 0) + bytes;
          }

          // Detailed file data
          detailedData.files.push({
            path: fileName,
            name: pathParts[pathParts.length - 1],
            folder: folder,
            extension: ext,
            size: bytes,
            directory: pathParts.slice(0, -1).join('/') || 'root',
            sdks: detectedSDKs
          });

          // Track folders
          for (let i = 0; i < pathParts.length - 1; i++) {
            const folderPath = pathParts.slice(0, i + 1).join('/');
            detailedData.folders.add(folderPath);
          }
        }
        
        processedCount++;
        // Yield control periodically to prevent UI freezing
        if (processedCount % 200 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1));
        }
      }

      detailedData.folders = Array.from(detailedData.folders);
      console.log('APK analysis complete. Folders:', Object.keys(sizes.folder).length, 'Extensions:', Object.keys(sizes.ext).length, 'SDKs:', Object.keys(sizes.sdk).length, 'Files:', detailedData.files.length);
      return { sizes, detailedData };
    } catch (error) {
      console.error('Error reading APK:', error);
      throw new Error(`Failed to read APK file "${file.name}". Please ensure it's a valid APK or ZIP file. Error: ${error.message}`);
    }
  }

  // Detect SDKs based on file path
  detectSDKs(filePath) {
    const detectedSDKs = [];
    
    // Check against all SDK patterns
    for (const [sdkName, patterns] of Object.entries(APKAnalyzer.SDK_PATTERNS)) {
      for (const pattern of patterns) {
        if (filePath.includes(pattern)) {
          detectedSDKs.push(sdkName);
          break; // Only add each SDK once per file
        }
      }
    }
    
    // If no specific SDK detected, categorize by folder structure and file type
    if (detectedSDKs.length === 0) {
      // Categorize by main APK folders
      if (filePath.startsWith('META-INF/')) {
        detectedSDKs.push('APK Metadata');
      } else if (filePath.startsWith('res/')) {
        detectedSDKs.push('App Resources');
      } else if (filePath.startsWith('assets/')) {
        detectedSDKs.push('App Assets');
      } else if (filePath.startsWith('classes') && filePath.endsWith('.dex')) {
        detectedSDKs.push('App Code (DEX)');
      } else if (filePath.includes('android/') && !filePath.includes('androidx/')) {
        detectedSDKs.push('Android Framework');
      } else if (filePath.includes('java/') || filePath.includes('javax/')) {
        detectedSDKs.push('Java Libraries');
      } else if (filePath.includes('org/apache/')) {
        detectedSDKs.push('Apache Libraries');
      } else if (filePath.includes('org/')) {
        detectedSDKs.push('Open Source Libraries');
      } else if (filePath.includes('com/') && !this.isKnownCompany(filePath)) {
        // Try to extract company/package name from com/ packages
        const packageMatch = filePath.match(/com\/([^\/]+)/);
        if (packageMatch) {
          const company = this.formatCompanyName(packageMatch[1]);
          detectedSDKs.push(`${company} Libraries`);
        } else {
          detectedSDKs.push('Third-party Libraries');
        }
      } else if (filePath.includes('io/') || filePath.includes('net/')) {
        detectedSDKs.push('Network Libraries');
      } else if (filePath.endsWith('.so')) {
        detectedSDKs.push('Native Libraries (.so)');
      } else if (filePath.endsWith('.png') || filePath.endsWith('.jpg') || filePath.endsWith('.webp')) {
        detectedSDKs.push('Image Assets');
      } else if (filePath.endsWith('.xml')) {
        detectedSDKs.push('XML Resources');
      } else if (filePath.endsWith('.json')) {
        detectedSDKs.push('JSON Data');
      } else if (filePath.endsWith('.ttf') || filePath.endsWith('.otf')) {
        detectedSDKs.push('Fonts');
      } else if (filePath.endsWith('.mp4') || filePath.endsWith('.mp3') || filePath.endsWith('.wav')) {
        detectedSDKs.push('Media Files');
      } else {
        detectedSDKs.push('Other');
      }
    }
    
    return detectedSDKs;
  }

  // Check if a package belongs to a known company we already categorize
  isKnownCompany(filePath) {
    const knownCompanies = [
      'google', 'facebook', 'amazon', 'microsoft', 'twitter', 'linkedin', 
      'paypal', 'stripe', 'square', 'mapbox', 'dropbox', 'crashlytics',
      'bugsnag', 'flurry', 'mixpanel', 'amplitude', 'onesignal', 'pusher',
      'squareup', 'bumptech', 'jakewharton', 'nostra13', 'greenrobot'
    ];
    
    return knownCompanies.some(company => filePath.includes(`com/${company}/`));
  }

  // Format company names for better readability
  formatCompanyName(companyName) {
    const companyMap = {
      'android': 'Android',
      'samsung': 'Samsung',
      'huawei': 'Huawei',
      'xiaomi': 'Xiaomi',
      'oppo': 'OPPO',
      'vivo': 'Vivo',
      'unity3d': 'Unity',
      'adobe': 'Adobe',
      'airbnb': 'Airbnb',
      'uber': 'Uber',
      'spotify': 'Spotify',
      'netflix': 'Netflix',
      'whatsapp': 'WhatsApp',
      'telegram': 'Telegram',
      'discord': 'Discord',
      'slack': 'Slack',
      'zoom': 'Zoom',
      'skype': 'Skype'
    };
    
    return companyMap[companyName.toLowerCase()] || companyName.charAt(0).toUpperCase() + companyName.slice(1);
  }

  renderResults() {
    // Store detailed data first for use in table rendering
    this.detailedOldData = this.oldFileData.detailedData;
    this.detailedNewData = this.newFileData.detailedData;
    
    // Update summary cards
    this.renderSummaryCards();
    
    // Render tables
    this.renderTable('folderTable', this.oldFileData.sizes.folder, this.newFileData.sizes.folder);
    this.renderTable('extTable', this.oldFileData.sizes.ext, this.newFileData.sizes.ext);
    this.renderTable('sdkTable', this.oldFileData.sizes.sdk, this.newFileData.sizes.sdk);
    
    // Render overview charts by default
    setTimeout(() => this.renderOverviewCharts(), 100);
  }

  renderSummaryCards() {
    const oldTotal = Object.values(this.oldFileData.sizes.folder).reduce((sum, size) => sum + size, 0);
    const newTotal = Object.values(this.newFileData.sizes.folder).reduce((sum, size) => sum + size, 0);
    const totalDelta = newTotal - oldTotal;

    document.getElementById('oldApkSize').textContent = this.humanReadableSize(oldTotal);
    document.getElementById('newApkSize').textContent = this.humanReadableSize(newTotal);
    
    const totalChangeEl = document.getElementById('totalChange');
    totalChangeEl.textContent = (totalDelta >= 0 ? '+' : '') + this.humanReadableSize(totalDelta);
    totalChangeEl.className = `summary-value ${totalDelta >= 0 ? 'positive' : 'negative'}`;
  }

  renderTable(tableId, dataOld, dataNew) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = '';
    
    const keys = [...new Set([...Object.keys(dataOld), ...Object.keys(dataNew)])];
    const isFolder = tableId === 'folderTable';
    
    // Create array of objects with key and change data for sorting
    const keyData = keys.map(key => {
      const oldVal = dataOld[key] || 0;
      const newVal = dataNew[key] || 0;
      const delta = newVal - oldVal;
      const percentChange = oldVal > 0 ? ((delta / oldVal) * 100) : (newVal > 0 ? 100 : 0);
      
      return {
        key,
        oldVal,
        newVal,
        delta,
        percentChange,
        absChange: Math.abs(delta)
      };
    });
    
    // Enhanced sorting: prioritize meaningful changes over tiny ones
    keyData.sort((a, b) => {
      // Calculate significance score (combines absolute size with relative change)
      const getSignificanceScore = (item) => {
        const { absChange, oldVal, newVal, percentChange } = item;
        
        // Base score from absolute change
        let score = absChange;
        
        // Boost score for larger absolute sizes (even if change is small)
        const maxSize = Math.max(oldVal, newVal);
        if (maxSize > 10 * 1024 * 1024) { // > 10MB
          score += maxSize * 0.1;
        } else if (maxSize > 1024 * 1024) { // > 1MB
          score += maxSize * 0.05;
        }
        
        // Boost score for significant percentage changes
        if (Math.abs(percentChange) > 50 && absChange > 1024) { // > 50% and > 1KB
          score *= 1.5;
        } else if (Math.abs(percentChange) > 100 && absChange > 512) { // > 100% and > 512B
          score *= 1.3;
        }
        
        // Heavily penalize very small changes (< 100 bytes) unless they're new/removed entirely
        if (absChange < 100 && oldVal > 0 && newVal > 0) {
          score *= 0.1;
        }
        
        return score;
      };
      
      const scoreA = getSignificanceScore(a);
      const scoreB = getSignificanceScore(b);
      
      if (scoreA !== scoreB) {
        return scoreB - scoreA; // Higher significance first
      }
      
      // Fallback: larger absolute change first
      if (a.absChange !== b.absChange) {
        return b.absChange - a.absChange;
      }
      
      // Final fallback: larger overall size first
      return Math.max(b.oldVal, b.newVal) - Math.max(a.oldVal, a.newVal);
    });
    
    keyData.forEach(({ key, oldVal, newVal, delta, percentChange }) => {
      const row = document.createElement('tr');
      
      if (delta > 0) {
        row.classList.add('increase');
      } else if (delta < 0) {
        row.classList.add('decrease');
      }
      
      let actionCell = '';
      if (isFolder) {
        actionCell = `<td><button class="explore-btn" onclick="analyzer.drillDownToFolder('${key}')">🔍 Explore</button></td>`;
      } else if (tableId === 'sdkTable') {
        // For SDK table, show impact indicator
        let impact = 'Low';
        if (Math.abs(delta) > 1024 * 1024) { // > 1MB
          impact = 'High';
        } else if (Math.abs(delta) > 100 * 1024) { // > 100KB
          impact = 'Medium';
        }
        actionCell = `<td><span class="impact-${impact.toLowerCase()}">${impact}</span></td>`;
      } else {
        // For extensions, count files (with null safety)
        let fileCount = 0;
        if (this.detailedNewData?.files && this.detailedOldData?.files) {
          fileCount = this.detailedNewData.files.filter(f => f.extension === key).length +
                     this.detailedOldData.files.filter(f => f.extension === key && 
                     !this.detailedNewData.files.find(nf => nf.path === f.path)).length;
        }
        actionCell = `<td>${fileCount}</td>`;
      }
      
      row.innerHTML = `
        <td class="name">${key}</td>
        <td class="size">${this.humanReadableSize(oldVal)}</td>
        <td class="size">${this.humanReadableSize(newVal)}</td>
        <td class="change ${delta >= 0 ? 'positive' : 'negative'}">
          ${delta >= 0 ? '+' : ''}${this.humanReadableSize(delta)}
        </td>
        <td class="percent ${percentChange >= 0 ? 'positive' : 'negative'}">
          ${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%
        </td>
        ${actionCell}
      `;
      
      tbody.appendChild(row);
    });
  }

  exportResults() {
    if (!this.oldFileData || !this.newFileData) return;

    const results = {
      timestamp: new Date().toISOString(),
      oldFile: this.oldFile.name,
      newFile: this.newFile.name,
      summary: {
        oldTotal: Object.values(this.oldFileData.folder).reduce((sum, size) => sum + size, 0),
        newTotal: Object.values(this.newFileData.folder).reduce((sum, size) => sum + size, 0)
      },
      byFolder: this.prepareExportData(this.oldFileData.folder, this.newFileData.folder),
      byExtension: this.prepareExportData(this.oldFileData.ext, this.newFileData.ext)
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apk-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  prepareExportData(oldData, newData) {
    const keys = [...new Set([...Object.keys(oldData), ...Object.keys(newData)])];
    return keys.map(key => ({
      name: key,
      oldSize: oldData[key] || 0,
      newSize: newData[key] || 0,
      change: (newData[key] || 0) - (oldData[key] || 0)
    }));
  }

  showLoading(message = 'Analyzing APK files...', progress = 0) {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('results').classList.add('hidden');
    document.getElementById('loadingText').textContent = message;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = `${progress}%`;
  }

  updateProgress(message, progress) {
    document.getElementById('loadingText').textContent = message;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = `${progress}%`;
  }

  hideLoading() {
    document.getElementById('loading').classList.add('hidden');
  }

  showResults() {
    document.getElementById('results').classList.remove('hidden');
  }

  showError(message) {
    alert(`Error: ${message}`);
  }

  humanReadableSize(bytes) {
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

  renderOverviewCharts() {
    this.renderOverviewChart();
    this.renderChangesChart();
    this.renderInsights();
  }

  renderOverviewChart() {
    if (typeof Chart === 'undefined') {
      console.error('Chart.js not available for overview chart');
      return;
    }
    
    const ctx = document.getElementById('overviewChart').getContext('2d');
    
    if (this.charts.overview) {
      this.charts.overview.destroy();
    }

    const oldTotal = Object.values(this.oldFileData.sizes.folder).reduce((sum, size) => sum + size, 0);
    const newTotal = Object.values(this.newFileData.sizes.folder).reduce((sum, size) => sum + size, 0);

    this.charts.overview = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Old APK', 'New APK'],
        datasets: [{
          label: 'APK Size',
          data: [oldTotal, newTotal],
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 99, 132, 0.8)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `Size: ${this.humanReadableSize(context.raw)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => this.humanReadableSize(value)
            }
          }
        }
      }
    });
  }

  renderChangesChart() {
    if (typeof Chart === 'undefined') {
      console.error('Chart.js not available for changes chart');
      return;
    }
    
    const ctx = document.getElementById('changesChart').getContext('2d');
    
    if (this.charts.changes) {
      this.charts.changes.destroy();
    }

    // Get top 10 folder changes
    const folderChanges = this.getTopChanges(this.oldFileData.sizes.folder, this.newFileData.sizes.folder, 10);

    this.charts.changes = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: folderChanges.map(item => item.name),
        datasets: [{
          label: 'Size Change',
          data: folderChanges.map(item => item.change),
          backgroundColor: folderChanges.map(item => 
            item.change >= 0 ? 'rgba(255, 99, 132, 0.8)' : 'rgba(75, 192, 192, 0.8)'
          ),
          borderColor: folderChanges.map(item =>
            item.change >= 0 ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)'
          ),
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y', // This makes it horizontal
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const change = context.raw;
                return `Change: ${change >= 0 ? '+' : ''}${this.humanReadableSize(change)}`;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              callback: (value) => this.humanReadableSize(value)
            }
          }
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const folderName = folderChanges[index].name;
            this.drillDownToFolder(folderName);
          }
        }
      }
    });
  }

  renderFoldersChart() {
    if (typeof Chart === 'undefined') {
      console.error('Chart.js not available for folders chart');
      return;
    }
    
    const ctx = document.getElementById('foldersChart').getContext('2d');
    
    if (this.charts.folders) {
      this.charts.folders.destroy();
    }

    const folderData = this.getTopChanges(this.oldFileData.sizes.folder, this.newFileData.sizes.folder, 15);

    this.charts.folders = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: folderData.map(item => item.name),
        datasets: [{
          data: folderData.map(item => Math.abs(item.change)),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#FF6384',
            '#C9CBCF', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384',
            '#36A2EB', '#FFCE56', '#FF9F40', '#C9CBCF', '#4BC0C0'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = folderData[context.dataIndex];
                return `${item.name}: ${item.change >= 0 ? '+' : ''}${this.humanReadableSize(item.change)}`;
              }
            }
          }
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const folderName = folderData[index].name;
            this.drillDownToFolder(folderName);
          }
        }
      }
    });
  }

  renderExtensionsChart() {
    if (typeof Chart === 'undefined') {
      console.error('Chart.js not available for extensions chart');
      return;
    }
    
    const ctx = document.getElementById('extensionsChart').getContext('2d');
    
    if (this.charts.extensions) {
      this.charts.extensions.destroy();
    }

    const extData = this.getTopChanges(this.oldFileData.sizes.ext, this.newFileData.sizes.ext, 10);

    this.charts.extensions = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: extData.map(item => item.name),
        datasets: [
          {
            label: 'Old Size',
            data: extData.map(item => item.oldSize),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'New Size',
            data: extData.map(item => item.newSize),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: ${this.humanReadableSize(context.raw)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => this.humanReadableSize(value)
            }
          }
        }
      }
    });
  }

  renderSDKsChart() {
    if (typeof Chart === 'undefined') {
      console.error('Chart.js not available for SDKs chart');
      return;
    }
    
    const ctx = document.getElementById('sdksChart').getContext('2d');
    
    if (this.charts.sdks) {
      this.charts.sdks.destroy();
    }

    const sdkData = this.getTopChanges(this.oldFileData.sizes.sdk, this.newFileData.sizes.sdk, 15);

    this.charts.sdks = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sdkData.map(item => item.name),
        datasets: [
          {
            label: 'Size Change',
            data: sdkData.map(item => item.change),
            backgroundColor: sdkData.map(item => 
              item.change >= 0 ? 'rgba(255, 99, 132, 0.6)' : 'rgba(75, 192, 192, 0.6)'
            ),
            borderColor: sdkData.map(item => 
              item.change >= 0 ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)'
            ),
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const change = context.raw;
                const item = sdkData[context.dataIndex];
                return [
                  `Change: ${change >= 0 ? '+' : ''}${this.humanReadableSize(change)}`,
                  `Old: ${this.humanReadableSize(item.oldSize)}`,
                  `New: ${this.humanReadableSize(item.newSize)}`
                ];
              }
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: (value) => this.humanReadableSize(value)
            }
          }
        }
      }
    });
  }

  renderInsights() {
    const container = document.getElementById('insightsContainer');
    const insights = this.generateInsights();
    
    container.innerHTML = insights.map(insight => `
      <div class="insight-card ${insight.type}">
        <div class="insight-icon">${insight.icon}</div>
        <div class="insight-content">
          <h4>${insight.title}</h4>
          <p>${insight.description}</p>
          ${insight.action ? `<button class="insight-action" onclick="analyzer.${insight.action}">${insight.actionText}</button>` : ''}
        </div>
      </div>
    `).join('');
  }

  generateInsights() {
    const insights = [];
    const oldTotal = Object.values(this.oldFileData.sizes.folder).reduce((sum, size) => sum + size, 0);
    const newTotal = Object.values(this.newFileData.sizes.folder).reduce((sum, size) => sum + size, 0);
    const totalDelta = newTotal - oldTotal;
    const percentChange = ((totalDelta / oldTotal) * 100);

    // Overall size change insight
    if (Math.abs(percentChange) > 5) {
      insights.push({
        type: percentChange > 0 ? 'warning' : 'positive',
        icon: percentChange > 0 ? '📈' : '📉',
        title: `APK Size ${percentChange > 0 ? 'Increased' : 'Decreased'} by ${Math.abs(percentChange).toFixed(1)}%`,
        description: `The APK size changed by ${totalDelta >= 0 ? '+' : ''}${this.humanReadableSize(totalDelta)}`,
        action: 'switchTab("folders")',
        actionText: 'View Folder Details'
      });
    }

    // Largest changes
    const folderChanges = this.getTopChanges(this.oldFileData.sizes.folder, this.newFileData.sizes.folder, 1);
    if (folderChanges.length > 0) {
      const largest = folderChanges[0];
      insights.push({
        type: largest.change > 0 ? 'info' : 'positive',
        icon: '📂',
        title: `Largest Change: ${largest.name}`,
        description: `${largest.change >= 0 ? '+' : ''}${this.humanReadableSize(largest.change)}`,
        action: `drillDownToFolder("${largest.name}")`,
        actionText: 'Explore Folder'
      });
    }

    // New/removed files
    const newFiles = this.detailedNewData.files.filter(f => 
      !this.detailedOldData.files.find(of => of.path === f.path)
    );
    const removedFiles = this.detailedOldData.files.filter(f => 
      !this.detailedNewData.files.find(nf => nf.path === f.path)
    );

    if (newFiles.length > 0) {
      insights.push({
        type: 'info',
        icon: '➕',
        title: `${newFiles.length} New Files`,
        description: `Added ${this.humanReadableSize(newFiles.reduce((sum, f) => sum + f.size, 0))}`,
        action: 'filterFiles("new")',
        actionText: 'View New Files'
      });
    }

    if (removedFiles.length > 0) {
      insights.push({
        type: 'positive',
        icon: '➖',
        title: `${removedFiles.length} Removed Files`,
        description: `Saved ${this.humanReadableSize(removedFiles.reduce((sum, f) => sum + f.size, 0))}`,
        action: 'filterFiles("removed")',
        actionText: 'View Removed Files'
      });
    }

    return insights;
  }

  getTopChanges(oldData, newData, limit = 10) {
    const keys = [...new Set([...Object.keys(oldData), ...Object.keys(newData)])];
    const changes = keys.map(key => ({
      name: key,
      oldSize: oldData[key] || 0,
      newSize: newData[key] || 0,
      change: (newData[key] || 0) - (oldData[key] || 0)
    }));

    return changes
      .sort((a, b) => {
        // Enhanced sorting for top changes
        const getTopChangeSignificance = (item) => {
          const { change, oldSize, newSize } = item;
          const absChange = Math.abs(change);
          let score = absChange;
          
          // Boost for larger files
          const maxSize = Math.max(oldSize, newSize);
          if (maxSize > 5 * 1024 * 1024) { // > 5MB
            score += maxSize * 0.1;
          } else if (maxSize > 1024 * 1024) { // > 1MB
            score += maxSize * 0.05;
          }
          
          // Boost for significant percentage changes
          const percentChange = oldSize > 0 ? Math.abs(change / oldSize * 100) : 100;
          if (percentChange > 50 && absChange > 1024) {
            score *= 1.4;
          }
          
          // Penalize very small changes
          if (absChange < 500 && oldSize > 0 && newSize > 0) {
            score *= 0.2;
          }
          
          return score;
        };
        
        const sigA = getTopChangeSignificance(a);
        const sigB = getTopChangeSignificance(b);
        
        return sigB - sigA;
      })
      .slice(0, limit);
  }

  drillDownToFolder(folderName) {
    this.switchTab('details');
    this.currentPath = folderName;
    document.getElementById('currentPath').textContent = `📁 ${folderName}`;
    
    // Filter files by folder
    this.filteredFiles = this.detailedNewData.files.filter(file => 
      file.folder === folderName || file.path.startsWith(folderName)
    );
    
    this.currentPage = 1;
    this.renderFileExplorer();
  }

  renderFileExplorer() {
    if (!this.detailedOldData || !this.detailedNewData) return;

    if (!this.filteredFiles) {
      this.filteredFiles = this.getFilteredAndSortedFiles();
    }

    const container = document.getElementById('fileExplorer');
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredFiles.length);
    const pageFiles = this.filteredFiles.slice(startIndex, endIndex);

    container.innerHTML = `
      <div class="file-explorer-header">
        <div class="file-count">Showing ${startIndex + 1}-${endIndex} of ${this.filteredFiles.length} files</div>
      </div>
      <div class="file-list">
        ${pageFiles.map(file => this.renderFileItem(file)).join('')}
      </div>
    `;

    this.updatePagination();
  }

  renderFileItem(file) {
    const oldFile = this.detailedOldData.files.find(f => f.path === file.path);
    const oldSize = oldFile ? oldFile.size : 0;
    const change = file.size - oldSize;
    const isNew = !oldFile;
    const isRemoved = false; // We're iterating through new files

    let status = 'unchanged';
    let statusIcon = '📄';
    
    if (isNew) {
      status = 'new';
      statusIcon = '➕';
    } else if (change > 0) {
      status = 'increased';
      statusIcon = '📈';
    } else if (change < 0) {
      status = 'decreased';
      statusIcon = '📉';
    }

    return `
      <div class="file-item ${status}" data-path="${file.path}">
        <div class="file-icon">${statusIcon}</div>
        <div class="file-details">
          <div class="file-name">${file.name}</div>
          <div class="file-path">${file.directory}</div>
        </div>
        <div class="file-sizes">
          <div class="old-size">${this.humanReadableSize(oldSize)}</div>
          <div class="new-size">${this.humanReadableSize(file.size)}</div>
          <div class="size-change ${change >= 0 ? 'positive' : 'negative'}">
            ${change >= 0 ? '+' : ''}${this.humanReadableSize(change)}
          </div>
        </div>
      </div>
    `;
  }

  getFilteredAndSortedFiles() {
    let files = [...this.detailedNewData.files];
    
    // Add removed files
    const removedFiles = this.detailedOldData.files.filter(oldFile => 
      !this.detailedNewData.files.find(newFile => newFile.path === oldFile.path)
    ).map(file => ({
      ...file,
      newSize: 0,
      status: 'removed'
    }));
    
    files = files.concat(removedFiles);
    
    // Apply search filter
    const searchTerm = document.getElementById('fileSearch').value.toLowerCase();
    if (searchTerm) {
      files = files.filter(file => 
        file.name.toLowerCase().includes(searchTerm) || 
        file.path.toLowerCase().includes(searchTerm)
      );
    }

    // Apply type filter
    const filterBy = document.getElementById('filterBy').value;
    if (filterBy !== 'all') {
      files = files.filter(file => {
        const oldFile = this.detailedOldData.files.find(f => f.path === file.path);
        const oldSize = oldFile ? oldFile.size : 0;
        const change = file.size - oldSize;
        
        switch (filterBy) {
          case 'increased': return change > 0;
          case 'decreased': return change < 0;
          case 'new': return !oldFile;
          case 'removed': return file.status === 'removed';
          default: return true;
        }
      });
    }

    // Apply enhanced sorting
    const sortBy = document.getElementById('sortBy').value;
    files.sort((a, b) => {
      const oldA = this.detailedOldData.files.find(f => f.path === a.path);
      const oldB = this.detailedOldData.files.find(f => f.path === b.path);
      const changeA = a.size - (oldA ? oldA.size : 0);
      const changeB = b.size - (oldB ? oldB.size : 0);
      
      switch (sortBy) {
        case 'change':
          // Enhanced sorting for changes - prioritize meaningful changes
          const getFileSignificance = (change, oldSize, newSize) => {
            const absChange = Math.abs(change);
            let score = absChange;
            
            // Boost for larger files
            const maxSize = Math.max(oldSize || 0, newSize || 0);
            if (maxSize > 1024 * 1024) { // > 1MB
              score += maxSize * 0.05;
            }
            
            // Boost for significant percentage changes
            const percentChange = oldSize > 0 ? Math.abs(change / oldSize * 100) : 100;
            if (percentChange > 50 && absChange > 1024) {
              score *= 1.3;
            }
            
            // Penalize tiny changes
            if (absChange < 100 && oldSize > 0 && newSize > 0) {
              score *= 0.1;
            }
            
            return score;
          };
          
          const sigA = getFileSignificance(changeA, oldA?.size, a.size);
          const sigB = getFileSignificance(changeB, oldB?.size, b.size);
          
          return sigB - sigA;
          
        case 'name': 
          return a.name.localeCompare(b.name);
        case 'size': 
          return b.size - a.size;
        default: 
          return 0;
      }
    });

    return files;
  }

  updatePagination() {
    const totalPages = Math.ceil(this.filteredFiles.length / this.itemsPerPage);
    document.getElementById('prevPage').disabled = this.currentPage <= 1;
    document.getElementById('nextPage').disabled = this.currentPage >= totalPages;
    document.getElementById('pageInfo').textContent = `Page ${this.currentPage} of ${totalPages}`;
  }

  searchFiles(term) {
    this.currentPage = 1;
    this.filteredFiles = this.getFilteredAndSortedFiles();
    this.renderFileExplorer();
  }

  sortFiles(sortBy) {
    this.currentPage = 1;
    this.filteredFiles = this.getFilteredAndSortedFiles();
    this.renderFileExplorer();
  }

  filterFiles(filterBy) {
    this.currentPage = 1;
    this.filteredFiles = this.getFilteredAndSortedFiles();
    this.renderFileExplorer();
    
    // Switch to details tab if called from insights
    if (filterBy === 'new' || filterBy === 'removed') {
      this.switchTab('details');
    }
  }
}

// Initialize the analyzer when the page loads
let analyzer;
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded - Initializing APK Analyzer...');
  try {
    analyzer = new APKAnalyzer();
    console.log('APK Analyzer initialized successfully');
  } catch (error) {
    console.error('Error initializing APK Analyzer:', error);
  }
});

console.log('analyzer.js script loaded');