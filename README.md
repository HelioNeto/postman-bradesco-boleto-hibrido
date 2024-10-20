# Exemplo de Registro de Boleto Hibrido no Banco Bradesco
Esse Script vai te auxiliar nos Testes de Integração com o Boleto Hibrido do Bradesco.

## 1º - Crie as Variaveis Globais
| Variable | Type | Current value
| ------------------------------------------------------------------- | -------------------- | --------------------------- |
|  server_to_server_access_token_proxy                  | &nbsp;default | &nbsp;CLIENT_ID |
|  server_to_server_aud_proxy                           | &nbsp;default | &nbsp;https://proxy.api.prebanco.com.br/auth/server/v1.2/token |
|  server_to_server_auth_token_proxy                    | &nbsp;default | &nbsp;https://proxy.api.prebanco.com.br/auth/server/v1.2/token |
|  server_to_server_privateKey_proxy                    | &nbsp;default | &nbsp;TEXTO_CERTIFICADO_KEY_SEM_ESPAÇO |
|  server_to_server_jsrsasign-js                        | &nbsp; | &nbsp; |

## 2º - Crie uma Requisição para o jsrsasign
Essa é a bilioteca que é usada para realizar a Assinatura dos Arquivos para Enviar para o Bradesco.

Méthodo: `GET`

URL:
```
http://kjur.github.io/jsrsasign/jsrsasign-latest-all-min.js
```

Na Aba `Scripts` em `Post-response` cole o script abaixo:

```javascript
pm.globals.set("server_to_server_jsrsasign-js", responseBody)
```

Agora execute a Requisção clicando em `SEND`
***Esta requisição vai importar todo o JavaScript para a Variável global: `server_to_server_jsrsasign-js`***

## 3º - Crie uma Requisição no Postman:
Méthodo: `POST`

URL:

```
https://proxy.api.prebanco.com.br/v1/boleto/registrarBoleto
```

Na Aba `Headers` clique em `Book Edit`, para mudar de Edit para texto, e cole os header que estão abaixo.

```
Authorization:{{AuthBearer}}
X-Brad-Signature:{{signature}}
cpf-cnpj:00000000000000
X-Brad-Nonce:{{nonce}}
X-Brad-Timestamp:{{timestamp}}
X-Brad-Algorithm:{{alg}}
Content-Type:application/json
```

Na Aba `Body`, escolha a opção `Raw` e cole o texto abaixo.

```json
{
   "registrarTitulo":0,
   "codUsuario":"APISERVIC",
   "nroCpfCnpjBenef":"00000000000000",
   "filCpfCnpjBenef":"0001",
   "digCpfCnpjBenef":"71",
   "tipoAcesso":2,
   "cpssoaJuridContr":0,
   "ctpoContrNegoc":0,
   "nseqContrNegoc":0,
   "cidtfdProdCobr":17,
   "cnegocCobr":0,
   "codigoBanco":237,
   "filler":"",
   "eNseqContrNegoc":0,
   "tipoRegistro":1,
   "cprodtServcOper":0,
   "ctitloCobrCdent":1,
   "ctitloCliCdent":"2525",
   "demisTitloCobr":"12.09.2023",
   "dvctoTitloCobr":"13.09.2023",
   "cidtfdTpoVcto":1,
   "cindcdEconmMoeda":0,
   "vnmnalTitloCobr":1000,
   "qmoedaNegocTitlo":0,
   "cespceTitloCobr":2,
   "cindcdAceitSacdo":"N",
   "ctpoProteTitlo":0,
   "ctpoPrzProte":0,
   "ctpoProteDecurs":0,
   "ctpoPrzDecurs":0,
   "cctrlPartcTitlo":0,
   "cformaEmisPplta":2,
   "cindcdPgtoParcial":"N",
   "qtdePgtoParcial":0,
   "filler1":"",
   "ptxJuroVcto":0,
   "vdiaJuroMora":0,
   "qdiaInicJuro":0,
   "pmultaAplicVcto":0,
   "vmultaAtrsoPgto":0,
   "qdiaInicMulta":0,
   "pdescBonifPgto01":0,
   "vdescBonifPgto01":0,
   "dlimDescBonif1":"",
   "pdescBonifPgto02":0,
   "vdescBonifPgto02":0,
   "dlimDescBonif2":"",
   "pdescBonifPgto03":0,
   "vdescBonifPgto03":0,
   "dlimDescBonif3":"",
   "ctpoPrzCobr":0,
   "pdescBonifPgto":0,
   "vdescBonifPgto":0,
   "dlimBonifPgto":"",
   "vabtmtTitloCobr":0,
   "viofPgtoTitlo":0,
   "filler2":"",
   "isacdoTitloCobr":"NOME CLIENTE",
   "elogdrSacdoTitlo":"RUA DO CLIENTE",
   "enroLogdrSacdo":999,
   "ecomplLogdrSacdo":"",
   "ccepSacdoTitlo":79000000,
   "ccomplCepSacdo":0,
   "ebairoLogdrSacdo":"CENTRO",
   "imunSacdoTitlo":"CAMPO GRANDE",
   "csglUfSacdo":"MS",
   "indCpfCnpjSacdo":1,
   "nroCpfCnpjSacdo":"00000000000",
   "renderEletrSacdo":"",
   "cdddFoneSacdo":0,
   "cfoneSacdoTitlo":0,
   "bancoDeb":0,
   "agenciaDeb":0,
   "agenciaDebDv":0,
   "contaDeb":0,
   "bancoCentProt":0,
   "agenciaDvCentPr":0,
   "isacdrAvalsTitlo":"",
   "elogdrSacdrAvals":"",
   "enroLogdrSacdr":0,
   "ecomplLogdrSacdr":"",
   "ccepSacdrTitlo":0,
   "ccomplCepSacdr":0,
   "ebairoLogdrSacdr":"",
   "imunSacdrAvals":"",
   "csglUfSacdr":"",
   "indCpfCnpjSacdr":0,
   "nroCpfCnpjSacdr":0,
   "renderEletrSacdr":"",
   "cdddFoneSacdr":0,
   "cfoneSacdrTitlo":0,
   "filler3":"",
   "fase":1,
   "cindcdCobrMisto":"S",
   "ialiasAdsaoCta":"00000000000000",
   "iconcPgtoSpi":"",
   "caliasAdsaoCta":"",
   "ilinkGeracQrcd":"",
   "wqrcdPdraoMercd":"",
   "validadeAposVencimento":"",
   "filler4":""
}
```
Mude o que achar necessário para Registrar o Boleto.

Na Aba `Scritps` em `Pré-Request`, cole o conteudo do arquivo: [***pre-request.js***](https://github.com/HelioNeto/postman-bradesco-boleto-hibrido/blob/main/pre-request.js)

Agora basta realizar o `SEND` 

*Abra o Log para acompanhar e ver o que está sendo Processado.*
