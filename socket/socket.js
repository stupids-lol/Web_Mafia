//socket.js

let num = 1;
let rooms = {};
let count = 0;

module.exports = function(server, session){
const io = require('socket.io')(server);
const sharedsession = require("express-socket.io-session");
const lobby = io.of('/lobby');
const chat = io.of('/chat');

lobby.use(sharedsession(session), {
autoSave:true
});

/*

lobby

*/
lobby.on('connection', function(socket){
socket.handshake.session.save();

socket.emit('new room', Object.values(rooms));

socket.on('create room', function(name){
let data = {
no: num,
name: name,
nickname: [],
player: []
}

const no = num;

num++;

console.log(no);
console.log('socket.join',no);
console.log(socket.handshake.session.user);
socket.handshake.session.user.room = no;
socket.handshake.session.user.join = no;

socket.handshake.session.save();

rooms[no] = data;
console.log(rooms)
lobby.emit('new room', [data]);

});

socket.on('join room', function(no){
console.log(no);
console.log('socket.join',no);

socket.handshake.session.user.room = no;
socket.handshake.session.user.join = no;

console.log(socket.handshake.session.user);
socket.handshake.session.save();
});

});


chat.use(sharedsession(session), {
autoSave:true
});

/*

chat

*/
chat.on('connection', function(socket){ // if client connected
socket.handshake.session.save();

let name;
let room;

console.log(socket.handshake.session.user);

if(socket.handshake.session.user === undefined){
count++;
socket.emit('redirection', '/');
}
else if(socket.handshake.session.user.room === -1){
count++;
socket.emit('redirection', '/');
}
else{
name = socket.handshake.session.user.name;
room = socket.handshake.session.user.room;

lobby.emit('join update', room, name);

rooms[room].player.push(socket.id);
rooms[room].nickname.push(name);

count++;
console.log('user connected: ', name , getToday());

let role = new Array('Mafia', 'Sky');

function randomItem(a) {
return a[Math.floor(Math.random() * a.length)];
}

let data = {
role: randomItem(role)
}

socket.join(room);

chat.to(room).emit('receive message', name + ' joined the chat');
chat.to(room).emit('receive message', count + ' people are chatting.');
}

socket.on('disconnect', function(){ // if client disconect
count--;
chat.to(room).emit('receive message', name + ' left the chat');
chat.to(room).emit('receive message', count + ' people are chatting.');

console.log('user disconnected: ', name , getToday());
console.log(count + ' people are chatting.');

if(socket.handshake.session.user){
socket.handshake.session.user.room = -1;

for(let i = 0; i < rooms[room].player.length; i++){
if(rooms[room].player[i] === socket.id){
lobby.emit('leave update', socket.handshake.session.user.join, socket.handshake.session.user.name);

rooms[room].player.splice(i,1);
rooms[room].nickname.splice(i,1);

if(rooms[room].player.length === 0){
lobby.emit('del room', rooms[room].no);
delete rooms[room];

}
break;
}
}
}

if(socket.handshake.session.user){
socket.handshake.session.user.join = 0;
socket.handshake.session.save();
}
});

socket.on('send message', function(text){ // if client message sned
if (text != ''){
var msg = name + ' : ' + text;
console.log(msg , getToday());
console.log(socket.id)
chat.to(room).emit('receive message', msg);
}
});



/*

chat
game

*/
socket.on('game start', function(){
console.log(rooms[room].interval);
if(rooms[room].interval != undefined){
clearInterval(rooms[room].interval);
rooms[room].die = null
}

let day = 0;
let player = rooms[room].player;
let time = 0;

let jobs = [];
jobs.push(1);
if(player.length > 4)jobs.push(1);
for(let i = jobs.length; i < player.length; i++){
jobs.push(0);
}


jobs.sort(function(){return 0.5-Math.random()});

rooms[room].jobs = jobs;

for (let i = 0; i < player.length; i++){
chat.to(player[i]).emit('set job', jobs[i]);
}
day_timer();
rooms[room].interval = setInterval(day_timer,100);
function day_timer() {
if(day === 1){ // 저녁
chat.to(room).emit('set day', day);
day = 2;
clearInterval(rooms[room].interval);
rooms[room].interval = setInterval(day_timer,30000);
}else if(day === 2){// 낮
let diec = 0;
let mafiac = 0;
for(let i = 0; i < rooms[room].player.length; i++){
if(rooms[room].nickname[i] === rooms[room].die){
rooms[room].jobs[i] = 10;
chat.to(player[i]).emit('set job', 10);
let msg = rooms[room].die + '님이 마피아의 공격으로 사망하였습니다.';
chat.to(room).emit('receive message', msg);
}
}
for(let i = 0; i < rooms[room].player.length; i++){
if(rooms[room].jobs[i] === 10){
diec += 1;
}else if(rooms[room].jobs[i] === 1){
mafiac += 1
}
}
if(rooms[room].player.length - diec - mafiac < mafiac || mafiac === 0){
chat.to(room).emit('set day', 5);
for(let i = 0; i < rooms[room].player.length; i++){
rooms[room].jobs[i] = 0;
rooms[room].die = undefined;
}
clearInterval(rooms[room].interval);
}else{
console.log(day);
chat.to(room).emit('set day', day);
rooms[room].die = undefined;
day = 3;
clearInterval(rooms[room].interval);
rooms[room].interval = setInterval(day_timer,60000);
}
}else if(day === 3){// 투표
chat.to(room).emit('set day', day);
chat.to(room).emit('receive message', '투표시간입니다!!');
day = 4;
clearInterval(rooms[room].interval);
rooms[room].interval = setInterval(day_timer,15000);
rooms[room].vote={};
}else if (day === 4){
let diec = 0;
let mafiac = 0;
day = 1;

let select, max = 0;
for(let i in rooms[room].vote){
if(i !== undefined && rooms[room].vote[i] > max){
max = rooms[room].vote[i];
}
}
for(let i in rooms[room].vote){
if(i !== undefined && rooms[room].vote[i] === max){
if (select === undefined){
select = i;
}
else{
select = undefined;
break;
}
}
}
if (select !== undefined){
for(let i = 0; i < rooms[room].player.length; i++){
if(rooms[room].nickname[i] === select){
rooms[room].jobs[i] = 10;
chat.to(player[i]).emit('set job', 10);
}
}
let msg = select + '님이 투표로 사망하였습니다';
chat.to(room).emit('receive message', msg);
}
else{
let msg = "투표가 무효되었습니다.";
chat.to(room).emit('receive message', msg);
}
for(let i = 0; i < rooms[room].player.length; i++){
if(rooms[room].jobs[i] === 10){
diec += 1;
}else if(rooms[room].jobs[i] === 1){
mafiac += 1
}
}
if(rooms[room].player.length - diec - mafiac < mafiac || mafiac === 0){
chat.to(room).emit('set day', 5);
for(let i = 0; i < rooms[room].player.length; i++){
rooms[room].jobs[i] = 0;
rooms[room].die = undefined;
}
clearInterval(rooms[room].interval);
}else{
chat.to(room).emit('set day', day);
clearInterval(rooms[room].interval);
rooms[room].interval = setInterval(day_timer,5000);
}
}else if(day === 0){ // 기본 인터벌 체크
day = 1;
}else if(day === 5){
clearInterval(rooms[room].interval);
}
}
});

socket.on('send mafia message', function(text){
let msg = '[mafia] '+ name + ' : ' + text;
console.log('[mafia] ', msg , getToday());
console.log(socket.id)
for(let i = 0; i < rooms[room].jobs.length; i++){
if(rooms[room].jobs[i] === 1){
chat.to(rooms[room].player[i]).emit('receive mafia message', msg);
}
}
});

socket.on('send die message', function(text){
let msg = '[die] '+ name + ' : ' + text;
console.log('[die] ', msg , getToday());
console.log(socket.id)
for(let i = 0; i < rooms[room].jobs.length; i++){
if(rooms[room].jobs[i] === 10){
chat.to(rooms[room].player[i]).emit('receive die message', msg);
}
}
});

socket.on('send kill', function(text){
console.log('[kill] '+name+' => '+text);
rooms[room].die = text
})

socket.on('vote', function(target){
console.log('[vote] '+name+' => '+target);
if(rooms[room].vote[target] === undefined){
rooms[room].vote[target] = 0;
}
rooms[room].vote[target]++;
});

});
};

function getToday(){
var date = new Date();
return date.getFullYear() +'.'+ (date.getMonth()+1) +'.'+ date.getDate() +' '+ date.getHours() +':'+ date.getMinutes() +':'+date.getSeconds();
}
