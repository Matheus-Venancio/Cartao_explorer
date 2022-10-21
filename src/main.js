//Importando CSS pelo VITE
import "./css/index.css"
//importando imask
import IMask from "imask"

//Importando as cores do cartão
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")

//Importando as logos do cartão
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

//Puxando o CVC do cartão
const securityCode = document.querySelector("#security-code")

const expirationDate = document.querySelector("#expiration-date")


//Padrão da mascara
const securityCodePattern = {
  mask: "0000", //Colocando no maximo quatro digitos
}

const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2), //Pera pegar o ano atual
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

//Executando
const securityCodeMasked = IMask(securityCode, securityCodePattern)


//Pegando tipo do cartão
function setCardType(type) {

  //Mapeando cores
  const colors = {
    "visa": ["#436D99", "#2D57F2"],
    "mastercard": ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  }

  //Setando as cores no cartão
  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])

  //Setando as logos no cartão
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

//Executando
setCardType("mastercard")

//Colocando em global
globalThis.setCardType = setCardType


//ENCONTRO DO CARTÃO VISA (inicia com 4 e é seguido com 15 digitos)
const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/, //Inicia com 4 e tem digitos ate 15
      cardtype: "visa"
    },

    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard"
    },

    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    },
  ],

  //Toda vez que der o clique ele adiciona o outro e a mascara dinamica
  dispatch: function (appended, dynamicMasked) {

    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function(item){
      return number.match(item.regex)
    })

    console.log(foundMask)

    return foundMask
  }, 
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

//Guardando informação do botão
const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cartão adicionado")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()//Para não recaregar a tela
})

//Nome do titular
const cardHolder = document.querySelector("#card-holder")
//Evento de observar digitação
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  
  //Manipulando o texto e adicionando no cartão
  ccHolder.innerText = cardHolder.value.length === 0 ? "DIGITE ALGO" : cardHolder.value
})

//O ON é quase igual ao event listener, estã vendo o que está sendo digitado no campo
securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code){
  const ccSecurity = document.querySelector(".cc-security .value")

  ccSecurity.innerText = code.length === 0 ? "123" : code
}

//Numero do cartao
cardNumberMasked.on("accept", () => {
  const cardtype = cardNumberMasked.masked.currentMask.cardtype
  //Atualizando os cartões
  setCardType(cardtype)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")

  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

//Numero da expiração
expirationDateMasked.on("accept", () => {
  updateExpirationdate(expirationDateMasked.value)
})

function updateExpirationdate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")

  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}

