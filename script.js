let mensagens;
console.log(1);

const resposta = [
	{
		from: "João",
		to: "Todos",
		text: "entra na sala...",
		type: "status",
		time: "08:01:17"
	},
	{
		from: "João",
		to: "Todos",
		text: "Bom dia",
		type: "message",
		time: "08:02:50"
	},
]

function login(){
    const nome = document.querySelector(".nome").value;

    const promessa = axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/participants",
        {
          name: nome,
        }
      );

    promessa.then(nomeCadastrado);
    promessa.catch(tratarError);

    onlineStatus();
}

function onlineStatus(){
    setInterval(function () {
        axios.post(
            "https://mock-api.driven.com.br/api/v6/uol/status",
            {
              name: nome,
            }
          );
    }, 4000);
}

function nomeCadastrado(){
    alert("nome cadastrado com sucesso")
}

function tratarErro(error){
    if(error.response.status === 400){
        alert("Já existe um usuário online com esse nome, tente novamente");
    }
}

function renderizarMensagens() {
    const ulMensagens = document.querySelector(".mensagens");
    ulMensagens.innerHTML = "";
  
    for (let i = 0; i < mensagens.length; i++) {
      ulMensagens.innerHTML += `
      <div class="mensagem-sistema"><h2>(09:22:38) </h2> <h1>João</h1> entra na sala...</div>
          `;
    }
  }

function carregarMensagens(response){
    mensagens = response.data;
    renderizarMensagens();
}

function pegarMensagens() {
    const promise = axios.get(
      "https://mock-api.driven.com.br/api/v6/uol/messages"
    );
    promise.then(carregarMensagens);
  }

function enviarMensagem() {
    const mensagem = document.querySelector(".enviar").value;

    console.log(mensagem)

    const novaMensagem = {
        from: "asdasdasdasdasdadad",
        to: "Todos",
        text: mensagem,
        type: "message"
    }

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", novaMensagem);

    promise.then(pegarMensagens);
    promise.catch(tratarErro);
}
