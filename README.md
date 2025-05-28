# PHPStan JSON Viewer

A Vue.js single-page application to load, view, filter, and search PHPStan JSON output files. The app supports regex-based directory exclusion and regex-based search with an OR condition, responsive design, dark/light mode, and localStorage persistence for user preferences.

## Features

- **Upload PHPStan JSON**: Load and parse PHPStan JSON files to display errors by file.
- **Regex-Based Search**: Filter errors or files using comma-separated regex patterns (e.g., `error1, error2, ^src/`), where a match on **any** pattern includes the error (logical OR).
- **Regex-Based Directory Exclusion**: Exclude files matching comma-separated regex patterns (e.g., `^src/, tests/.*`).
- **Error Type and File Filters**: Narrow down errors by type (extracted from messages) or specific files.
- **Responsive Design**: Built with Tailwind CSS for mobile and desktop compatibility.
- **Dark/Light Mode**: Toggle between themes, with preferences saved in localStorage.
- **Persistent Filters**: Search, type, file, and regex filters are saved in localStorage.

## Prerequisites

- **Node.js**: Version >= 18.0.0 (check with `node -v`).
- **npm**: Version >= 8.0.0 (check with `npm -v`).

## Installation

1. Clone or download the repository:
   ```bash
   git clone <repository-url>
   cd vuejs.phpstan.gui
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:3000`.
3. Upload a PHPStan JSON file to begin exploring errors.

## Usage

1. **Upload a JSON File**:
    - Click the file input to upload a PHPStan JSON file (e.g., output from `phpstan analyse --error-format=json`).
2. **Search Errors or Files**:
    - Enter comma-separated regex patterns in the search input (e.g., `Method.*, Undefined, ^src/`).
    - Errors or files matching **any** pattern are displayed.
    - Example: `error1, error2` shows errors containing "error1" or "error2" in messages or file names.
3. **Exclude Directories**:
    - Enter comma-separated regex patterns in the textarea (e.g., `^src/, tests/.*, vendor/`).
    - Files matching **any** pattern are excluded.
4. **Filter by Type or File**:
    - Select an error type from the dropdown (e.g., "Method App::").
    - Select a specific file to show only its errors.
5. **Toggle Dark/Light Mode**:
    - Click the theme toggle button to switch modes.
    - Preferences are saved automatically.

## Example Regex Patterns

- **Search**:
    - `Method.*, Undefined`: Matches errors with "Method" or "Undefined" in the message.
    - `^src/, tests/.*`: Matches files starting with "src/" or in "tests/".
- **Exclude**:
    - `^src/, vendor/`: Excludes files in "src/" or "vendor/" directories.
    - `tests/.*`: Excludes all files in "tests/".

## Project Structure

```
vuejs.phpstan.gui/
├── public/
│   ├── index.html          # Entry point HTML
│   └── favicon.ico         # Optional favicon
├── src/
│   ├── assets/
│   │   └── styles.css      # Tailwind CSS styles
│   ├── components/
│   │   ├── ErrorList.vue   # Displays filtered errors
│   │   ├── FileUploader.vue# Handles JSON file upload
│   │   └── ThemeToggle.vue # Toggles dark/light mode
│   ├── App.vue             # Main Vue component
│   └── main.js             # Vue app bootstrap
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.cjs      # PostCSS configuration
└── README.md               # Project documentation
```

## Development

- **Build for Production**:
  ```bash
  npm run build
  ```
  Output is in the `dist/` folder.
- **Preview Production Build**:
  ```bash
  npm run preview
  ```
- **Dependencies**:
    - Vue.js 3.5.15
    - Vite 5.x
    - Tailwind CSS 3.4.x
    - PostCSS and Autoprefixer

## Contributing

Feel free to submit issues or pull requests for bug fixes or new features. Ensure code follows the existing structure and includes tests where applicable.

## License

MIT License (or specify your preferred license).