


var cookieList = [];


document.addEventListener('DOMContentLoaded', () => {

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];

        if (currentTab) {
            chrome.cookies.getAll({ url: currentTab.url }, (cookies) => {
                console.log('Cookies for current tab:', cookies);
                cookies.forEach(cookie => {
                    cookieList.push(cookie);
                    $("#cookies-list").append(`<li class="form-info-item"><code>
                        name:     ${cookie.name}
                        <br>
                        value:    ${cookie.value}
                        <br>
                        domain:   ${cookie.domain}
                        <br>
                        path:     ${cookie.path}
                        <br>
                        expires:  ${cookie.expires}
                        <br>
                        size:     ${cookie.size}
                        <br>
                        httpOnly: ${cookie.httpOnly}
                        <br>
                        secure:   ${cookie.secure}
                        <br>
                        session:  ${cookie.session}
                        <br>
                        </code></li>`);
                });
                
            });
        } else {
            console.log('No active tab found.');
        }
    });



    chrome.storage.local.get('form', (data) => {
        console.log(data)
        const inputList = $("#input-list");
        if (data.form) {
            data.form.inputs.forEach(input => {
                const li = document.createElement('li');
                li.textContent = `${input.type} - ${input.name} (ID: ${input.id}) - Value: ${input.value} - label: ${input.label}`;
                inputList.append(li);
            });
        } else {
            inputList.innerHTML = '<li>No inputs found.</li>';
        }
       
        $("#json-output").text(JSON.stringify(data.form.inputs ,null, '\t'));
        $("#form-info").append(`<li class="form-info-item">Action:<code>${data.form.action}</code></li>`);
        $("#form-info").append(`<li class="form-info-item">Method:<code>${data.form.method}</code></li>`);
        $("#form-info").append(`<li class="form-info-item">Autocomplete:<code>${data.form.autocomplete}</code></li>`);
        $("#form-info").append(`<li class="form-info-item">Enctype:<code>${data.form.enctype}</code></li>`);
        $("#form-info").append(`<li class="form-info-item">Target:<code>${data.form.target}</code></li>`);
        $("#form-info").append(`<li class="form-info-item">Name:<code>${data.form.name}</code></li>`);


        $("#postman-generator").click(() => {
            console.log("Postman generator clicked");

            const inputs = [];
            data.form.inputs.forEach(input => {
                inputs.push({
                    key: input.name,
                    value: input.value,
                    description: input.label,
                    type: "text"
                });
            });
            const postmanCollection = generatePostmanCollection(data.form.action, data.form.method, cookieListd, [], inputs);
            generateDownload(JSON.stringify(postmanCollection), "postman_collection", "json");
        });
    });
});