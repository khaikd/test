var express = require('express');
var app = express();
// set up handlebars view engine
var handlebars = require('express3-handlebars').create({ defaultLayout:'main' });
var fortune = require('./lib/fortune.js');

app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' &&
        req.query.test === '1';
    next();
});

app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.POST || 3000);

app.get('/', function(req, res){
    res.render('pages/home');
});
app.get('/about', function(req, res){
    res.render('pages/about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    });
});

app.get('/tours/hood-river', function(req, res){
    res.render('pages/tours/hood-river');
});

app.get('/tours/request-group-rate', function(req, res){
    res.render('pages/tours/request-group-rate');
});

app.get('/headers', function(req,res){
    res.set('Content-Type','text/plain');
    var s = '';
    for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
    res.send(s);
});

// custom 404 page
app.use(function (req, res) {
    res.status(404);
    res.render('pages/404');
});

// custom 500 page
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('pages/500');
});

app.disable('x-powered-by');

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:'+ app.get('port') + '; press Ctrl-C to terminate.');
});