# Git Commit Changelog Generator

A modern, fast, and beautiful web application built with React and Vite that automatically generates markdown changelogs from raw git commit logs. It automatically recognizes Conventional Commits, filters them, and formats them into a ready-to-copy Markdown output.

## Features

- **🚀 Conventional Commits Parsing:** Automatically recognizes `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, and `ci` prefixes.
- **✨ Premium UI:** A stunning dark mode interface utilizing glassmorphism and subtle animations for a professional developer experience.
- **⚙️ Customization:** Interactive settings to configure whether to group by commit type, include commit hashes, or ignore specific commit types.
- **📋 One-Click Copy:** Easily copy the beautifully formatted Markdown changelog directly to your clipboard.
- **⚡ Fast:** Runs completely locally in your browser, built on Vite for lightning-fast development.

## Tech Stack

- **Framework:** React + TypeScript
- **Bundler:** Vite
- **Icons:** Lucide React
- **Styling:** Vanilla CSS with custom modern design tokens and animations.

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Shaurya8008/git-commit-changelog-generator.git
   cd "git-commit-changelog-generator"
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

## How to use

1. Open your terminal in any of your git repositories.
2. Run a command like `git log --oneline` to get your raw git commit history.
3. Paste the output into the text area in the web app.
4. Tweak your desired settings (e.g. "Group by Type").
5. Click **Copy Markdown** and paste it into your project's `CHANGELOG.md` file!

## License

This project is licensed under the MIT License.
