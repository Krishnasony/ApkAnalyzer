# APK Size Analyzer

A Chrome extension that compares two APK files and reports size changes by folder and file extension with an advanced full-screen interface featuring interactive charts and detailed drill-down analysis.

## 🔗 Quick Links

- **🔒 Privacy Policy**: [https://krishnasony.github.io/ApkAnalyzer/](https://krishnasony.github.io/ApkAnalyzer/)
- **🌐 Chrome Web Store**: Coming soon after approval!

## ✨ Features

### 🖥️ Full-Screen Interface
- Beautiful, modern full-screen web app experience
- Responsive design optimized for desktop and mobile
- Intuitive tab-based navigation

### 📊 Advanced Analysis
- **Interactive Charts**: Visual representation of size changes with clickable elements
- **Overview Dashboard**: Key insights and summary statistics
- **Drill-Down Navigation**: Click on folders in charts to explore detailed file lists
- **Real-time Filtering**: Search, sort, and filter files by various criteria

### 📈 Visual Analytics
- **Size Comparison Charts**: Bar charts showing old vs new APK sizes
- **Top Changes Chart**: Horizontal bar chart highlighting biggest changes
- **Folder Distribution**: Doughnut chart showing folder size distribution
- **Extension Analysis**: Comparative charts for file type analysis

### 🔍 Detailed File Explorer
- **File-level Analysis**: See individual file changes with exact byte differences
- **Status Indicators**: Visual markers for new, removed, increased, and decreased files
- **Smart Filtering**: Filter by file status (new, removed, changed)
- **Advanced Search**: Find specific files quickly
- **Pagination**: Handle large APK files with paginated results

### 💡 Smart Insights
- **Automated Analysis**: AI-generated insights about significant changes
- **Action Buttons**: Quick navigation to relevant sections
- **Trend Detection**: Identify patterns in size changes
- **Optimization Suggestions**: Recommendations based on analysis

### 🎯 User Experience
- **Drag & Drop Support**: Easy file selection with intuitive drag and drop
- **Progress Tracking**: Real-time progress updates during analysis
- **Export Results**: Export analysis results to JSON format
- **Memory Optimized**: Handles large APK files efficiently (up to 200MB)

## 🚀 Installation

### Load as Unpacked Extension (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top right)
3. Click "Load unpacked"
4. Select the extension directory containing `manifest.json`
5. The APK Analyzer extension will appear in your extensions list

## 📖 Usage

### Quick Start
1. Click the APK Analyzer extension icon in Chrome
2. Click "🚀 Open Full Screen Analyzer" in the popup
3. The full-screen analyzer will open in a new tab

### Analyzing APK Files
1. **Upload Files**: 
   - Click the file drop zones or drag & drop your APK files
   - Select your "Old APK" and "New APK" files
2. **Start Analysis**: Click the "🔍 Analyze APK Files" button
3. **View Results**: Explore the analysis across four detailed tabs:

#### 📊 Overview Tab
- **Size Comparison Chart**: Visual comparison of old vs new APK sizes
- **Top Changes Chart**: Interactive chart showing folders with biggest changes
- **Smart Insights**: Automated analysis with actionable recommendations
- **Quick Actions**: Click chart elements or insight buttons to drill down

#### 📂 Folders Tab  
- **Interactive Folder Chart**: Doughnut chart showing folder size distribution
- **Detailed Table**: Complete folder analysis with size changes and percentages
- **Explore Buttons**: Click "🔍 Explore" to drill down into specific folders

#### 🔧 Extensions Tab
- **Extension Comparison**: Bar charts comparing file types between versions
- **File Count Analysis**: See how many files changed for each extension type
- **Format Insights**: Understand which file types contribute most to size changes

#### 🔍 Detailed Analysis Tab
- **File Explorer**: Browse individual files with drill-down navigation
- **Advanced Filtering**: Filter by file status (new, removed, increased, decreased)
- **Smart Search**: Find specific files quickly with real-time search
- **Sorting Options**: Sort by change size, file name, or file size
- **Pagination**: Navigate through large file lists efficiently

### Interactive Features
- **Click to Explore**: Click on chart elements to drill down into folders
- **Breadcrumb Navigation**: See your current location and navigate back
- **Real-time Updates**: All filters and searches update results instantly
- **Export Everything**: Save complete analysis results including detailed file data

4. **Export Data**: Click "📥 Export Results" to save comprehensive analysis as JSON

## 🏗️ Technical Details

### File Structure
```
apk-analyzer-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for tab management
├── popup.html            # Quick launch popup
├── analyzer.html         # Full-screen analyzer interface
├── analyzer.js           # Main analyzer logic
├── analyzer.css          # Full-screen styling
├── popup.js             # Original popup functionality (legacy)
├── style.css            # Popup styling (legacy)
├── jszip.min.js         # JSZip library for APK parsing
├── debug.html           # Debug testing page
├── icons/               # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md           # This file
```

### Key Technologies
- **JSZip**: Used for parsing APK/ZIP files
- **Chrome Extensions API**: Manifest V3 compliance
- **Modern Web APIs**: File handling, drag & drop, progress tracking

### Supported File Types
- `.apk` files (Android Application Packages)
- `.zip` files (for testing purposes)

## 🔧 Development

### Prerequisites
- Google Chrome browser
- Basic knowledge of HTML, CSS, and JavaScript
- Understanding of Chrome Extension development

### Local Development
1. Clone or download this repository
2. Make changes to the source files
3. Reload the extension in Chrome:
   - Go to `chrome://extensions/`
   - Find the APK Analyzer extension
   - Click the refresh icon 🔄
4. Test your changes by clicking the extension icon

### Architecture Overview

#### Full-Screen App (`analyzer.html` + `analyzer.js`)
- **Modern Interface**: Clean, responsive design with drag & drop
- **Class-Based Architecture**: Well-organized APKAnalyzer class
- **Memory Management**: Optimized for large files with progress tracking
- **Tab System**: Organized results display with folder/extension views
- **Export Functionality**: JSON export of analysis results

#### Extension Integration
- **Service Worker** (`background.js`): Manages tab creation and extension lifecycle
- **Popup Interface** (`popup.html`): Quick launcher with feature overview
- **Manifest V3**: Modern Chrome extension standards

### Memory Optimizations
- **Sequential Processing**: Processes APK files one at a time to reduce memory pressure
- **Periodic Yielding**: Prevents UI freezing during large file processing  
- **Smart Size Detection**: Multiple fallback methods for accurate file size calculation
- **200MB File Limit**: Prevents browser memory issues with extremely large files

## ⚠️ Limitations

- **File Size**: Maximum 200MB per APK file (browser memory constraints)
- **Size Accuracy**: Uses uncompressed file sizes when available, compressed sizes as fallback
- **Browser Support**: Requires Chrome 88+ with Manifest V3 support
- **Processing Time**: Large APK files may take several minutes to analyze

## 🐛 Troubleshooting

### Common Issues

1. **Extension won't load**:
   - Ensure all files are in the correct directory
   - Check that Developer mode is enabled in Chrome extensions

2. **"Failed to read APK file"**:
   - Verify the file is a valid APK or ZIP file
   - Check file size is under 200MB limit
   - Try with a different APK file to isolate the issue

3. **Analysis takes too long**:
   - Large APK files (>50MB) may take several minutes
   - Check browser console (F12) for progress logs
   - Consider using smaller test files first

4. **Results not showing**:
   - Ensure both APK files are selected before clicking Analyze
   - Check browser console for error messages
   - Try refreshing the analyzer page

### Debug Tools
- Use `debug.html` to test JSZip functionality with specific APK files
- Check browser console (F12) for detailed error messages and progress logs
- Monitor browser memory usage during analysis of large files

## 🎯 Future Enhancements

- **📊 Visual Charts**: Add charts and graphs for better data visualization
- **🔍 File-Level Analysis**: Individual file comparisons within APKs
- **📈 Historical Tracking**: Save and compare multiple analysis sessions
- **⚡ Batch Processing**: Analyze multiple APK pairs simultaneously
- **🎨 Themes**: Light/dark mode and customizable color schemes
- **📱 Mobile Support**: Responsive design for tablet usage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly with various APK files
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **JSZip Library**: For reliable ZIP/APK file parsing
- **Chrome Extensions Team**: For the robust extension platform
- **Open Source Community**: For inspiration and best practices

---

**🔍 Happy APK Analyzing!** 🚀
