/**
 * DORA Major Incident Assessment Tool
 *
 * This script implements a flowchart-based decision process to determine
 * if an incident qualifies as a major incident under the Digital Operational
 * Resilience Act (DORA).
 * See: https://eur-lex.europa.eu/eli/reg_del/2024/1772/ (Commission Delegated Regulation (EU) 2024/1772 of 13 March 2024)
 * See: https://www.esma.europa.eu/sites/default/files/2024-01/JC_2023_83_-_Final_Report_on_draft_RTS_on_classification_of_major_incidents_and_significant_cyber_threats.pdf
 */

// Define the flowchart structure for DORA major incident assessment
const flowchart = {
  // Article 6: Criticality of services affected
  start: {
    type: "gate",
    label: "Critical services (Article 6)",
    text:
      "Does the incident affect critical services under Article 6?\n\n" +
      "Answer Yes if ANY of the following apply:\n\n" +
      "a) The incident affects ICT services or network and information systems that support critical or important functions " +
      "(consult the Software Catalog to identify whether the service is in Tier 1 or Tier 2)\n" +
      "b) The incident affects financial services provided by the entity that require authorisation, registration, or are supervised by competent authorities\n" +
      "c) The incident constitutes a successful, malicious and unauthorised access to the network and information systems",
    options: [
      { text: "Yes", next: "maliciousIntrusion" },
      { text: "No", next: "notMajor" },
    ],
  },
  // Article 9(5)(b): Standalone major trigger — successful malicious access with data loss risk
  maliciousIntrusion: {
    type: "gate",
    label: "Malicious access with data loss risk (Article 9(5)(b))",
    text:
      "Has there been a successful, malicious and unauthorised access to the network and information systems that may result in data losses?\n\n" +
      "Consider whether:\n" +
      "• There has been unauthorised access to systems containing sensitive data\n" +
      "• A data breach has occurred or is likely\n" +
      "• Ransomware has been deployed that could compromise data availability or integrity\n\n" +
      "Note: Under Article 8(1)(a) and Article 9(5)(b), this alone classifies the incident as major.",
    options: [
      { text: "Yes", next: "majorSecurityIncident" },
      { text: "No", next: "clientsFinancialCounterpartsTransactions" },
    ],
  },
  // Article 9(1): Impact on clients, financial counterparts, and transactions
  clientsFinancialCounterpartsTransactions: {
    type: "threshold",
    label: "Clients, counterparts & transactions (Article 9(1))",
    thresholdNumber: 1,
    text:
      "Threshold 1 — Clients, Financial Counterparts and Transactions (Article 9(1))?\n\n" +
      "Has the incident affected any of the following:\n\n" +
      "a) >10% of all clients using the affected service\n" +
      "b) >100,000 clients using the affected service\n" +
      "c) >30% of all financial counterparts used by the financial entity\n" +
      "d) >10% of the daily average number of transactions\n" +
      "e) >10% of the daily average amount of transactions\n" +
      "f) any impact on clients or financial counterparts identified by the financial entity as relevant",
    options: [
      { text: "Yes", next: "reputationalImpact", count: true },
      { text: "No", next: "reputationalImpact", count: false },
    ],
  },
  // Article 9(2): Reputational impact
  reputationalImpact: {
    type: "threshold",
    label: "Reputational impact (Article 9(2))",
    thresholdNumber: 2,
    text:
      "Threshold 2 — Reputational Impact (Article 9(2))?\n" +
      "There has been a reputational impact if one or more of the following criteria are met:\n\n" +
      "• The incident has been reflected in the media\n" +
      "• We will not be able to, or will be unlikely to be able to, meet regulatory requirements as a result of the incident\n" +
      "• The incident has resulted in repetitive complaints from different clients or financial counterparts on client-facing services or critical business relationships\n" +
      "• We will, or are likely to, lose clients or financial counterparts with a material impact on our business as a result of the incident",
    options: [
      { text: "Yes", next: "durationServiceDowntime", count: true },
      { text: "No", next: "durationServiceDowntime", count: false },
    ],
  },
  // Article 9(3): Duration and service downtime
  durationServiceDowntime: {
    type: "threshold",
    label: "Duration & downtime (Article 9(3))",
    thresholdNumber: 3,
    text:
      "Threshold 3 — Duration and Service Downtime (Article 9(3))?\n\n" +
      "Has the incident met either of the following:\n\n" +
      "a) The incident duration is longer than 24 hours\n" +
      "b) The service downtime is more than 2 hours for ICT services that support critical or important functions",
    options: [
      { text: "Yes", next: "geographicScope", count: true },
      { text: "No", next: "geographicScope", count: false },
    ],
  },
  // Article 9(4): Geographical spread
  geographicScope: {
    type: "threshold",
    label: "Geographical spread (Article 9(4))",
    thresholdNumber: 4,
    text:
      "Threshold 4 — Geographical Spread (Article 9(4))?\n\n" +
      "Has the incident had an impact in 2 or more EU member states?\n\n" +
      "Consider whether any of the following apply:\n" +
      "a) Cross-border clients and counterparts in other member states are affected\n" +
      "b) Branches or other financial entities within the group in other member states are affected\n" +
      "c) Financial market infrastructures or third-party providers serving other member states are affected\n\n" +
      "Note: The United Kingdom should not be considered a member state.",
    options: [
      { text: "Yes", next: "economicImpact", count: true },
      { text: "No", next: "economicImpact", count: false },
    ],
  },
  // Article 9(6): Economic impact
  economicImpact: {
    type: "threshold",
    label: "Economic impact (Article 9(6))",
    thresholdNumber: 5,
    text:
      "Threshold 5 — Economic Impact (Article 9(6))?\n\n" +
      "Have the costs and losses caused by the incident exceeded or are they likely to exceed EUR 100,000?\n\n" +
      "Include the following categories:\n" +
      "a) expropriated funds or financial assets liability, including theft;\n" +
      "b) replacement or relocation costs;\n" +
      "c) staff costs;\n" +
      "d) contract non-compliance fees;\n" +
      "e) customer redress and compensation costs;\n" +
      "f) forgone revenues;\n" +
      "g) communication costs;\n" +
      "h) advisory costs (based on available data at the time of reporting)",
    options: [
      { text: "Yes", next: "dataLosses", count: true },
      { text: "No", next: "dataLosses", count: false },
    ],
  },
  // Article 9(5)(a): Data losses
  dataLosses: {
    type: "threshold",
    label: "Data losses (Article 9(5)(a))",
    thresholdNumber: 6,
    text:
      "Threshold 6 — Data Losses (Article 9(5)(a))?\n\n" +
      "Has the incident caused a loss of data that has or will have an adverse impact on the financial entity's business objectives or its ability to meet regulatory requirements?\n\n" +
      "Consider data losses in terms of:\n\n" +
      "a) Availability: data rendered temporarily or permanently inaccessible or unusable\n" +
      "b) Authenticity: the trustworthiness of the source of data has been compromised\n" +
      "c) Integrity: non-authorised modification of data rendering it inaccurate or incomplete\n" +
      "d) Confidentiality: data accessed by or disclosed to an unauthorised party or system",
    options: [
      { text: "Yes", next: "evaluateOutcome", count: true },
      { text: "No", next: "evaluateOutcome", count: false },
    ],
  },
  // Outcome: Major security incident — triggered by Article 8(1)(a) via Article 9(5)(b)
  majorSecurityIncident: {
    type: "outcome-major",
    label: "MAJOR INCIDENT (malicious access)",
    text:
      "This is a MAJOR INCIDENT under DORA (Article 8(1)(a) — successful malicious unauthorised access with data loss risk).\n\n" +
      "You must:\n" +
      "1. Activate the Security Incident Response Plan Playbook NOW\n" +
      "2. Mark the incident as a security incident in the incident management tool\n" +
      "3. Mark the incident as a DORA major incident in the incident management tool\n" +
      "4. Activate your major incident response plan\n" +
      "5. Follow security incident response procedures",
    options: [{ text: "Start New Assessment", next: "start" }],
  },
  // Outcome: Major operational incident — triggered by Article 8(1)(b), 2+ thresholds met
  majorOperationalIncident: {
    type: "outcome-major",
    label: "MAJOR INCIDENT (2+ thresholds)",
    text:
      "This is a MAJOR INCIDENT under DORA (Article 8(1)(b) — 2 or more materiality thresholds met).\n\n" +
      "You must:\n" +
      "1. Activate the Major Incident Response Plan Playbook NOW\n" +
      "2. Mark the incident as a DORA major incident in the incident management tool\n" +
      "3. Activate your major incident response plan\n" +
      "4. Follow operational incident response procedures",
    options: [{ text: "Start New Assessment", next: "start" }],
  },
  // Outcome: Not a major incident
  notMajor: {
    type: "outcome-not-major",
    label: "Not a major incident",
    text:
      "This is NOT a major incident under DORA. Continue with normal incident management procedures.\n\n" +
      "Remember to:\n" +
      "• Document the incident\n" +
      "• Implement appropriate remediation measures\n" +
      "• Review and update incident response procedures if needed\n\n" +
      "<strong>Recurring Incidents (Article 8(2)):</strong> If this incident has the same apparent root cause as a previous incident that occurred within the last 6 months, " +
      "and they collectively meet the major incident criteria, the incidents must be reclassified as major. " +
      "This does not apply to microenterprises or entities listed in Article 16(1) of Regulation (EU) 2022/2554.",
    options: [{ text: "Start New Assessment", next: "start" }],
  },
};

