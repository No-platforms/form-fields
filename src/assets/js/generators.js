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