var express = require('express');
var session = require('express-session');
var app = express();
const path = require('path');
var bodyParser=require("body-parser"); 
var str = "";
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";
//let url = "mongodb+srv://carol:123@cluster0-uzpi0.gcp.mongodb.net/test?retryWrites=true&w=majority";
let MONGO_CONFIG = {useUnifiedTopology: true, useNewUrlParser: true}
let http = require('http');

 var server = http.createServer(app);
  
app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
    extended: false
})); 

app.use(session({
	secret: "chave criptográfica",
	secure: false,
	resave: false,
	saveUninitialized: false,
}));

app.get('/', function (req, res) { 
	res.sendFile(__dirname + '/index.html');
});

app.post('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.post('/index.html', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/index.html', function(req, res) { 
	res.sendFile(__dirname + '/index.html');

});

app.post('/cadastrar.html', function(req, res) {
	res.sendFile(path.join(__dirname+'/cadastrar.html'));
});

app.get('/cadastrar.html', function(req, res) {
	res.sendFile(path.join(__dirname+'/cadastrar.html'));
});

app.post('/entrar.html', function(req, res) {
	res.sendFile(path.join(__dirname+'/portal.html'));
 
});

app.get('/entrar.html', function(req, res) {
	res.sendFile(path.join(__dirname+'/portal.html'));
});

app.post('/home.html', function(req, res) {
	res.sendFile(path.join(__dirname+'/home.html'));
 
});

app.get('/home.html', function(req, res) {
	res.sendFile(path.join(__dirname+'/home.html'));
});

app.post('/usuariocadastrado.html', function(req, res) {
	var nome = req.body.nome; 
	var email =req.body.email; 
	var senha = req.body.senha; 
	
	console.log(nome +email);
	
	var data = { 
		"nome": nome, 
		"email":email, 
		"senha":senha
	} 
	
	MongoClient.connect(url, MONGO_CONFIG,
	function(err, db) {
		if (err) throw err;
		var dbo = db.db("user");
		
		dbo.collection("usuarios").findOne({email: email}, 
			function(err, result) {
				if (err) throw err;
				if (result!=null){
					db.close();
					res.sendFile(path.join(__dirname+'/cadastrar.html'));
				}else{
					dbo.collection("usuarios").insertOne(data,
					function(err, result) {
						if (err) throw err;
						db.close();
						res.sendFile(path.join(__dirname+'/index.html'));

					});
				}
				
			});
		
		
		
		
	});
});

app.set('view engine', 'ejs');

app.post('/portal.html', function(req, res) {
	var nome = req.body.nome; 
	var senha = req.body.senha; 
	
	req.session.views = 1;
	req.session.cookie.maxAge = 5000;
	
	MongoClient.connect(url, MONGO_CONFIG,
		function(err, db) {
			if (err) throw err;
			var dbo = db.db("user");
			dbo.collection("usuarios").findOne({nome: nome}, 
			function(err, result) {
				if (err) throw err;
				if (result==null){
					db.close();
					res.sendFile(path.join(__dirname+'/index.html'));
				}else{
					console.log(result);
					if (result.senha==senha){
						db.close();
						//res.render('home', {nome: nome});
						res.sendFile(path.join(__dirname+'/home.html'));
						//res.sendFile(path.join(__dirname+'/usuario/'+nome));
					}else{
						db.close();
						res.sendFile(path.join(__dirname+'/index.html'));
					}
				}
				
			});
			
		});
});
app.get('/sair.html', function(req, res) {
	req.session.destroy(function() {
		res.sendFile(path.join(__dirname+'/index.html'));
	});
});

app.post('/buscar.html', function(req, res) {
	res.sendFile(path.join(__dirname+'/buscar.html'));
});

app.get('/buscar.html', function(req, res) {
	res.sendFile(path.join(__dirname+'/buscar.html'));
});


app.post('/publicar.html', function(req, res) {
	res.sendFile(path.join(__dirname+'/publicar.html'));
});

app.get('/publicar.html', function(req, res) {
	res.sendFile(path.join(__dirname+'/publicar.html'));
});

/**app.get('/listar.html', function(req, res) {
	//res.end((new Date()).toGMTString());
	req.session.views++;
	MongoClient.connect(url, MONGO_CONFIG,
		function(err, db) {
			if (err) throw err;
			var dbo = db.db("user");
			  dbo.collection("historias").findOne({titulo: titulo}, 
			  function(err, result) {
				if (err) throw err;
				if (result==null){
					db.close();
					res.sendFile(path.join(__dirname+'/buscar.html'));
				}else{
					db.close();
					res.end("<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Listar</title><link rel='stylesheet' href='//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css'><script src='https://code.jquery.com/jquery-1.12.4.js'></script><script src='https://code.jquery.com/ui/1.12.1/jquery-ui.js'></script><script>$( function() {$( '#accordion' ).accordion();} );</script></head><body><div id='accordion'><h3>"+ result.titulo+"</h3><div><p>"+ result.categoria+"</br>"+result.sinopse+"</p></div><h3>Texto</h3><div><p>"+result.texto+ "</p></div></body></html>");
					console.log(result);
				}
			});
			
		});
});
cor salmao f18973
**/

