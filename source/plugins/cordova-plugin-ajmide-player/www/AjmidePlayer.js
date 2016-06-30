cordova.define("cordova-plugin-ajmide-player.AjmidePlayer", function(require, exports, module) {

var exec = require('cordova/exec');
var statusCallback;
var reloadCallback;
var disappearCallback;
var AjmidePlayer = function(){

};
AjmidePlayer.PLAYER_STOP = 0;
AjmidePlayer.PLAYER_RUNNING = 1;
               
AjmidePlayer.playBBS=function(phid,id,successCallback,errorCallback){
        
  exec(successCallback,  errorCallback, "AjmidePlayer", "playBBS", [phid,id]);
}
AjmidePlayer.playProgram=function(id,successCallback,errorCallback){
               
 exec(successCallback,  errorCallback, "AjmidePlayer", "playProgram", [id]);
}
AjmidePlayer.playProgramList=function(position,id,successCallback,errorCallback){

 exec(successCallback,  errorCallback, "AjmidePlayer", "playProgramList", [position,id]);
}
AjmidePlayer.playBBSList=function(position,topicJson,successCallback,errorCallback){
               
  exec(successCallback,  errorCallback, "AjmidePlayer", "playBBSList", [position,topicJson]);
}
 AjmidePlayer.playBBSForMultipleAudio=function(position,pid,topicId,successCallback,errorCallback){
               
               exec(successCallback,  errorCallback, "AjmidePlayer", "playBBSForMultipleAudio", [position,pid,topicId]);
}
               
               
               
AjmidePlayer.stop=function(successCallback,errorCallback){
              

  exec(successCallback,  errorCallback, "AjmidePlayer", "stop", []);
}
AjmidePlayer.setStatusCallback=function(callback){
               
               statusCallback=callback;
               exec(function(e){
                    
                    },  function(e){
                    
                    }, "AjmidePlayer", "onStatus",[]);

}
AjmidePlayer.setReloadCallback=function(callback){
        reloadCallback=callback;
}
 AjmidePlayer.setDisappearCallback=function(callback){
        disappearCallback=callback;
}
AjmidePlayer.onStatus=function(id,status){
               
         statusCallback(id,status);
};
AjmidePlayer.reload=function(id,status){
             
         reloadCallback();
};
               AjmidePlayer.disappear=function(id,status){
               
               disappearCallback();
               };
               
             
module.exports = AjmidePlayer;


function onMessageFromNative(msg) {


    if (msg.action == 'status') {
        AjmidePlayer.onStatus(msg.status.id, msg.status.status);
    } else if(msg.action == 'reload')
    {
          AjmidePlayer.reload();
    }
    else if(msg.action == 'disappear')
    {
            AjmidePlayer.disappear();
    }
    else
    {
        throw new Error('Unknown media action' + msg.action);
    }
}

if (cordova.platformId === 'android' || cordova.platformId === 'amazon-fireos' || cordova.platformId === 'windowsphone') {

    var channel = require('cordova/channel');

    channel.createSticky('onAjmidePlayerPluginReady');
    channel.waitForInitialization('onAjmidePlayerPluginReady');

    channel.onCordovaReady.subscribe(function() {
                                     
        exec(onMessageFromNative, undefined, 'AjmidePlayer', 'messageChannel', []);
        channel.initializationComplete('onAjmidePlayerPluginReady');
                                     
                                     exec(function(e){
                                          
                                          },  function(e){
                                          
                                          }, "AjmidePlayer", "onStatus",[]);
    });
}




});