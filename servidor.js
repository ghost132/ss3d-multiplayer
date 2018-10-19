var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

var shortId = require("shortid");

app.use(express.static(__dirname));
var usuarios = [];



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
			rotacao:dados_jogador.rotacao

		}

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

			}

		}

		socket.broadcast.emit("spawnar jogador online", jogador);

// desconecta usuario e elimina da lista
		socket.on("desconectado", function(){

			socket.broadcast.emit("usuario desconectado", jogador);

			for(var i = 0; i < usuarios.lenght; i++){

				if(usuarios[i].nome == jogador.nome && usuarios[i].id == jogador.id){

					usuarios.splice(i, 1);//ELIMINADO!
					console.log("o jogador "+usuarios[i].nome+" saiu");
					console.log(usuarios.length);

				}

			}


			});


					socket.on("Liga Mic", function(){

						socket.broadcast.emit("Mic Ligado", jogador)
						console.log("mic ligado");

					});

					socket.on("Desliga Mic", function(){

						socket.broadcast.emit("Mic Desligado", jogador)
						console.log("mic desligado");

					});

			socket.on("POSICAO", function(dados){
				jogador.posicao = dados.posicao;
				socket.broadcast.emit("atualizar posicao", jogador);

			});

			socket.on("ROTACAO", function(dados_jogador){

				jogador.rotacao = dados_jogador.rotacao;
				socket.broadcast.emit("atualizar rotacao", jogador);


		});


		});
});

console.log('O server ta rodando!');

http.listen(process.env.PORT || 3000, function(){

	console.log("escutando na porta 3000");

});
