/* global io */
import Ember from 'ember';

export default Ember.ObjectController.extend(Ember.Evented,{
    
    usernameIsSet : false,  // flag
    filterQuery : '',   // live filter input value
    chat : "",  // the chat input
    chats : [], // the chats
    filteredChat : [],  // a filtered chat
    userlist : "",  // the user list 
    socket : null,  // the web socket object
    useTranscript : 'chats', // which trancsript to use for the chats

    // this property is the chat transcript
    transcript : function () {
        return this.get(this.get('useTranscript'));
    }.property('useTranscript', 'filteredChat'),

    // filter the transcript by message data
    filterTranscript : function () {

        Ember.run.debounce(this, function () {
            var term = this.get('filterQuery'), // The Search term
                query = new RegExp('(' + term + ')', 'ig'), // create a regex
                chats = this.get('chats'),  // get the chat log
                filtered = Ember.A();   // create a container for the filtered results

            if (!term) {    // there should be a search term, and when they delete all the chars from the input, reset the transcript back to the chat array
                this.set('useTranscript', 'chats');
            } else {
                chats.forEach(function (chat) { // filter the chats
                    if (chat.message.match(query)){
                        filtered.push(chat);    // if the chat message contains the search term, push it to the filtered array
                    }
                });
                
                // expose the filtered chat
                this.set('filteredChat', filtered);


                if (this.get('useTranscript') !== 'filteredChat') {
                    this.set('useTranscript', 'filteredChat');  // Use the filtered chat instaed of the entire chat
                }
            }

        }, 500); // Debounce a little (a lot)

    }.observes('filterQuery'),

    // Handles connecting to the web socket, and sets the event listeners to respond to chats
    io_connect : function (username) {
        
        var socket = io.connect(document.URL); // connect to our websocket

        this.set('socket', socket); // expose the web socket object to the rest of the controller

        socket.emit('identify', username);  // expose this user session to connected clients with the username

        socket.on('chat', function (data) { // someone else sent a chat
            this.get("chats").pushObject(data); // add it to the transcript via the chats array
            this.trigger('scrollTranscript');   // tell the view to scroll the trancsript to the bottom
        }.bind(this));

        socket.on('userlist', function (data) { // The userlist is updated
            this.set('userlist', data); // Update the UI
        }.bind(this));

    },

    actions : {

        sendChat: function() {

            // Push the message into the transcript
            this.get("chats").pushObject({
                 message : this.get("chat"), 
                 nickname : "You", 
                 time : new Date().getTime(),
                 self : true
            });

            // Push the message to the server
            this.get("socket").emit("chat", { 
                message : this.get("chat"),
                time : new Date().getTime() // Doing the time client side
            });

            // Clear the input
            this.set("chat", "");

            this.trigger('scrollTranscript');
        },

        setusername : function () {

            var username = this.get('username');

            if (username) {
                this.io_connect(username);  // Connect to the web socket service
                this.set('usernameIsSet', true);    // Show the chat room
            } else {
                this.trigger('no_username');    // username is required :: make things red 
            }
        },

        clearFilterQuery : function () {
            this.set('filterQuery', '');    // Clear the input
            this.set('useTranscript', 'chats'); // choose the chats array as the transcript
        }
    }
});