app.post('/buscarHistoria.html', function(req, res) {
	req.session.views++;
	titulo = req.body.titulo;
	MongoClient.connect(url, MONGO_CONFIG,
		function(err, db) {
			if (err) throw err;
			var dbo = db.db("user");
			  dbo.collection("historias").findOne({titulo: titulo}, 
			  function(err, result) {
				if (err) throw err;
				if (result==null){
					db.close();
					res.sendFile(path.join(__dirname+'/buscar.html'));
				}else{
					db.close();
					res.end("<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Listar</title><link rel='stylesheet' href='//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css'><script src='https://code.jquery.com/jquery-1.12.4.js'></script><script src='https://code.jquery.com/ui/1.12.1/jquery-ui.js'></script><script>$( function() {$( '#accordion' ).accordion({collapsible: true, heightStyle: 'content'}); $( '.widget input[type=submit], .widget a, .widget button').button();} );document.addEventListener('DOMContentLoaded', function() {document.getElementById('facebook-share-btt').href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href);}, false);document.addEventListener('DOMContentLoaded', function() {var conteudo = encodeURIComponent(document.title + ' ' + window.location.href);document.getElementById('whatsapp-share-btt').href = 'https://api.whatsapp.com/send?text=' + conteudo;}, false);document.addEventListener('DOMContentLoaded', function() {var url = encodeURIComponent(window.location.href);var titulo = encodeURIComponent(document.title);document.getElementById('twitter-share-btt').href = 'https://twitter.com/intent/tweet?url='+url+'&text='+titulo;}, false);</script><style>.facebook-share-button{display: inline-block;width: 40px;height: 40px;margin: 5px;background-size: 100% 100%;background-image: url('https://www.facebook.com/images/fb_icon_325x325.png');background-repeat: no-repeat;background-position: center;}.whatsapp-share-button {display: inline-block;width: 40px;height: 40px;margin: 5px;background-size: 100% 100%;background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/WhatsApp_logo-color-vertical.svg/294px-WhatsApp_logo-color-vertical.svg.png');background-repeat: no-repeat;background-position: center;}.twitter-share-button{display: inline-block;width: 40px;height: 40px;margin: 5px;background-size: 100% 100%;background-image: url('https://1.bp.blogspot.com/-XXTSxkYUbxA/Wws5j3-KC-I/AAAAAAAAH5Q/NzpolixiXuEv-cFxZjV-jpwjUj3Zg5J3gCLcBGAs/s1600/twitter-icon-iconfinder.png');background-repeat: no-repeat;background-position: center;}body {background: url(https://cdn.wallpapersafari.com/28/45/hFJubS.png) no-repeat center bottom fixed;-webkit-background-size: cover;-moz-background-size: cover;-o-background-size: cover;background-size: cover;background-color: #ffe6e9;}</style></head><body><div id='accordion'><h3>"+ result.titulo+"</h3><div><p>Categoria:</br>&emsp;"+ result.categoria+"</br></br>Autor:</br>&emsp;"+result.autor+"</br></br>Sinopse:</br>&emsp;"+result.sinopse+"</br></br>Data de Publicação:</br>&emsp;"+result.data+"</p></div><h3>Texto</h3><div><p>"+result.texto+ "</p></div><h3>Compartilhar</h3><div><p><a href='' id='whatsapp-share-btt' rel='nofollow' target='_blank' class = 'whatsapp-share-button'></a><a href='' id='facebook-share-btt' rel='nofollow' target='_blank' class='facebook-share-button'></a><a href='' id='twitter-share-btt' rel='nofollow' target='_blank' class='twitter-share-button'></a></p></div></body></html>");
					console.log(result);
				}
			});
			
		});
});


app.post('/publicarHistoria.html', function(req, res) {
	req.session.views++;
	var data = (new Date()).toGMTString();
	var titulo = req.body.titulo; 
	var categoria =req.body.categoria; 
	var sinopse = req.body.sinopse; 
	var texto = req.body.texto; 
	var autor = req.body.demo;
	//console.log(autor);
	sinopse = sinopse.replace(/(?:\r\n|\r|\n)/g, '<br />');
	texto = texto.replace(/(?:\r\n|\r|\n)/g, '<br />');
	//console.log(texto);
	var data = { 
		"titulo": titulo,
		"data":data,
		"autor": autor,
		"categoria":categoria, 
		"sinopse":sinopse,
		"texto":texto
	} 
	
	MongoClient.connect(url, MONGO_CONFIG,
	function(err, db) {
		if (err) throw err;
		var dbo = db.db("user");
		
		dbo.collection("historias").findOne({titulo: titulo}, function(err, result) {
			if (err) throw err;
			if (result!=null){
				db.close();
				res.sendFile(path.join(__dirname+'/publicar.html'));
			}else{
				dbo.collection("historias").insertOne(data,function(err, result) {
					if (err) throw err;
					db.close();
					res.sendFile(path.join(__dirname+'/home.html'));

				});
			}				
		});
		
	});
});

server.listen(8000, function() {});