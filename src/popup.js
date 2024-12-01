


var cookieList = [];
document.getElementById('refresh-formina').addEventListener('click', function() {
    $("#input-list").empty();
    $("#json-output").empty();
    chrome.runtime.sendMessage({action: "reset"}, function(response) {
      console.log("Extension reset");
    });
  });

  
document.addEventListener('DOMContentLoaded', () => {

    chrome.tabs.query({ active: true, currentWindow: true }, async(tabs) => {
        const currentTab = tabs[0];

        if (currentTab) {
            chrome.cookies.getAll({ url: currentTab.url }, (cookies) => {
                console.log('Cookies for current tab:', cookies);
                cookies.forEach(cookie => {
                    cookieList.push(cookie);
                    $("#cookies-list").append(`<li class="form-info-item"><pre><code class="language-json">
                        { 
                            name: "${cookie.name}",
                            value: "${cookie.value}",
                            domain: "${cookie.domain}",
                            path: "${cookie.path}",
                            expires: "${cookie.expires}",
                            size: "${cookie.size}",
                            httpOnly: "${cookie.httpOnly}",
                            secure: "${cookie.secure}",
                            session: "${cookie.session}"
                        }
                        </code></pre></li>`);
                });
                hljs.highlightAll();
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
                $("#form-info").append(`<li class="form-info-item">Action:<pre><code>${data.form.action}</code></pre></li>`);
                $("#form-info").append(`<li class="form-info-item">Method:<pre><code>${data.form.method}</code></pre></li>`);
                $("#form-info").append(`<li class="form-info-item">Autocomplete:<pre><code>${data.form.autocomplete}</code></pre></li>`);
                $("#form-info").append(`<li class="form-info-item">Enctype:<pre><code>${data.form.enctype}</code></pre></li>`);
                $("#form-info").append(`<li class="form-info-item">Target:<pre><code>${data.form.target}</code></pre></li>`);
                $("#form-info").append(`<li class="form-info-item">Name:<pre><code>${data.form.name}</code></pre></li>`);
                hljs.highlightAll();
                    const inputs = [];
                    data.form.inputs.forEach(input => {
                        inputs.push({
                            key: input.name,
                            value: input.value,
                            description: input.label,
                            type: "text"
                        });
                    });
                $("#postman-generator").click(() => {
                    console.log("Postman generator clicked");
        
        
                    const postmanCollection = generatePostmanCollection(data.form.action, data.form.method, cookieList, [], inputs);
                    generateDownload(JSON.stringify(postmanCollection), "postman_collection", "json");
                });
        
                $("#generator-method").change(() => {
                 
                    $("#generated-code-output").remove();
                    let generatedCodeOutput = $("<code>", {id: "generated-code-output"});
                    $("#tabcontent5").find("pre").append(generatedCodeOutput);
        
        
                    switch ($("#generator-method").val()) {
                        case "curl":
                            const curlCode = generateCurlRequest(data.form.action, data.form.method, cookieList, [], inputs);
                            $("#generated-code-output").html(curlCode);
                            break;
                        case "php-guzzle":
                            const phpGuzzleCode = generatePhpGuzzleRequest(data.form.action, data.form.method, cookieList, [], inputs);
                            $("#generated-code-output").html(phpGuzzleCode);
                            break;
                        case "axios":
                            const axiosCode = generateAxiosRequest(data.form.action, data.form.method, cookieList, [], inputs);
                            $("#generated-code-output").html(axiosCode);
                            break;
                        case "java":
                            const javaCode = generateJavaRequest(data.form.action, data.form.method, cookieList, [], inputs);
                            $("#generated-code-output").html(javaCode);
                            break;
                        case "go":
                            const goCode = generateGoRequest(data.form.action, data.form.method, cookieList, [], inputs);
                            $("#generated-code-output").html(goCode);
                            break;
                        case "c":
                            const cCode = generateCRequest(data.form.action, data.form.method, cookieList, [], inputs);
                            $("#generated-code-output").html(cCode);
                            break;
                        case "kotlin":
                            const kotlinCode = generateKotlinRequest(data.form.action, data.form.method, cookieList, [], inputs);
                            $("#generated-code-output").html(kotlinCode);
                            break;
                        case "dart":
                            const dartCode = generateDartRequest(data.form.action, data.form.method, cookieList, [], inputs);
                            $("#generated-code-output").html(dartCode);
                            break;
                        case "csharp":
                            const csharpCode = generateCSharpRequest(data.form.action, data.form.method, cookieList, [], inputs);
                            $("#generated-code-output").html(csharpCode);
                            break;
                    }
                    // $("#generated-code-output")[0].dataset.highlighted = false;
        
                    hljs.highlightElement($("#generated-code-output")[0]);
                });
        
            });

        } else {
            console.log('No active tab found.');
        }

        
    });


});