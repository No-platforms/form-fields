// content.js
const inputs = document.querySelectorAll('input, textarea, select');
const inputList = Array.from(inputs).map(input => ({
    type: input.type,
    name: input.name,
    id: input.id,
    value: input.value,
}));

// Send the list of inputs to the popup
chrome.storage.local.set({ formInputs: inputList });