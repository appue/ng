cordova.define("cordova-plugin-ajmide-header.AjmideHeader", function(require, exports, module) {

var exec = require('cordova/exec');
var setting;
var AjmideHeader = function(){

};
AjmideHeader.setSetting=function(setting)
{
              
      this.setting=setting;
      exec(function(e){},  function(e){}, "AjmideHeader", "setSetting", [JSON.stringify(AjmideHeader.setting)]);
               
              
}
 
AjmideHeader.hideHeader=function(){
               
   exec(function(e){},  function(e){}, "AjmideHeader", "hideHeader", []);
        
}
AjmideHeader.showHeader=function(){
    
    exec(function(e){},  function(e){}, "AjmideHeader", "showHeader", []);
}
AjmideHeader.onSelect=function(tag,position,item){
           
            if(tag=="left")
            {
             this.setting.left[position].event() ;
            }else{
             if(item==-1)
               {
               this.setting.right[position].event() ;
               }else{
               this.setting.right[position].list[item].event() ;
               }
               
           }
            
              
}
module.exports = AjmideHeader;


function onMessageFromNative(msg) {
              
    if (msg.action == 'onSelect') {
               
       AjmideHeader.onSelect(msg.onSelect.tag, msg.onSelect.position,msg.onSelect.item);
    }
    else
    {
        throw new Error('Unknown media action' + msg.action);
    }
}

if (cordova.platformId === 'android' || cordova.platformId === 'amazon-fireos' || cordova.platformId === 'windowsphone') {

    var channel = require('cordova/channel');

    channel.createSticky('onAjmideHeaderPluginReady');
    channel.waitForInitialization('onAjmideHeaderPluginReady');

    channel.onCordovaReady.subscribe(function() {
        exec(onMessageFromNative, undefined, 'AjmideHeader', 'messageChannel', []);
        channel.initializationComplete('onAjmideHeaderPluginReady');
    });
}




});