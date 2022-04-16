let mensagens = [];
let participantes = [];
let activeUsers = ["Todos"];
let destinatario = "Todos";
let estatus = "message"
let nome;

let loginInput = document.querySelector(".login");
loginInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        login();
    }
});

let textInput = document.querySelector(".enviar");
textInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        enviarMensagem();
    }
});

function login(){

  nome = {
    name: document.querySelector(".login").value
  };

    const promessa = axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/participants",nome);

    promessa.then(start);
    promessa.catch(tratarErro);

    document.querySelector(".login").value = '';
}

function start(){
  document.querySelector(".tela-de-login").classList.add("hidden")
  nomeCadastrado()
  buscarParticipantes();
  pegarMensagens();
  setInterval(pegarMensagens,3000);
  setInterval(buscarParticipantes,10000);
  setInterval(function(){
  onlineStatus();
},5000);

setInterval(atualizarMensagem,500);

}

function onlineStatus(){
  axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",nome
      );
}

function nomeCadastrado(){
    alert("nome cadastrado com sucesso")
}

function tratarErro(error){
    if(error.response.status === 400){
        alert("Já existe um usuário online com esse nome, tente novamente");
        window.location.reload();
    }
}

function tratarErroMens(error){
  alert("Usuário desconectado");
  window.location.reload();
}

function pegarMensagens() {
    const promise = axios.get(
      "https://mock-api.driven.com.br/api/v6/uol/messages"
    );
    promise.then(carregarMensagens);
  }

function carregarMensagens(response){
    mensagens = response.data;
    renderizarMensagens();
}

function renderizarMensagens() {
  const ulMensagens = document.querySelector(".mensagens");
  let numb = document.querySelector(".mensagens").childElementCount;
  ulMensagens.innerHTML = "";

  for (let i = 0; i < mensagens.length; i++) {
    
    if(mensagens[i].type === "status"){
      ulMensagens.innerHTML += `
    <div class="mensagem-sistema"><h2>${mensagens[i].time} </h2> <h1>${mensagens[i].from}</h1> ${mensagens[i].text}</div>
        `;
    }else if(mensagens[i].type ==="message"){
      ulMensagens.innerHTML += `
    <div class="mensagem-sistema todos"><h2>${mensagens[i].time} </h2> <h1>${mensagens[i].from}</h1> para <h1>${mensagens[i].to}:</h1> ${mensagens[i].text}</div>
        `;
    }else if((mensagens[i].from === nome.name && mensagens[i].to !== "Todos" && mensagens[i].type === "private_message") || 
    mensagens[i].to === nome.name && mensagens[i].type === "private_message"){
      ulMensagens.innerHTML += `
    <div class="mensagem-sistema privada"><h2>${mensagens[i].time} </h2> <h1>${mensagens[i].from}</h1> reservadamente para <h1>${mensagens[i].to}:</h1> ${mensagens[i].text}</div>
        `;
    }else{
      mensagens[i].pop;
    }
  }

  let lastMessage = ulMensagens.children[numb-1];
  lastMessage.scrollIntoView();
}




function enviarMensagem() {
    const mensagem = document.querySelector(".enviar").value;

    const novaMensagem = {
        from: nome.name,
        to: destinatario,
        text: mensagem,
        type: estatus
    }

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", novaMensagem);
                                                                
    promise.then(pegarMensagens);
    promise.catch(tratarErroMens);

    document.querySelector(".enviar").value = '';
}

function openMenu(){
  const elemento = document.querySelector(".configuraçoes");
  elemento.classList.toggle("hidden");
}

function buscarParticipantes(){
  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/participants"
  );
  promise.then(carregarParticipantes);
}

function carregarParticipantes(response){
  participantes = response.data;
  renderizarParticipantes();
}

function renderizarParticipantes() {
  const ulParticipantes = document.querySelector(".contatos");

  ulParticipantes.innerHTML = `
    <span class="contato">
      <ion-icon name="people" class="icon" onclick="sendTo(this),openMenu()">Todos</ion-icon>
      Todos
      </span>
  `
  
  for(i = 1; i < participantes.length; i++){
    if(activeUsers.includes(participantes[i].name) === false){
      activeUsers.push(participantes[i]);
      if(destinatario == participantes[i].name){
        ulParticipantes.insertAdjacentHTML("beforeend", `
      <span class="contato selecionado">
      <ion-icon class="icon" name="person-circle" onclick="sendTo(this)">${participantes[i].name}</ion-icon>
      ${participantes[i].name}
      <ion-icon class="check-icon hidden"name="checkmark-outline"></ion-icon>
      </span>
      `);
      }else{
        ulParticipantes.insertAdjacentHTML("beforeend", `
      <span class="contato">
      <ion-icon class="icon" name="person-circle" onclick="sendTo(this)">${participantes[i].name}</ion-icon>
      ${participantes[i].name}
      <ion-icon class="check-icon hidden"name="checkmark-outline"></ion-icon>
      </span>
      `);
      }
    }
  }
}

function sendTo(elemento){
  const contatoSelecionado = document.querySelector(".contato.selecionado")
  if(contatoSelecionado !== null){
    contatoSelecionado.classList.toggle("selecionado");
  }
  elemento.parentNode.classList.toggle("selecionado");
  destinatario = elemento.innerHTML;
}

function setVisibility(elemento){
  const settedVisibility = document.querySelector(".visibilidade.selecionado");

  if(settedVisibility !== null){
    settedVisibility.classList.toggle("selecionado");
  }

  elemento.parentNode.classList.toggle("selecionado")
  estatus = elemento.innerHTML;
}

function atualizarMensagem(){
  const msg = document.querySelector(".aSerEnviado");
  let msj;
  if(estatus === "private_message"){
    msj = "Reservadamente";
  }else if(destinatario === "Todos"){
    msj = "";
  }else{
    msj = "Público"
  }
  msg.innerHTML = `
    Enviando para ${destinatario} (${msj})
  `
}