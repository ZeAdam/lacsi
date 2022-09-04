var express = require('express');
const puppeteer = require('puppeteer');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});
router.post('/log', function(req, res, next) {
  /*
  // frontend testing - will then be fetched by Puppeteer
  const nom = 'Alpha';        // ! Developpement
  const prenom = 'Gigachad'   // ! Remove for production
  const classe = '3eme6'      // ! 
  res.render('main_connected', { nom: nom, prenom: prenom, classe: classe});
  */
  // Backend work
  
  
  async function main() {
    const browser = await puppeteer.launch({  
        headless: false,                      // !  Developpement
        /*slowMo: 250*/                       // !  Remove for production
    });
    const page = await browser.newPage(); // new tab
    await page.goto('https://0693446w.index-education.net/pronote/eleve.html'); // will be fetching data from Pronote, page redirect to AURAs CAS authenticator
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.keyboard.press('Enter'); // selecting "Elève ou parent avec EduConnect" - as of now, this tool only works for students !
    await page.waitForNavigation(); // page redirect to https://cas.ent.auvergnerhonealpes.fr/delegate/redirect/EDU
    await page.waitForNavigation(); // redirect to Educonnect
    await page.click('#bouton_eleve'); // either profiles work when authenticating - only parsing differs between "eleve" and "responsable" statuses
    await page.type('#username', req.body.username);
    await page.type('#password', req.body.password);
    await page.click('#bouton_valider');
    await page.waitForNavigation();
    url = page.url();
    if (/^https:\/\/educonnect\.education\.gouv\.fr\/idp\/profile\/SAML2\/POST\/SSO/g.test(url)) // if still in Educonnect page
    {
      // verify if password is incorrect
    }
    else if (/^https:\/\/cas\.ent\.auvergnerhonealpes\.fr\/saml\/SAMLAssertionConsumer/g.test(url)) // if on AURAs SAML validation (did not redirect to Pronote)
    {
      // proceed to cliquing Pronote link
    }
    await browser.close();
}
main();
});
module.exports = router;