// Keep track of the decision history and count of "Yes" answers
let decisionHistory = [];
let yesCount = 0;

// Total number of threshold questions
const TOTAL_THRESHOLDS = 6;

// Get DOM elements for manipulation
const currentNodeElement = document.getElementById("current-node");
const nodeContentElement = document.getElementById("node-content");
const optionsElement = document.getElementById("options");
const historyListElement = document.getElementById("history-list");
const copyLogButton = document.getElementById("copy-log");
const copyFeedbackElement = document.getElementById("copy-feedback");
const progressBar = document.getElementById("progress-bar");
const progressFill = document.getElementById("progress-fill");
const progressLabel = document.getElementById("progress-label");

// Initialize the flowchart at the start node
let currentNode = "start";

/**
 * Formats a date object into a readable timestamp with date, time, and timezone
 * @returns {string} Formatted timestamp
 */
function getFormattedTimestamp() {
  const now = new Date();
  const dateStr = now.toLocaleDateString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const timeStr = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const timezoneStr = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return `${dateStr} ${timeStr} (${timezoneStr})`;
}

/**
 * Updates the display with the current node's content and options
 */
function updateDisplay() {
  const node = flowchart[currentNode];

  // Set the node content with HTML support
  nodeContentElement.innerHTML = node.text;

  // Apply node type class
  currentNodeElement.className = "node";
  if (node.type === "gate") {
    currentNodeElement.classList.add("node-gate");
  } else if (node.type === "threshold") {
    currentNodeElement.classList.add("node-threshold");
  } else if (node.type === "outcome-major") {
    currentNodeElement.classList.add("node-outcome-major");
  } else if (node.type === "outcome-not-major") {
    currentNodeElement.classList.add("node-outcome-not-major");
  }

  // Update progress bar for threshold questions
  if (node.type === "threshold" && node.thresholdNumber) {
    progressBar.classList.add("visible");
    const pct = ((node.thresholdNumber - 1) / TOTAL_THRESHOLDS) * 100;
    progressFill.style.width = pct + "%";
    progressLabel.textContent = `Threshold ${node.thresholdNumber} of ${TOTAL_THRESHOLDS}`;
    progressBar.setAttribute("aria-valuenow", node.thresholdNumber);
  } else {
    progressBar.classList.remove("visible");
  }

  // Update ARIA attributes for accessibility
  currentNodeElement.setAttribute(
    "aria-label",
    `Current Question: ${node.text.replace(/<[^>]*>/g, "")}`
  );

  // Clear previous options
  optionsElement.innerHTML = "";

  // Add new options
  node.options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option.text;
    button.setAttribute("aria-label", `Select: ${option.text}`);
    button.onclick = () => makeDecision(option);
    optionsElement.appendChild(button);
  });
}

