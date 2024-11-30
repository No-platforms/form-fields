// popup.js
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get('formInputs', (data) => {
        const inputList = document.getElementById('input-list');
        if (data.formInputs) {
            data.formInputs.forEach(input => {
                const li = document.createElement('li');
                li.textContent = `${input.type} - ${input.name} (ID: ${input.id}) - Value: ${input.value}`;
                inputList.appendChild(li);
            });
        } else {
            inputList.innerHTML = '<li>No inputs found.</li>';
        }
    });
});