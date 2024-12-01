const form=$('form');
const inputs = form.find('input, textarea, select');

let cookies = [] // Hold IDs of recognized cookies
function checkKnownCookies() {
    chrome.cookies.getAll({
    }, function (theCookies) {
        cookies = theCookies
        console.log(cookies)
        callback(theCookies)
    });
}

let forms={
    inputs:[],
    action:form.attr('action'),
    method:form.attr('method'),
    autocomplete:form.attr('autocomplete'),
    enctype:form.attr('enctype'),
    target:form.attr('target'),
    name:form.attr('name'),
    rel:form.attr('rel'),
    accept:form.attr('accept'),
    novalidate:form.attr('novalidate'),
    cookies:[],
    cookies_list:cookies,
};
inputs.each(function() {
    


    const closest=$(this).closest('.form-group');
    let label='';
    if(closest.length>0){
        label=closest.find('label').text();
    }
    forms.inputs.push({
        type: $(this).attr('type'),
        name: $(this).attr('name'),
        id: $(this).attr('id'),
        value: $(this).val(),
        label: label
    });
});

// Send the list of inputs to the popup
chrome.storage.local.set({ form: forms });

