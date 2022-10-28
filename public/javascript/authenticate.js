// authenticate.js
// =================================================================
// requests API to get session id, and stores it in "token" cookie
// calls /api/auth
// Used by /
const missingcreds = "Veuillez saisir votre identifiant et votre mot de passe.";
const incorrectcreds = "Les identifiants saisis sont incorrects";
function showerr(err) { // show an error message
    document.getElementById('errorpopup').innerHTML = err;
    document.getElementById('errorpopup').hidden = false;

}
function authenticate() {
    username = document.getElementById('username').value;
    password = document.getElementById('password').value;
    if (username.length == 0 || password.length == 0) {showerr(missingcreds); return false;}
    const xhr = new window.XMLHttpRequest();
    const body = {
        "username": username,
        "password": password
    }
    xhr.open('POST', `/api/auth`, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onload = function(e) {
        var response = JSON.parse(xhr.response);
        console.log(JSON.stringify(xhr));
            if (typeof(response.token) != 'undefined') {
                document.cookie = `token=${response.token}`
                window.location.href = "/dashboard";
                console.log('test')
            }
            else if (typeof(response.message) != 'undefined') {
                // parse and output err message on webpage
                if (response.message = "Wrong user credentials") {
                    showerr(incorrectcreds); return false;
                }
                else if (response.message = "Missing 'url', or 'username', or 'password', or header 'Content-Type: application/json'")
                {showerr(missingcreds); return false;}
                showerr(`Une erreur est survenue: \n <pre>${response.message}</pre>`); return false;
            }
            else {showerr(`Une erreur est survenue: \n <pre>${JSON.stringify(response)}</pre>`); return false}
    }
    xhr.send(JSON.stringify(body));
    return true;
}
if (connect) {
connect.addEventListener('click', authenticate)
};