/**
 * Handles the decision-making process when an option is selected
 * @param {Object} option - The selected option object
 */
function makeDecision(option) {
  // If starting a new assessment, clear the history
  if (option.text === "Start New Assessment") {
    decisionHistory = [];
    yesCount = 0;
    updateHistory();

    // Announce to screen readers that a new assessment is starting
    announceToScreenReader("Starting a new assessment");
  } else {
    // Add to history with timestamp
    decisionHistory.push({
      node: currentNode,
      decision: option.text,
      timestamp: getFormattedTimestamp(),
    });

    // Update history display
    updateHistory();

    // Announce the decision to screen readers
    const nodeText = flowchart[currentNode].text.replace(/<[^>]*>/g, "");
    announceToScreenReader(`Selected ${option.text} for: ${nodeText}`);
  }

  // If this is a counting question, update the yes count
  if (option.count !== undefined) {
    if (option.count) {
      yesCount++;
    }
  }

  // Move to next node
  currentNode = option.next;

  // If we've reached the end of the assessment, determine if it's a major incident
  if (currentNode === "evaluateOutcome") {
    if (yesCount >= 2) {
      currentNode = "majorOperationalIncident";
      announceToScreenReader("This is a MAJOR OPERATIONAL INCIDENT under DORA");
    } else {
      currentNode = "notMajor";
      announceToScreenReader("This is NOT a major incident under DORA");
    }
    // Reset the counter for the next assessment
    yesCount = 0;
  }

  updateDisplay();
}

