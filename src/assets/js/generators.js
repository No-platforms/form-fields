function generatePostmanCollection(url, method, cookies, headers, form_data) {
    // Create an array of cookie objects for Postman
    const cookieObjects = cookies.map(cookie => ({
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        httpOnly: cookie.httpOnly || false,
        secure: cookie.secure || false,
        expirationDate: cookie.expirationDate || null
    }));

    // Create an array of header objects for Postman
    const headerObjects = headers.map(header => ({
        key: header.key,
        value: header.value
    }));

    // Create an array of form data objects for Postman
    const formDataObjects = form_data.map(item => ({
        key: item.key,
        type: item.type,
        value: item.value,
        description: item.description || ''
    }));

    // Construct the Postman collection
    const postmanCollection = {
        info: {
            name: 'Generated Collection',
            description: 'A collection generated programmatically',
            schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
        },
        item: [
            {
                name: 'Generated Request',
                request: {
                    method: method.toUpperCase(),
                    header: headerObjects,
                    url: url,
                    body: {
                        mode: 'formdata',
                        formdata: formDataObjects
                    },
                    cookie: cookieObjects
                }
            }
        ]
    };

    return postmanCollection;
}

function generateDownload(fileBody, fileName, fileExtension) {
    // Create a Blob with the file content
    const blob = new Blob([fileBody], { type: 'application/octet-stream' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    
    // Set the download attribute with the file name and extension
    link.download = `${fileName}.${fileExtension}`;
    
    // Set the href to the Blob URL
    link.href = url;
    
    // Append the link to the body
    document.body.appendChild(link);
    
    // Programmatically click the link to trigger the download
    link.click();
    
    // Remove the link from the document
    document.body.removeChild(link);
    
    // Revoke the Blob URL to free up resources
    URL.revokeObjectURL(url);
}

// cURL Request Generator
function generateCurlRequest(url, method, cookies, headers, form_data) {
    let curlCommand = `curl -X ${method.toUpperCase()} "${url}"`;
    
    headers.forEach(header => {
        curlCommand += ` -H "${header.key}: ${header.value}"`;
    });
    
    cookies.forEach(cookie => {
        curlCommand += ` -b "${cookie.name}=${cookie.value}"`;
    });
    
    form_data.forEach(data => {
        curlCommand += ` -F "${data.key}=${data.value}"`;
    });
    
    return curlCommand;
}

// PHP Guzzle Request Generator
function generatePhpGuzzleRequest(url, method, cookies, headers, form_data) {
    let phpCode = `<?php
require 'vendor/autoload.php';

$client = new \\GuzzleHttp\\Client();

$response = $client->request('${method.toUpperCase()}', '${url}', [
    'headers' => [
${headers.map(h => `        '${h.key}' => '${h.value}',`).join('\n')}
    ],
    'cookies' => [
${cookies.map(c => `        '${c.name}' => '${c.value}',`).join('\n')}
    ],
    'multipart' => [
${form_data.map(d => `        [
            'name' => '${d.key}',
            'contents' => '${d.value}',
        ],`).join('\n')}
    ]
]);

echo $response->getBody();`;

    return phpCode;
}

// Axios (JavaScript) Request Generator
function generateAxiosRequest(url, method, cookies, headers, form_data) {
    let axiosCode = `const axios = require('axios');
const FormData = require('form-data');

let formData = new FormData();
${form_data.map(d => `formData.append('${d.key}', '${d.value}');`).join('\n')}

axios({
    method: '${method.toLowerCase()}',
    url: '${url}',
    headers: {
        ${headers.map(h => `'${h.key}': '${h.value}',`).join('\n        ')}
        ...formData.getHeaders()
    },
    data: formData,
    withCredentials: true
})
.then(response => console.log(response.data))
.catch(error => console.error(error));`;

    return axiosCode;
}

// Java Request Generator
function generateJavaRequest(url, method, cookies, headers, form_data) {
    let javaCode = `import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;

public class HttpRequestExample {
    public static void main(String[] args) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        
        String boundary = "----WebKitFormBoundary" + System.currentTimeMillis();
        StringBuilder body = new StringBuilder();
        
        ${form_data.map(d => `
        body.append("--").append(boundary).append("\\r\\n");
        body.append("Content-Disposition: form-data; name=\\"${d.key}\\"\\r\\n\\r\\n");
        body.append("${d.value}").append("\\r\\n");`).join('')}
        body.append("--").append(boundary).append("--");
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("${url}"))
            .header("Content-Type", "multipart/form-data; boundary=" + boundary)
            ${headers.map(h => `.header("${h.key}", "${h.value}")`).join('\n            ')}
            .method("${method.toUpperCase()}", HttpRequest.BodyPublishers.ofString(body.toString()))
            .build();
        
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body());
    }
}`;

    return javaCode;
}

// Go Request Generator
function generateGoRequest(url, method, cookies, headers, form_data) {
    let goCode = `package main

import (
    "bytes"
    "fmt"
    "io"
    "mime/multipart"
    "net/http"
)

func main() {
    url := "${url}"
    method := "${method.toUpperCase()}"
    
    body := &bytes.Buffer{}
    writer := multipart.NewWriter(body)
    
    ${form_data.map(d => `
    fw, err := writer.CreateFormField("${d.key}")
    if err != nil {
        panic(err)
    }
    _, err = io.Copy(fw, strings.NewReader("${d.value}"))
    if err != nil {
        panic(err)
    }`).join('')}
    
    writer.Close()
    
    req, err := http.NewRequest(method, url, body)
    if err != nil {
        panic(err)
    }
    
    req.Header.Set("Content-Type", writer.FormDataContentType())
    ${headers.map(h => `req.Header.Set("${h.key}", "${h.value}")`).join('\n    ')}
    
    ${cookies.map(c => `req.AddCookie(&http.Cookie{Name: "${c.name}", Value: "${c.value}"})`).join('\n    ')}
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    
    fmt.Println(resp.Status)
    fmt.Println(resp.Header)
    body, _ := io.ReadAll(resp.Body)
    fmt.Println(string(body))
}`;

    return goCode;
}

// C Request Generator (using libcurl)
function generateCRequest(url, method, cookies, headers, form_data) {
    let cCode = `#include <stdio.h>
#include <curl/curl.h>

int main(void) {
    CURL *curl;
    CURLcode res;
    
    curl_global_init(CURL_GLOBAL_ALL);
    curl = curl_easy_init();
    if(curl) {
        curl_easy_setopt(curl, CURLOPT_URL, "${url}");
        curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "${method.toUpperCase()}");
        
        struct curl_slist *headers = NULL;
        ${headers.map(h => `headers = curl_slist_append(headers, "${h.key}: ${h.value}");`).join('\n        ')}
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        
        ${cookies.map(c => `curl_easy_setopt(curl, CURLOPT_COOKIE, "${c.name}=${c.value}");`).join('\n        ')}
        
        curl_mime *mime = curl_mime_init(curl);
        curl_mimepart *part;
        
        ${form_data.map(d => `
        part = curl_mime_addpart(mime);
        curl_mime_name(part, "${d.key}");
        curl_mime_data(part, "${d.value}", CURL_ZERO_TERMINATED);`).join('')}
        
        curl_easy_setopt(curl, CURLOPT_MIMEPOST, mime);
        
        res = curl_easy_perform(curl);
        if(res != CURLE_OK)
            fprintf(stderr, "curl_easy_perform() failed: %s\\n", curl_easy_strerror(res));
        
        curl_mime_free(mime);
        curl_slist_free_all(headers);
        curl_easy_cleanup(curl);
    }
    curl_global_cleanup();
    return 0;
}`;

    return cCode;
}

// Kotlin Request Generator
function generateKotlinRequest(url, method, cookies, headers, form_data) {
    let kotlinCode = `import okhttp3.*

fun main() {
    val client = OkHttpClient()
    
    val requestBody = MultipartBody.Builder()
        .setType(MultipartBody.FORM)
        ${form_data.map(d => `.addFormDataPart("${d.key}", "${d.value}")`).join('\n        ')}
        .build()
    
    val request = Request.Builder()
        .url("${url}")
        .method("${method.toUpperCase()}", requestBody)
        ${headers.map(h => `.addHeader("${h.key}", "${h.value}")`).join('\n        ')}
        ${cookies.map(c => `.addHeader("Cookie", "${c.name}=${c.value}")`).join('\n        ')}
        .build()
    
    client.newCall(request).execute().use { response ->
        if (!response.isSuccessful) throw IOException("Unexpected code $response")
        
        println(response.body!!.string())
    }
}`;

    return kotlinCode;
}

// Dart Request Generator
function generateDartRequest(url, method, cookies, headers, form_data) {
    let dartCode = `import 'package:http/http.dart' as http;

void main() async {
    var uri = Uri.parse('${url}');
    var request = http.MultipartRequest('${method.toUpperCase()}', uri);
    
    ${headers.map(h => `request.headers['${h.key}'] = '${h.value}';`).join('\n    ')}
    ${cookies.map(c => `request.headers['Cookie'] = '${c.name}=${c.value}';`).join('\n    ')}
    
    ${form_data.map(d => `request.fields['${d.key}'] = '${d.value}';`).join('\n    ')}
    
    var response = await request.send();
    
    if (response.statusCode == 200) {
        print(await response.stream.bytesToString());
    } else {
        print('Request failed .');
    }
}`;

    return dartCode;
}

// C# Request Generator
function generateCSharpRequest(url, method, cookies, headers, form_data) {
    let csharpCode = `using System;
using System.Net.Http;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        using (var client = new HttpClient())
        {
            var content = new MultipartFormDataContent();
            
            ${form_data.map(d => `content.Add(new StringContent("${d.value}"), "${d.key}");`).join('\n            ')}
            
            ${headers.map(h => `client.DefaultRequestHeaders.Add("${h.key}", "${h.value}");`).join('\n            ')}
            ${cookies.map(c => `client.DefaultRequestHeaders.Add("Cookie", "${c.name}=${c.value}");`).join('\n            ')}
            
            var response = await client.${method.toLowerCase()}Async("${url}", content);
            
            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine(responseContent);
            }
            else
            {
                Console.WriteLine($"Request failed with status: {response.StatusCode}");
            }
        }
    }
}`;

    return csharpCode;
}
