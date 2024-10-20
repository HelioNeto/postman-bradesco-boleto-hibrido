/**
 * INICIALIZANDO AS DEPENDENCIAS
 * Necessário ter as dependências abaixo: momentJS e jsrsasign
 */
var navigator = {}; //fake a navigator object for the lib
var window = {}; //fake a window object for the lib
eval(pm.globals.get("server_to_server_jsrsasign-js")); //import javascript jsrsasign
var moment = require('moment');

/**
 * Carregando algumas variáveis relevantes para o processo
 * iat, exp e nonce. Além do timestamp para incluir nos headers
 */
// load values
var now = new Date();
var now1Hour = new Date();
now1Hour.setHours(now.getHours()+1);
const BREAK_LINE = "\n";
const ALG_SHA256 = "SHA256";
const ALG_SHA256_WITH_RSA = "SHA256withRSA";

const iat = Math.floor(now.getTime() / 1000);
const exp = Math.floor(now1Hour.getTime() / 1000);
const nonce = now.getTime() + "";
var momentTmp = moment(now).format(("YYYY-MM-DDThh:mm:ssZ"));
// globals var
const aud = pm.globals.get("server_to_server_aud_proxy");
const authTokenUrl = pm.globals.get("server_to_server_auth_token_proxy");
const accessToken = pm.globals.get("server_to_server_access_token_proxy");
const privateKey = pm.globals.get("server_to_server_privateKey_proxy");
//Se quiser confirmar se estão preenchidas as variaveis, descomente a linha que quer ver no log.
/*
console.log(aud);
console.log(authTokenUrl);
console.log(accessToken);
console.log(privateKey);
return;
*/
/**
 * Constroi um texto referente aos dados do request
 * Este valor será assinado pela chave privada do requisitante posteriormente e incluido no header X-Brad-Signature
 */
//console.log(pm.request.url.getQueryString());
function buildRequestText(authToken) {
    var requestBody = (pm.request.body.raw) ? pm.request.body.raw : "";
    var requestText = [pm.request.method, pm.request.url.getPath(), pm.request.url.getQueryString(), 
        requestBody, authToken, nonce, momentTmp, ALG_SHA256].join(BREAK_LINE);
    return requestText;
}

/**
 * Constroi a variavel Assertion
 * Este valor é utilizado durante na solicitação do token de acesso da API /auth/server/v1.1/token
 * Trata-se de um token JWT assinado com a chave privada de quem está realizando a requisição
 */
function buildAssertion() {
    var header = {
        "alg" : "RS256",
        "typ" : "JWT"
    };

    var payload = {
        "aud": aud,
        "sub": accessToken,
        "iat": iat,
        "exp": exp,
        "jti": nonce,
        "ver": "1.1"
    };

    var sHeader = JSON.stringify(header);
    var sPayload = JSON.stringify(payload);
    console.log(`Header: ${sHeader}`);
    console.log(`Payload: ${sPayload}`);
    var assertion = '';

    console.log('Vai realizar a Assinatura');
    //Realiza a Assinatura do JWT que é o JWS conforme Manual do bradesco.
    assertion = KJUR.jws.JWS.sign(header.alg, sHeader, sPayload, privateKey);
    console.log(`Segue a Assinatura: ${assertion}`);
    return assertion;
}

/**
 * Assina o texto referente aos dados do request
 */
function signRequestText(requestText) {
    var kjursig = new KJUR.crypto.Signature({"alg": ALG_SHA256_WITH_RSA});
    kjursig.init(privateKey);
    kjursig.updateString(requestText);
    var hash = kjursig.sign();
    console.log(hash);
    return hextob64(hash);
}

/**
 * Request referente a API /auth/server/v1.2/token
 * É necessario inicialmente realizar uma autenticação do usuário, para em seguida, seguir com a realização da API que o requisitante deseja
 */
var requestTokenOptions = {
    url: authTokenUrl,
    method: 'POST',
    header: {
        "Content-Type": "application/x-www-form-urlencoded"},
    body: {
        mode: 'urlencoded',
        urlencoded : [
        { key: 'grant_type', value: 'urn:ietf:params:oauth:grant-type:jwt-bearer'},
        { key: 'assertion', value: buildAssertion()},
        ]
    }
}
console.log(`RequestTokenOptions: ${requestTokenOptions}`);
pm.sendRequest(requestTokenOptions , function(err, response){
    //Mostra a Resposta no Log.
    console.log(response);
    if (err != undefined)
    {
        console.log(`Erro: ${err}`);
    }

    //Aqui pode ocorrer erro quando o Response não tem o JSON, aí precisa retirar para conseguir ver.
    const jsonData = response.json();
    //const jsonData = response;

    /* Alimenta as Variaveis que vieram da Resposta da Geração do Token. */
    var bearer = jsonData.token_type + " " + jsonData.access_token;
    var authToken = jsonData.access_token;
    var requestText = buildRequestText(authToken)
    var signature = signRequestText(requestText);    

    /* Seta as variaves que estão no Header para já Registrar o Boleto na Sequência.*/
    pm.variables.set('signature', signature);
    pm.variables.set('nonce', nonce);
    pm.variables.set('alg', "SHA256");
    pm.variables.set('timestamp', momentTmp);
    pm.variables.set('AuthBearer', bearer);
});
