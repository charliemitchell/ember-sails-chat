import Ember from 'ember';

export default Ember.View.extend({
    
    didInsertElement : function () {
        // Listen to some controller messages
        this.get('controller')
            .on('no_username', this, this.usernameError)
            .on('scrollTranscript', this, this.scrollTranscript);
    },

    usernameError : function () {
        this.$('#screenNameGroup').addClass('has-error'); // show red warnings
    },
    
    chatThread : false, // cache the DOM lookup

    scrollTranscript : function () {
        Ember.run.next(this, function () {
            if (this.get('chatThread')) {   // if the node is cached
                this.get('chatThread').scrollTop(9e5);  // Scroll it (quicker than measuring)
            } else {
                this.set('chatThread', this.$('.chat-thread')); // Cache it
                this.get('chatThread').scrollTop(9e5);  // Scroll it
            }   
        });
    }
});