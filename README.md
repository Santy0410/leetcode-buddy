# LeetCode Buddy

A Chrome extension that provides AI-powered coding assistance directly on LeetCode problem pages. Get instant help with debugging, optimization suggestions, and code explanations without leaving your coding environment.

## Features

- **One-Click AI Help**: Add an AI assistance button directly to LeetCode problem pages
- **Smart Code Extraction**: Automatically detects and extracts code from Monaco editor
- **Multiple AI Providers**: Support for Gemini AI, OpenAI GPT, and demo mode
- **Error Detection**: Automatically captures error messages and includes them in analysis
- **Clean Modal Interface**: Results displayed in an elegant, easy-to-read modal
- **Settings Management**: Configure API keys and preferences through popup interface
- **Usage Tracking**: Keep track of how many problems you've gotten help with

## Installation

### From Chrome Web Store
*Coming soon*

### Manual Installation (Development)
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/leetcode-buddy.git
   cd leetcode-buddy
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the project directory

5. The extension should now appear in your extensions list

## Setup

1. **Navigate to any LeetCode problem page**
2. **Click the extension icon** in your browser toolbar to open settings
3. **Choose your AI provider**:
   - **Demo Mode**: Free basic analysis (no API key needed)
   - **Google Gemini**: Free tier available with API key
   - **OpenAI GPT**: Requires paid API key
4. **Enter your API key** if using Gemini or OpenAI
5. **Start coding** and click the "Get AI Help" button when you need assistance

## Usage

1. **Write your code** in the LeetCode editor
2. **Run your code** to generate any error messages (optional but helpful)
3. **Click the "Get AI Help" button** that appears on the page
4. **Review the AI analysis** in the popup modal
5. **Apply suggested fixes** and improvements

## API Setup

### Google Gemini (Recommended - Free Tier Available)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key and paste it in the extension settings
4. Select "Google Gemini" as your provider

### OpenAI GPT
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key and paste it in the extension settings
4. Select "OpenAI GPT" as your provider

## Technical Details

### Architecture
- **Manifest V3** Chrome extension
- **Content Script** for DOM manipulation and code extraction
- **Background Service Worker** for API communication
- **Popup Interface** for settings and configuration

### Browser Compatibility
- Chrome 88+
- Edge 88+
- Other Chromium-based browsers

### Permissions
- `activeTab`: Access current LeetCode page
- `storage`: Save settings and API keys locally
- `host_permissions`: Access to leetcode.com

## Development

### Project Structure
```
leetcode-buddy/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content.js            # Content script for page interaction
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── popup.css             # Popup styling
├── styles.css            # Content script styles
└── icons/                # Extension icons
```

### Key Files
- **`content.js`**: Handles button injection and code extraction
- **`background.js`**: Manages API calls and data processing
- **`popup.js`**: Controls extension settings and configuration

### Building for Production
1. Update version in `manifest.json`
2. Test across different LeetCode problem types
3. Verify all API providers work correctly
4. Create extension package:
   ```bash
   zip -r leetcode-buddy.zip . -x "*.git*" "node_modules/*" "*.DS_Store"
   ```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m "Add feature description"`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

### Development Guidelines
- Follow existing code style and patterns
- Test on multiple LeetCode problem pages
- Ensure compatibility with Monaco editor updates
- Add error handling for edge cases

## Troubleshooting

### Button Not Appearing
- Check if you're on a LeetCode problem page (not the problem list)
- Refresh the page and wait a few seconds for the extension to load
- Check browser console for errors

### API Not Working
- Verify your API key is correct and has sufficient quota
- Check your internet connection
- Try switching to Demo Mode to test basic functionality

### Code Not Being Extracted
- Make sure you've written code in the editor
- Try clicking in the editor area to focus it
- Check if LeetCode has updated their editor structure

### Settings Not Saving
- Check that the extension has storage permissions
- Try reloading the extension from chrome://extensions/

## Privacy

- API keys are stored locally in your browser only
- No data is sent to our servers
- Code and analysis requests go directly to your chosen AI provider
- Usage statistics are stored locally for your reference

## License

MIT License - see [LICENSE](LICENSE) file for details

## Changelog

### v1.0.0
- Initial release
- Support for Gemini AI and OpenAI GPT
- Monaco editor code extraction
- Settings management interface
- Usage tracking

## Support

Having issues? Please check the [troubleshooting section](#troubleshooting) first, then:

1. Check existing [Issues](https://github.com/yourusername/leetcode-buddy/issues)
2. Create a new issue with:
   - Chrome version
   - Extension version
   - Steps to reproduce the problem
   - Console error messages (if any)

## Roadmap

- [ ] Support for additional AI providers
- [ ] Code history and suggestions tracking
- [ ] Custom prompt templates
- [ ] Export analysis results
- [ ] Firefox extension version
- [ ] Integration with more coding platforms

---

**Made for developers, by developers. Happy coding!**
