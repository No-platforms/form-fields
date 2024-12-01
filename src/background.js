chrome.action.onClicked.addListener((tab) => {
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];

        if (currentTab) {
            // Get all cookies for the current tab's URL
            chrome.cookies.getAll({ url: currentTab.url }, (cookies) => {
                console.log('Cookies for current tab:', cookies);
            });
        } else {
            console.log('No active tab found.');
        }
    });
});