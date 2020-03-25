

# Chatbot for Business

## Development of a chatbot for the automation of some tasks in local businesses

This project arises from the need to connect consumers with local businesses through their smartphone without the need to download a new app, but simply use a messaging application already installed on their smartphones.

And for businesses they automate any tasks to interact with their customers, without the need to develop their own mobile appl, but rather they take advantage of the fact that messaging applications are the most downloaded by users to stay connected.

## Working diagram

The development of the chatbot, unlike when a user connects from a computer or smarphone to our application, it will connect through an ISP to a DNS, and this in turn will connect to our application that will to receive and respond to requests from our users.

In the chatbot we initially connect to the application servers, this in turn connects to the servers of an "INTEGRATOR" that will be the receiver of the messages, this will communicate with the server of an Agent_intent in which the flow of the conversation and apply artificial intelligence to the interaction with the language, this Agent intent will connect to our server to respond to the requests of our users

## Applied technologies

We create a web page simulating a local business, for this we use HTML5, CSS using Bootstrap with a framewok, and JavaScript, for users we will use WhatsApp and as our application will create events at a certain time and date, we will be able to see them through Google calendar

In the backen we use NODE.JS with packages EXPRESS, BODY-PARSER, MYSQL, GOOGLEAPIS, as database manager we will use MYSQL

To Interact with the chatbot we will use the TWILIO platform as an intermediary that will give us a receiver number, DIALOGFLOW as AGENT INTEN to interact with the rest of our BackEnd and the services of GOOGLE CLOUD SERVICE for the creation of events that will be displayed on GOOGLE CALENDAR

## Agent Intent

For demonstration purposes we are going to simulate that we are a pet store, and we want to automate supplying information to our clients, such as working hours, what service we offer and where we are located.

We will also process veterinary appointment requests fully automatically, we only require the user to provide their information such as name, telephone, pet, what date and time they want the appointment, with these data we create the event and this will be reflected in our calendar. PET-SHOP
