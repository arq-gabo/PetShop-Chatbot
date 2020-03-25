const express = require('express');
const mysql = require('mysql');
const {google} = require('googleapis');
const path = require('path');

const app = express();
app.set('views engine', 'ejs');//atention

let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('views'));

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, '/views/index.html'));
});

//google apis
const calendarId = "q5k40j6ns7rgfhnq5r7a5pb50k@group.calendar.google.com";
const serviceAccount = {
    "type": "service_account",
    "project_id": "petshop-project-dorggq",
    "private_key_id": "2c6867cfc77d4ec379cc3c740e3cb65235e262e1",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDJxH/pz8lw8eh/\ngnTFBUCSFZeI8ny5HIrcOsJxh3mmdiWZW6qHbFma0kcXRvfJZGZ8tnROk4ZI7Cz5\nIFbDiKhdQPax7TDjs5T9NsCcyk9bWNYmfYct84Lnp0skbgzQU5OKaRVoY1AYZtJO\nQKm9wGBcrwGDK6KX2Zo7IlY1ASLvTC0UdWzD68Q+Lb+OEjZuBojBk1EcFEgGmW1s\nZtDS2Hrp3ZV7R3UPclWkEaMIMQQbE7a4wCxivT7RTi67p0BU7PkT1nIkD40sIrv2\nXApIJAwJ++Mm1PonitxO2a3CawkHOJqETEpUR/j5ImDjZAt+tCyrsTP9V4bFlOJV\nHo3GZkuzAgMBAAECggEAEfhjYCK2kU2qZHjtB4MxPhGYPoVCYIZPQ9Aj81Kanh3V\nuXP1mzwmOujRlhwnA5PioObrMvhmtGX8l2+u6ploTW30yuISQaWD9o2C2DQYn00p\nPaJegNQ4a4N16Ne4YnGfKWu0kWiPAK1fu8J8m77flkGsA8/GGnoyB2RGg1AHmYJp\nz2CfQmHvFd7LOJeLjA47IEW1fA/VgwD+hQ7c2AK3kTGZIA+tf+CfJCqBzw8dIN6D\nfd/LBTAL0g7zVf4iSquisRkQSzIVi6zWCzCgBu5AXEVRc/LDkblDhkDfFzgMcqYN\nVAQP3tabhpTfA769mkY2zUgv9IWmi800RuJnfJw9MQKBgQDxHLwOn4emq4/bY7o+\nvDT/gvxJLmr9sIgi88mBbc2fbRaUVKzHG9oZwW8lzFzHK3IRxDTqxrXr9p8sg1c+\nlazXVAG992ZZqDscpDjtIJmJ7JGGh6M4+4kJZCJaUy1+EWAXOpcDfECtO4JkD9l6\n9TY1xOFb6i8RYMTohDa/8bWsqwKBgQDWOdfddk9DKvD/mosDKLpIiBp8B+sYput2\nU7aIanTLFp/eeVROcrC0uUq66tOSapTdpZY5t0L4agWnswHLl0FM1Gk78qn1SoWG\nJSc6Hs0SeRfVOFZltM7Zj4SF6UqgjUQZD33B3s44b1Ic/b5Yh5IBGUsH+w2ogzeQ\numBakitNGQKBgQCiInZ7Rt+LPnbgSrGlGh5xa32HIIWlzp3dEx5/wHyzJkI2wLHm\nul3xT9gUDNaewCJWvB/xeGpBIHhtEG0Mks3FhqIdQk47IBuP6Qa2vmNBEinR00f5\nO3wtKn7HSoOe8MQzGp0OJPHBC/FkpBvUySwJADmi+1lnUDFZQf8nF7zZPQKBgFXA\nzdJO26etds86k87t7LPAF6nymX9CwhqZpAWzZ5EsO06ZDtBgRK/zRCDSg2Km23Rm\nJl5wJ5S9DAp3M47Fu1P/6ygeGT6hWBW8pZk0Xy633nxxktQfrnWUZ54bJs5h/hJy\nCwsiHzakCSClyh4yFpXuBATr0CnWbNW4ZX2b6U1xAoGAIlEiGpehucHO8sHpePkN\nSef67smnIDxGria6BiUXkf8LYnr2+eAVhgaIyC+3OTcHK9qwC1+cvrwZIBsu2EZT\nrD5a0wz+QrMZaR+IDu1mXEKUGJW/eq5/lgKjWibj+s4QFQN4w9vLj6Sgw9yyhGHg\n5FKMc4vqcjVHefGfAX7SqWM=\n-----END PRIVATE KEY-----\n",
    "client_email": "petshop-calendar@petshop-project-dorggq.iam.gserviceaccount.com",
    "client_id": "111770832313700094509",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/petshop-calendar%40petshop-project-dorggq.iam.gserviceaccount.com"
}  


