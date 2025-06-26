<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# APK Analyzer Chrome Extension

This is a Chrome extension project for analyzing and comparing APK file sizes.

## Project Context
- **Technology**: JavaScript Chrome Extension (Manifest V3)
- **Main Purpose**: Compare two APK files and show size differences by folder and file extension
- **Key Libraries**: JSZip for APK/ZIP file parsing

## Code Style Guidelines
- Use modern JavaScript (ES6+) features
- Follow Chrome Extension best practices for Manifest V3
- Use semantic HTML and clean CSS
- Implement proper error handling
- Add loading states for better UX

## Extension Architecture
- `manifest.json`: Extension configuration and permissions
- `popup.html`: Main UI interface
- `popup.js`: Core functionality for APK analysis
- `style.css`: Styling for the popup interface
- `jszip.min.js`: Third-party library for ZIP/APK file handling

## Development Notes
- APK files are essentially ZIP files that can be parsed with JSZip
- Focus on file size analysis by folder structure and file extensions
- Provide clear visual feedback for size increases/decreases
- Handle errors gracefully (invalid files, parsing failures)

When suggesting code improvements or new features, consider:
- Chrome Extension security policies
- File size limitations in browser extensions
- User experience for the popup interface
- Performance when processing large APK files
