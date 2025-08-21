// background.js - LeetCode Buddy Background Service Worker

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'ANALYZE_CODE') {
    handleCodeAnalysis(request.data)
      .then(response => sendResponse(response))
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }
});

async function handleCodeAnalysis(data) {
  try {
    const provider = await getStoredProvider();
    let response;
    
    if (provider === "gemini") {
      response = await callGemini(data);
    } else {
      response = await callDummyAPI(data);
    }
    
    // Update usage stats after successful analysis
    chrome.storage.sync.get(['problems_helped'], function(result) {
      const count = (result.problems_helped || 0) + 1;
      chrome.storage.sync.set({ problems_helped: count });
    });
    
    return response;
  } catch (error) {
    throw new Error('Failed to analyze code: ' + error.message);
  }
}

// -------- Gemini API --------
async function callGemini(data) {
  const apiKey = await getStoredAPIKey();
  if (!apiKey) throw new Error('Gemini API key not configured');

  const { code, errors, problemTitle } = data;

  const prompt = `
You are a coding assistant helping with LeetCode problems.
Problem: ${problemTitle || "Unknown"}
Code:
\`\`\`
${code}
\`\`\`
${errors ? `Errors:\n${errors}` : ""}
Please provide:
EXPLANATION: what is wrong or how to improve
SUGGESTED_FIX: code changes
`;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      })
    }
  );

  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
  const result = await response.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

  const parts = text.split("SUGGESTED_FIX:");
  return {
    explanation: parts[0].replace("EXPLANATION:", "").trim(),
    suggestedFix: parts[1]?.trim() || ""
  };
}

// -------- Dummy API --------
async function callDummyAPI(data) {
  await new Promise(r => setTimeout(r, 1000));
  return {
    explanation: "Dummy AI: Your code might have edge case issues.",
    suggestedFix: "# Example fix: Handle empty arrays, nulls, etc."
  };
}

// -------- Helpers --------
async function getStoredAPIKey() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['openai_api_key'], (result) => {
      resolve(result.openai_api_key || null);
    });
  });
}
async function getStoredProvider() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['api_provider'], (result) => {
      resolve(result.api_provider || 'dummy');
    });
  });
}

// -------- Keep-alive --------
chrome.runtime.onConnect.addListener(port => {
  if (port.name === "keepAlive") {
    console.log("KeepAlive connection established.");
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('LeetCode Buddy installed/updated');
});
chrome.runtime.onStartup.addListener(() => {
  console.log('LeetCode Buddy started');
});