const timeZoneOffset = '-05:00';

const serviceAccountAuth = new google.auth.JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: 'https://www.googleapis.com/auth/calendar'
});

const calendar = google.calendar('v3');


//create webhook
app.post('/appointment', function(request, response){
    let intentName = request.body.queryResult.intent.displayName;

    let name = request.body.queryResult.parameters['name'];
    let phone = request.body.queryResult.parameters['phone'];
    let pet = request.body.queryResult.parameters['pet'];
    let name_pet = request.body.queryResult.parameters['name_pet'];
    let service = request.body.queryResult.parameters['service'];
    let date = request.body.queryResult.parameters['date'];
    let time = request.body.queryResult.parameters['time'];

    

    if (intentName === 'appointment'){
       
        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "petshop_project"
          });
          
          con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            let sql_query = "INSERT INTO appointment (name, phone, pet, name_pet, service, date, time) VALUES ('"+name+"', '"+phone+"', '"+pet+"', '"+name_pet+"', '"+service+"', '"+date+"', '"+time+"')";

            con.query(sql_query, function (err, result) {
              if (err) throw err;
              con.end();
              console.log("Record inserted");
            });
          });

          //integrade width google calendar
        let name_cal = name;
        const dateTimeStart = new Date(date.split('T')[0] + 'T' + time.split('T')[1]);
        const dateTimeEnd = new Date(new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1));
        const reservationString = formatData(new Date(date.split('T')[0]))+ " as "+time.split('T')[1].split('-')[0];

        console.log(`name: ${name}`);
        console.log(`phone: ${phone}`);
        console.log(`date: ${pet}`);
        console.log(`time: ${name_pet}`);
        console.log(`service: ${service}`);
        console.log(`date: ${date}`);
        console.log(`time: ${time}`);
        console.log("---------"+name_cal+"----------");
        console.log(`dateTimeStart: ${dateTimeStart}`);
        console.log(`dateTimeEnd: ${dateTimeEnd}`);
        console.log(`reservationString: ${reservationString}`);
          

        return createEventCalendar(dateTimeStart, dateTimeEnd, name_cal, phone, pet, name_pet, service). then(() =>{
            let message = `Ok, your reservation has register for ${reservationString}, thanks you...!!!`;
            console.log(message);
            response.json({'fulfillmentText': message});
        }).catch (() =>{
            let message = `Sorry we don't have a date available`;
            console.log(message);
            response.json({'fulfillmentText': message});
        })
    }

function createEventCalendar(dateTimeStart, dateTimeEnd, name_cal, phone, pet, name_pet, service) {
    return new Promise ((resolve, reject) => {
        calendar.events.list({
            auth: serviceAccountAuth,
            calendarId: calendarId,
            timeMin: dateTimeStart.toISOString(),
            timeMax: dateTimeEnd.toISOString()
        }, (err, calendarResponse) => {
            //Check if there is a event already on the calendar calendarResponse.data.items.length
            if(err || calendarResponse.data.items.length > 0){
                reject(err || new Error('requisition conflicts with other schedules'));
            } else {
                //create event for the requestes time period
                calendar.events.insert({ auth: serviceAccountAuth,
                calendarId: calendarId,
                resource: {summary: `Appointment for: ${name_cal},   phone: ${phone}`, description: `type_pet: ${pet},   name pet: ${name_pet},   type service: ${service}`,
                start: {dateTime: dateTimeStart},
                end: {dateTime: dateTimeEnd}}
            }, (err, event) => {
                err ? reject(err) : resolve(event);
            })
            }
        })
    })

}

function formatData(date){
    var month = ["January", "February", "March",  "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var day = date.getDate() + 1;
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + month[monthIndex] + ' ' + year;
}

})
var port = process.env.PORT || 3000;
const listener = app.listen(port, function(){
    console.log('The app listening un port ' + listener.address().port);
})