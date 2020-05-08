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
const serviceAccount = {/*Credentials*/}  


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