/**
 * Announces a message to screen readers
 * @param {string} message - The message to announce
 */
function announceToScreenReader(message) {
  // Create a temporary element for screen reader announcements
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.classList.add("visually-hidden");
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove the element after it's been announced
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Updates the decision history display
 */
function updateHistory() {
  historyListElement.innerHTML = "";
  decisionHistory.forEach((item) => {
    const li = document.createElement("li");
    const node = flowchart[item.node];
    const label = node.label || item.node;

    const labelSpan = document.createElement("span");
    labelSpan.className = "history-label";
    labelSpan.textContent = label;

    const answerSpan = document.createElement("span");
    answerSpan.className =
      item.decision === "Yes" ? "history-answer-yes" : "history-answer-no";
    answerSpan.textContent = " " + item.decision;

    const timeSpan = document.createElement("span");
    timeSpan.className = "history-timestamp";
    timeSpan.textContent = " — " + item.timestamp;

    li.appendChild(labelSpan);
    li.appendChild(answerSpan);
    li.appendChild(timeSpan);
    historyListElement.appendChild(li);
  });

  // Update ARIA attributes for the history list
  if (decisionHistory.length > 0) {
    historyListElement.setAttribute(
      "aria-label",
      `Decision history with ${decisionHistory.length} entries`
    );
  } else {
    historyListElement.setAttribute("aria-label", "No decisions made yet");
  }
}

/**
 * Copies the decision log to the clipboard
 */
function copyDecisionLog() {
  // Create a formatted text version of the decision log
  let logText = "DORA Major Incident Assessment Log\n\n";

  decisionHistory.forEach((item, index) => {
    const node = flowchart[item.node];
    const label = node.label || item.node;
    logText += `${index + 1}. [${item.timestamp}] ${label} → ${item.decision}\n`;
  });
  logText += "\n";

  // Add the final outcome
  if (currentNode === "majorSecurityIncident") {
    logText += "\nOUTCOME: This is a MAJOR SECURITY INCIDENT under DORA.";
  } else if (currentNode === "majorOperationalIncident") {
    logText += "\nOUTCOME: This is a MAJOR OPERATIONAL INCIDENT under DORA.";
  } else if (currentNode === "notMajor") {
    logText += "\nOUTCOME: This is NOT a major incident under DORA.";
  }

  // Copy to clipboard
  navigator.clipboard
    .writeText(logText)
    .then(() => {
      // Show feedback
      copyFeedbackElement.style.display = "inline";
      copyFeedbackElement.textContent = "Copied to clipboard!";

      // Change button color temporarily
      copyLogButton.style.backgroundColor = "#FF9800";
      copyLogButton.textContent = "Copied!";

      setTimeout(() => {
        copyFeedbackElement.style.display = "none";
        copyLogButton.style.backgroundColor = "#4CAF50";
        copyLogButton.textContent = "Copy Log";
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
      copyFeedbackElement.style.display = "inline";
      copyFeedbackElement.textContent = "Failed to copy!";
      copyFeedbackElement.style.color = "#F44336";

      setTimeout(() => {
        copyFeedbackElement.style.display = "none";
        copyFeedbackElement.style.color = "#4CAF50";
      }, 2000);
    });
}

// Add event listener for the copy button
copyLogButton.addEventListener("click", copyDecisionLog);

// Initialize the display
updateDisplay();
