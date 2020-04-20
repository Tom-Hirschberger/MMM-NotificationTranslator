/* global Module

/* Magic Mirror
 * Module: MMM-NotificationTranslator
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */
Module.register('MMM-NotificationTranslator', {
  defaults: {
    actions: {},
    notifications: {},
  },

  start: function () {
    this.lastState = null
    this.currentState = null
    Log.info("Starting module: " + this.name);
    this.sendSocketNotification('CONFIG', this.config)
  },

  notificationReceived: function(notification,payload,sender) {
    if(typeof this.config.actions[notification] !== "undefined"){
      console.log("Received notification of action: "+notification)
      var stateToCheck = "null"
      if(this.currentState){
        stateToCheck = this.currentState
      }

      if(typeof this.config.actions[notification][stateToCheck] !== "undefined"){
        if(typeof this.config.actions[notification][stateToCheck].notification !== "undefined"){
          this.sendNotification(this.config.actions[notification][stateToCheck].notification, payload)
        }
      } else if (typeof this.config.actions[notification]["default"] !== "undefined"){
        console.log("Does not match current state but a default is specified")
        if(typeof this.config.actions[notification]["default"].notification !== "undefined"){
          this.sendNotification(this.config.actions[notification]["default"].notification, payload)
        }
      } else {
        console.log("Does not match current state: "+stateToCheck)
      }
    }

    if(typeof this.config.notifications[notification] !== "undefined"){
      console.log("Received notifcation of state change: "+notification)
      if((typeof this.config.notifications[notification].sender === "undefined") ||
        (this.config.notifications[notification].sender === sender.name)
      ){
        if(typeof this.config.notifications[notification].newState !== "undefined"){
          if(this.currentState !== this.config.notifications[notification].newState){
            this.lastState = this.currentState
            this.currentState = this.config.notifications[notification].newState
            console.log("Changed state to: "+this.currentState)
          }
        } else if(typeof this.config.notifications[notification].lastState !== "undefined"){
          let prevLastState = this.lastState
          this.lastState = this.currentState
          this.currentState = prevLastState
          console.log("Changed state to: "+this.currentState)
        } else if (typeof this.config.notifications[notification].payload !== "undefined"){
          console.log("Checking payload information")
          for(var curKey in this.config.notifications[notification].payload){
            console.log("Checking info: "+curKey+" of payload")
            if(typeof this.config.notifications[notification].payload[curKey].values[payload[curKey]] !== "undefined"){
              if(typeof this.config.notifications[notification].payload[curKey].values[payload[curKey]].newState !== "undefined"){
                if(this.currentState !== this.config.notifications[notification].payload[curKey].values[payload[curKey]])
                {
                  this.lastState = this.currentState
                  this.currentState = this.config.notifications[notification].payload[curKey].values[payload[curKey]]
                }
              } else if ((typeof this.config.notifications[notification].payload[curKey].values[payload[curKey]].lastState !== "undefined") &&
                        (this.config.notifications[notification].payload[curKey].values[payload[curKey]].lastState)
              ){
                  let prevLastState = this.lastState
                  this.lastState = this.currentState
                  this.currentState = prevLastState    
              }
              console.log("Found match and changing to: "+this.currentState)
            } else {
              if(typeof this.config.notifications[notification].payload[curKey].default !== "undefined") {
                if("lastState" === this.config.notifications[notification].payload[curKey].default){
                  this.currentState = this.lastState
                } else if ("nullState" === this.config.notifications[notification].payload[curKey].default){
                  this.currentState = null
                }
                console.log("Using default and changed to: "+this.currentState)
              }
            }
          }
        }
      } {
        console.log("The sender: "+sender.name+" does not match the specified sender")
      }
    }
  }
})
