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
  // Initial question to determine if the incident affects critical services
  start: {
    text:
      "Does the incident affect critical services supporting critical functions?\n\n" +
      "Consult the Software Catalog to identify whether the service is in Tier 1 or Tier 2.",
    options: [
      { text: "Yes", next: "maliciousIntrusion" },
      { text: "No", next: "notMajor" },
    ],
  },
  // Question about data impact
  dataImpact: {
    text:
      "Has there been, or will there be, an impact on the availability, authenticity, integrity or\n" +
      "confidentiality of data which could have an adverse impact on the implementation of our\n" +
      "business objectives or our ability to meet regulatory requirements?",
    options: [
      { text: "Yes", next: "majorOperationalIncident" },
      { text: "No", next: "maliciousIntrusion" },
    ],
  },
  // Question about malicious intrusion
  maliciousIntrusion: {
    text:
      "Has there been, or will there be, an impact on the availability, authenticity, integrity or\n" +
      "confidentiality of data which could have an adverse impact on the implementation of our\n" +
      "business objectives or our ability to meet regulatory requirements?\n\n or \n\n" +
      "Has there been a malicious and successful intrusion likely to place data at risk?\n\n" +
      "Consider:\n" +
      "• Unauthorized access to systems\n" +
      "• Data breaches\n" +
      "• Ransomware attacks\n" +
      "• Other security incidents",
    options: [
      { text: "Yes", next: "majorSecurityIncident" },
      { text: "No", next: "clientsFinancialCounterpartsTransactions" },
    ],
  },
  // Article 1: Impact on clients, financial counterparts, and transactions
  clientsFinancialCounterpartsTransactions: {
    text:
      "Question 1: Clients, Financial Counterparts and Transactions?\n\n" +
      "Has the incident affected any of the following:\n\n" +
      "a) >10% of all clients using the affected service\n" +
      "b) >100 000 clients using the affected service\n" +
      "c) >30% of all financial counterparts used by the FE\n" +
      "d) >10% of the daily average number of transactions\n" +
      "e) >10% of the daily average amount of transactions\n" +
      "f) any identified impact on clients or financial counterpart identified by the FE as relevant",
    options: [
      { text: "Yes", next: "reputationalImpact", count: true },
      { text: "No", next: "reputationalImpact", count: false },
    ],
  },
  // Article 2: Reputational impact
  reputationalImpact: {
    text:
      "Question 2: Reputational Impact?\n" +
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
  // Question 3: Duration and service downtime
  durationServiceDowntime: {
    text:
      "Question 3: Duration and Service Downtime?\n\n" +
      "Is the service downtime more than two hours, \n or \n" +
      "Is the incident duration longer than 24 hours\n",
    options: [
      { text: "Yes", next: "geographicScope", count: true },
      { text: "No", next: "geographicScope", count: false },
    ],
  },
  // Question 4: Geographic scope
  geographicScope: {
    text:
      "Question 4: Has the incident affected services in multiple EU member states?\n\n" +
      "The United Kingdom should not be considered a member state:\n",
    options: [
      { text: "Yes", next: "economicImpact", count: true },
      { text: "No", next: "economicImpact", count: false },
    ],
  },
  // Question 5: Economic impact
  economicImpact: {
    text:
      "Question 5: Has the incident caused significant economic impact or financial losses?\n\n" +
      "We will have met this criterion if the incident has EUR 100 000 or more of financial impact across the following categories:\n" +
      "a) expropriated funds or financial assets liability, including theft;\n" +
      "b) replacement or relocation costs;\n" +
      "c) staff costs;\n" +
      "d) contract non-compliance fees;\n" +
      "e) customer redress and compensation costs;\n" +
      "f) forgone revenues;\n" +
      "g) communication costs;\n" +
      "h) advisory costs (based on available data at the time of reporting)",
    options: [
      { text: "Yes", next: "evaluateOutcome", count: true },
      { text: "No", next: "evaluateOutcome", count: false },
    ],
  },
  // Evaluation node to determine the outcome
  evaluateOutcome: {
    text: "Evaluating your answers...",
    options: [{ text: "Continue", next: "start" }],
  },
  // Outcome: Major security incident
  majorSecurityIncident: {
    text:
      "This is a MAJOR SECURITY INCIDENT under DORA. You must:\n" +
      "1. Activate the Security Incident Response Plan Playbook NOW\n" +
      "2. Mark the incident as a security incident in the incident management tool\n" +
      "3. Mark the incident as a DORA major incident in the incident management tool\n" +
      "4. Activate your major incident response plan\n" +
      "5. Follow security incident response procedures\n\n" +
      "For more information, see the <a href='https://www.eba.europa.eu' target='_blank'>Playbook</a>.",
    options: [{ text: "Start New Assessment", next: "start" }],
  },
  // Outcome: Major operational incident
  majorOperationalIncident: {
    text:
      "This is a MAJOR OPERATIONAL INCIDENT under DORA. You must:\n" +
      "1. Activate the Major Incident Response Plan Playbook NOW\n" +
      "2. Mark the incident as a security incident in the incident management tool\n" +
      "3. Submit a final notification within 72 hours\n" +
      "4. Activate your major incident response plan\n" +
      "5. Follow operational incident response procedures\n\n" +
      "For more information, see the <a href='https://www.eba.europa.eu' target='_blank'>Playbook</a>.",
    options: [{ text: "Start New Assessment", next: "start" }],
  },
  // Outcome: Not a major incident
  notMajor: {
    text:
      "This is NOT a major incident under DORA. Continue with normal incident management procedures.\n\n" +
      "Remember to:\n" +
      "• Document the incident\n" +
      "• Implement appropriate remediation measures\n" +
      "• Review and update incident response procedures if needed",
    options: [{ text: "Start New Assessment", next: "start" }],
  },
};

// Keep track of the decision history and count of "Yes" answers
let decisionHistory = [];
let yesCount = 0;

// Get DOM elements for manipulation
const currentNodeElement = document.getElementById("current-node");
const nodeContentElement = document.getElementById("node-content");
const optionsElement = document.getElementById("options");
const historyListElement = document.getElementById("history-list");
const copyLogButton = document.getElementById("copy-log");
const copyFeedbackElement = document.getElementById("copy-feedback");

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

  // If we're at the evaluateOutcome node, determine if it's a major incident
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
  } else {
    // Move to next node
    currentNode = option.next;
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
  decisionHistory.forEach((item, index) => {
    const li = document.createElement("li");
    // Create a plain text version for the history
    const plainText = flowchart[item.node].text.replace(/<[^>]*>/g, "");
    li.textContent = `${index + 1}. [${item.timestamp}] ${plainText} → ${
      item.decision
    }`;
    historyListElement.appendChild(li);

    // Add a line break after each decision for better readability
    if (index < decisionHistory.length - 1) {
      const br = document.createElement("br");
      historyListElement.appendChild(br);
    }
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
    // Create a plain text version for the log
    const plainText = flowchart[item.node].text.replace(/<[^>]*>/g, "");
    logText += `${index + 1}. [${item.timestamp}] ${plainText} → ${
      item.decision
    }\n\n`; // Added extra newline for spacing
  });

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
