# DORA Major Incident Assessment Tool

A decision-making tool that helps assess whether an incident qualifies as a major incident under the Digital Operational Resilience Act (DORA).

## Overview

This tool implements a flowchart-based decision process to determine if an incident should be classified as:
- A major security incident
- A major operational incident
- Not a major incident

## Features

- Interactive decision flowchart
- Decision history tracking
- Copy decision log to clipboard
- Clear visual feedback
- Mobile-responsive design

## How to Use

1. Open `index.html` in a web browser
2. Answer the questions presented in the flowchart
3. Follow the decision path based on your answers
4. Review the outcome and required actions
5. Use the "Copy Log" button to save your assessment

## Decision Paths

The tool includes several decision paths:

1. **Direct Not Major**: When the incident doesn't affect critical services
2. **Major Security Incident**: When there's a malicious intrusion
3. **Major Operational Incident (via Data Impact)**: When there's significant data impact
4. **Major Operational Incident (via Questions)**: When 2 or more criteria are met
5. **Not Major (via Questions)**: When fewer than 2 criteria are met

## Technical Details

- Built with vanilla JavaScript
- No external dependencies
- Self-contained HTML/CSS/JS files
- Uses modern browser APIs (Clipboard API)

## Running Locally

You can run this tool locally using any HTTP server. For example:

```bash
# Using Python 3
python -m http.server 8080

# Using Node.js
npx http-server -p 8080

# Using the included server.js script (recommended)
node server.js
```

The included `server.js` script will automatically find an available port if the default port (8080) is in use.

Then open your browser and navigate to the URL shown in the console (typically `http://localhost:8080`). 