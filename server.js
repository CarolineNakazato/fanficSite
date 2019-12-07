var express = require('express');
var session = require('express-session');
var app = express();
const path = require('path');
var bodyParser=require("body-parser"); 
var str = "";
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";
let MONGO_CONFIG = {useUnifiedTopology: true, useNewUrlParser: true}
let http = require('http');

var titulo;  
  
 var server = http.createServer(app);
  
app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
    extended: true
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
		dbo.collection("usuarios").insertOne(data,
		function(err, result) {
			if (err) throw err;
			db.close();
				res.sendFile(path.join(__dirname+'/index.html'));

		});
	});
});

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
				console.log(result.senha);
				if (result.senha==senha){
					db.close();
					res.sendFile(path.join(__dirname+'/home.html'));
				}else{
					db.close();
					res.sendFile(path.join(__dirname+'/index.html'));
				}
			});
			
		});
});

app.get('/sair', function(req, res) {
	req.session.destroy(function() {
		res.send("Sessão finalizada!");
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

app.get('/listar.html', function(req, res) {
	//res.end((new Date()).toGMTString());
	req.session.views++;
	MongoClient.connect(url, MONGO_CONFIG,
		function(err, db) {
			if (err) throw err;
			var dbo = db.db("user");
			  dbo.collection("historias").findOne({titulo: titulo}, 
			  function(err, result) {
				if (err) throw err;
					db.close();
					res.end("<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Listar</title><link rel='stylesheet' href='//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css'><script src='https://code.jquery.com/jquery-1.12.4.js'></script><script src='https://code.jquery.com/ui/1.12.1/jquery-ui.js'></script><script>$( function() {$( '#accordion' ).accordion();} );</script></head><body><div id='accordion'><h3>"+ result.titulo+"</h3><div><p>"+ result.categoria+"</br>"+result.sinopse+"</p></div><h3>Texto</h3><div><p>"+result.texto+ "</p></div></body></html>");
					console.log(result);
			});
			
		});
});

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
					db.close();
					res.end("<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Listar</title><link rel='stylesheet' href='//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css'><script src='https://code.jquery.com/jquery-1.12.4.js'></script><script src='https://code.jquery.com/ui/1.12.1/jquery-ui.js'></script><script>$( function() {$( '#accordion' ).accordion({collapsible: true}); $( '.widget input[type=submit], .widget a, .widget button').button();} );</script></head><body><div id='accordion'><h3>"+ result.titulo+"</h3><div><p>"+ result.categoria+"</br>"+result.sinopse+"</p></div><h3>Texto</h3><div><p>"+result.texto+ "</p></div><a class='ui-button ui-widget ui-corner-all' href='/comentar.html'>Comentar</a></body></html>");
					console.log(result);
			});
			
		});
});


app.post('/publicarHistoria.html', function(req, res) {
	req.session.views++;
	
	var titulo = req.body.titulo; 
	var categoria =req.body.categoria; 
	var sinopse = req.body.sinopse; 
	var texto = req.body.texto; 
	
	var data = { 
		"titulo": titulo, 
		"categoria":categoria, 
		"sinopse":sinopse,
		"texto":texto
	} 
	
	MongoClient.connect(url, MONGO_CONFIG,
	function(err, db) {
		if (err) throw err;
		var dbo = db.db("user");
		dbo.collection("historias").insertOne(data,
		function(err, result) {
			if (err) throw err;
			db.close();
				res.sendFile(path.join(__dirname+'/home.html'));

		});
	});
});

server.listen(8000, function() {});