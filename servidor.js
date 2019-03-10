var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

var shortId = require("shortid");

app.use(express.static(__dirname));
var usuarios = [];
var posicaoArmazenada = [];
var ts = Date.now();



io.on('connection', function(socket){

var jogador;

	socket.on('beep', function(){
		socket.emit('boop');
	});

	socket.on('LOGIN', function(dados_jogador){//essa função esta recebendo todas as informações que um jogador pode ter
		console.log('Um usuario acaba de se conectar');
		jogador = {
			nome:dados_jogador.nome,
			id:shortId.generate(),
			posicao:dados_jogador.posicao,
			rotacao:dados_jogador.rotacao,

		};

		usuarios.push(jogador);//o jogador será adicionado a lista
		console.log(usuarios.length);
		console.log("o usuario "+jogador.nome+" acabou de entrar");

		socket.emit('LOGIN_SUCESSO', jogador);//vai mandar a confimação que o login foi um sucesso

		//para cada player que entrar, as informações abaixo serão repassado aos outros

		for(var i = 0; i < usuarios.length; i++){

			if(usuarios[i].id != jogador.id){

				socket.emit("spawnar jogador online", {

					nome:usuarios[i].nome,
					id:usuarios[i].id,
					posicao:usuarios[i].posicao,
					rotacao:usuarios[i].rotacao

				});

				console.log("o jogador "+usuarios[i].nome+" acabou de entrar");

			};

		};

		socket.broadcast.emit("spawnar jogador online", jogador);

// desconecta usuario e elimina da lista
		socket.on("desconectou", function(){


			for(var i = 0; i < usuarios.length; i++){
				if(jogador.nome == usuarios[i].nome){

					usuarios.splice(jogador.nome, 1);//ELIMINADO!

					console.log("o jogador "+jogador.nome+" saiu");

					}

			console.log("usuarios conectados no momento: "+ usuarios[i].nome);
			socket.broadcast.emit("usuario desconectado", jogador);




			};


			});


			socket.on("POSICAO", function(dados){

				posicaoArmazenada.push(dados.posicao);

					for(var i =0; i<+posicaoArmazenada.length; i++){

						jogador.posicao = posicaoArmazenada[i];

						//console.log(dados.nome +" "+posicaoArmazenada[i]);
					while(posicaoArmazenada.length > 70){

						posicaoArmazenada.shift();

					};
					};

				socket.broadcast.emit("atualizar posicao", jogador);

			});

			socket.on("ROTACAO", function(dados_jogador){

				jogador.rotacao = dados_jogador.rotacao;
				socket.broadcast.emit("atualizar rotacao", jogador);


		});

		socket.on("Microfone Ligar", function(){

			socket.broadcast.emit("Microfone Ligado", jogador);

		});

		});
});

console.log('O server ta rodando!');

http.listen(process.env.PORT || 3000, function(){

	console.log("escutando na porta 3000");

});
