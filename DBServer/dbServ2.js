const mysql = require('mysql')
const mqtt = require('mqtt')
const moment = require('moment');
const SLASH_DMYHMS = 'DD/MM/YYYY HH:mm:ss';
var conDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rjk3145001",
  database: "mconnect_data"
});

conDB.connect(function(err) {
  if (err) throw err;
  console.log("DB Connected");
});

var server = "m16.cloudmqtt.com" //CloudMqtt Server
var Topic = "DB/talk"
var Tpreply = "DB/run"
var TopicData = "MMM/G00001/#" // All group1
var Tomconn = "RM/G00001/#" //for reply to mconnect board  
var message=""
var client = ""
const Pub = "1"
var topsend = ""
var  Data = ""
var options = {
port:19237,
clientId: 'DBserv_' + Math.random().toString(16).substr(2, 8), //random ClientID
username: "rgyrtmml",
password: "atLu2AKVWPa7",
clean:true
}

client  = mqtt.connect(`mqtt://${server}`, options)
  
client.on('connect', function() { // When connected
       console.log('MQTT Connected '+ client.connected)
       
      
    client.subscribe(TopicData, function(){
       client.on('message', function(topic, message, packet) { 
        
         if((message.toString().indexOf('#M') == 0)&&(message.toString() != "")&&(message.toString().length > 148)||(message.toString().indexOf('#R') == 0)){
          Data = message.toString()
          topsend = topic
         }
         
            console.log(packet)
            console.log(message)
            console.log(Data)

if(topic.match(/MMM/)){
  var sql = "INSERT INTO rawdata (topic,data,datetime) VALUES ('"+topsend+"','"+Data+"','"+moment().format(SLASH_DMYHMS)+"')";
  conDB.query(sql, function (err, result) {
    if (err) throw err;
        console.log("Insert Data ok");
        topsend = ""
        Data = ""
        console.log('NOW: ',moment().format(SLASH_DMYHMS));
        client.publish("RM/G00001/C01/M001","OK",function() {
           console.log("Reply to Mconnect");
          
       })

    });
 } 
            
})

})
     
             
})  // on connect

dmyhms = ""
