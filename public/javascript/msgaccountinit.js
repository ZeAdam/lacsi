// msgaccountinit.js
// =================================================================
// Deals with getting and parsing the message output by MaClasseEnAuRA when resetting password
// Calls api/accountinit
// Used by /accountinit

function msgaccountinit() {
    const id = {
        id: document.getElementById('login').value
    };
    const xhr = new window.XMLHttpRequest();
    xhr.open('POST', '/api/accountinit', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onload = function(e) {
        var response = xhr.response; // n'est pas responseText
        
        document.getElementById('popup').innerHTML = JSON.parse(response).content;
        document.getElementById('popup').hidden = false
        if (JSON.parse(response).content.includes("Un mail vous a été envoyé sur votre adresse externe afin de régénérer votre mot de passe.") == true) {document.getElementById('popup').style.backgroundColor = "var(--success)"}
    }
    xhr.send(JSON.stringify(id));

}

if (document.getElementById('btn-init')) {
    document.getElementById('btn-init').addEventListener('click', msgaccountinit)
    };