const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

//Defino path para la config de Express
const publicDirectoryPath = path.join(__dirname,'../public');
const viewsPath = path.join(__dirname,'../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//Configuro el view engine a hbs y agrego el path a las view
app.set('view engine','hbs'); 
app.set('views',viewsPath);
hbs.registerPartials(partialsPath);
//Configuro el directorio para acceder a paginas estaticas
app.use(express.static(publicDirectoryPath));



app.get('', (req, res) => {
    res.render('index',{
        title: 'Clima',
        name: 'Sebastian Canio'
    });
});

app.get('/help',(req, res) =>{
    res.render('help',{
        title: 'Ayuda',
        name: 'Sebastian Canio'
    });
});

app.get('/help/*',(req,res) => {
    res.render('errorPage',{
        error: 'Articulo de "Ayuda" no encontrado.',
        title: 'Error 404',
        name: 'Sebastian Canio'
    });
});

app.get('/about',(req, res) =>{
    res.render('about',{
        title: 'Acerca de',
        name: 'Sebastian Canio'
    });
});

app.get('/weather',(req, res) =>{
    if(!req.query.address) return res.send({error:'Debes proveer una dirección'});

    geocode(req.query.address,(geocodeError,{latitude, longitude, place} = {}) => {
        if(geocodeError) return res.send({error: geocodeError});
        forecast(latitude,longitude,(forecastError,{precipProbability, summary, actualTemperature, maxTemperature, minTemperature} = {}) =>{
            if(forecastError) return res.send({forecastError});

            return res.send({
                actualTemperature,
                minTemperature,
                maxTemperature,
                precipProbability,
                summary,
                address: req.query.address,
                place
            });      
        }); 
    });   
});

app.get('/products', (req,res) => {
    if(!req.query.search){
       return res.send({
            error: 'you must provide a search term'
        });
    }else if(req.query.search && req.query.rating){
        return res.send({
            games: ['Runescape']
        }); 
    }else{
        return res.send({
            games: ['LOL','Fornite','Runescape']
        }); 
    }
   
});

app.get('*', (req, res) => {
    res.render('errorPage',{
        error: 'Page not found',
        title: 'Error 404',
        name: 'Sebastian'
    });
});

app.listen(port,() =>{
    console.log('Server is up on port 3000');
});