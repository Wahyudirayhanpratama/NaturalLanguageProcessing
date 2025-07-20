# Hate Speech Detector

This project is a browser extension that detects and censors hate speech on web pages. It uses a machine learning model to classify text and a browser extension to blur out hateful content in real-time.

## Features

- **Automatic Hate Speech Censoring:** Automatically detects and blurs out hate speech on any web page.
- **On-Demand Text Checking:** Allows you to select any text on a page and check if it contains hate speech.
- **Click to Reveal:** Censored words can be revealed by clicking on them.

## How it Works

The project consists of two main components:

1.  **Python Backend:** A Flask server that exposes a `/predict` API endpoint. This server loads a pre-trained machine learning model to classify text as "hate" or "non-hate".
2.  **Chrome Extension:** The extension runs in the user's browser and interacts with the web pages they visit.
    - A **content script** scans the text on the page, sends it to the backend for classification, and blurs any text identified as hate speech.
    - A **popup script** allows users to manually check selected text.

## Setup and Installation

### 1. Backend Server

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```
2.  **Create and activate a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\\Scripts\\activate`
    ```
3.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Run the Flask server:**
    ```bash
    python app.py
    ```
    The server will start on `http://127.0.0.1:5000`.

### 2. Chrome Extension

1.  Open Chrome and navigate to `chrome://extensions`.
2.  Enable "Developer mode" in the top right corner.
3.  Click on "Load unpacked".
4.  Select the directory where you cloned the repository.
5.  The extension should now be loaded and active.

## Usage

1.  **Automatic Censoring:** Once the extension is active, it will automatically scan the pages you visit and blur out any detected hate speech.
2.  **Manual Checking:** To check a specific piece of text, highlight the text, right-click, and select "Check for Hate Speech". The result will be displayed in the extension's popup.
