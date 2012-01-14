'use strict';var BREAKOUT=BREAKOUT||{};BREAKOUT.namespace=function(a){var a=a.split("."),h=BREAKOUT,c;"BREAKOUT"===a[0]&&(a=a.slice(1));for(c=0;c<a.length;c+=1)"undefined"===typeof h[a[c]]&&(h[a[c]]={}),h=h[a[c]];return h};BREAKOUT.inherit=function(a){function h(){}if(null==a)throw TypeError();if(Object.create)return Object.create(a);var c=typeof a;if("object"!==c&&"function"!==c)throw TypeError();h.prototype=a;return new h};
if(!Function.prototype.bind)Function.prototype.bind=function(a){if("function"!==typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var h=Array.prototype.slice.call(arguments,1),c=this,j=function(){},f=function(){return c.apply(this instanceof j?this:a||window,h.concat(Array.prototype.slice.call(arguments)))};j.prototype=this.prototype;f.prototype=new j;return f};BREAKOUT.namespace("BREAKOUT.Event");BREAKOUT.Event=function(){var a;a=function(a){this.type=a;this.target=null;this.name="Event"};a.CONNECTED="connected";a.CHANGE="change";a.COMPLETE="complete";return a}();BREAKOUT.namespace("BREAKOUT.EventDispatcher");
BREAKOUT.EventDispatcher=function(){var a;a=function(a){this._target=a||null;this._eventListeners={};this.name="EventDispatcher"};a.prototype={addEventListener:function(a,c){this._eventListeners[a]||(this._eventListeners[a]=[]);this._eventListeners[a].push(c)},removeEventListener:function(a,c){for(var j=0,f=this._eventListeners[a].length;j<f;j++)this._eventListeners[a][j]==c&&this._eventListeners[a].splice(j,1)},hasEventListener:function(a){return this._eventListeners[a]?!0:!1},dispatchEvent:function(a,
c){a.target=this._target;var j=!1,f;for(f in c)a[f.toString()]=c[f];if(this.hasEventListener(a.type)){f=0;for(var i=this._eventListeners[a.type].length;f<i;f++)try{this._eventListeners[a.type][f].call(this,a),j=!0}catch(E){}}return j}};return a}();BREAKOUT.namespace("BREAKOUT.IOBoardEvent");
BREAKOUT.IOBoardEvent=function(){var a,h=BREAKOUT.Event;a=function(a){this.name="IOBoardEvent";h.call(this,a)};a.ANALOG_DATA="analodData";a.DIGITAL_DATA="digitalData";a.FIRMWARE_VERSION="firmwareVersion";a.FIRMWARE_NAME="firmwareName";a.STRING_MESSAGE="stringMessage";a.SYSEX_MESSAGE="sysexMessage";a.CAPABILITY_RESPONSE="capabilityResponse";a.PIN_STATE_RESPONSE="pinStateResponse";a.ANALOG_MAPPING_RESPONSE="analogMappingResponse";a.READY="arduinoReady";a.prototype=BREAKOUT.inherit(h.prototype);return a.prototype.constructor=
a}();BREAKOUT.namespace("BREAKOUT.WSocketEvent");BREAKOUT.WSocketEvent=function(){var a,h=BREAKOUT.Event;a=function(a){this.name="WSocketEvent";h.call(this,a)};a.CONNECTED="webSocketConnected";a.MESSAGE="webSocketMessage";a.CLOSE="webSocketClosed";a.prototype=BREAKOUT.inherit(h.prototype);return a.prototype.constructor=a}();BREAKOUT.namespace("BREAKOUT.WSocketWrapper");
BREAKOUT.WSocketWrapper=function(){var a,h=BREAKOUT.EventDispatcher,c=BREAKOUT.WSocketEvent;a=function(a,f,i,c){this.name="WSocketWrapper";h.call(this,this);this._host=a;this._port=f;this._protocol=c||"default-protocol";this._useSocketIO=i||!1;this._socket=null;this._readyState="";this.init(this)};a.prototype=BREAKOUT.inherit(h.prototype);a.prototype.constructor=a;a.prototype.init=function(a){if(a._useSocketIO){a._socket=io.connect("http://"+a._host+":"+a._port);try{a._socket.on("connect",function(){a.dispatchEvent(new c(c.CONNECTED));
a._socket.on("message",function(f){a.dispatchEvent(new c(c.MESSAGE),{message:f})})})}catch(f){console.log("Error "+f)}}else try{if("MozWebSocket"in window)a._socket=new MozWebSocket("ws://"+a._host+":"+a._port,a._protocol);else if("WebSocket"in window)a._socket=new WebSocket("ws://"+a._host+":"+a._port);else throw console.log("Websockets not supported by this browser"),"Websockets not supported by this browser";console.log("Starting up...");a._socket.onopen=function(){a.dispatchEvent(new c(c.CONNECTED));
a._socket.onmessage=function(f){a.dispatchEvent(new c(c.MESSAGE),{message:f.data})};a._socket.onclose=function(){a._readyState=a._socket.readyState;a.dispatchEvent(new c(c.CLOSE))}}}catch(i){console.log("Error "+i)}};a.prototype.send=function(a){this._socket.send(a)};a.prototype.__defineGetter__("readyState",function(){return this._readyState});return a}();BREAKOUT.namespace("BREAKOUT.Pin");
BREAKOUT.Pin=function(){var a,h=BREAKOUT.EventDispatcher,c=BREAKOUT.Event,j=BREAKOUT.generators.GeneratorEvent;a=function(a,c){this.name="Pin";this._type=c;this._number=a;this._analogNumber=void 0;this._maxPWMValue=255;this._lastValue=this._value=-1;this._average=0;this._minimum=Math.pow(2,16);this._numSamples=this._sum=this._maximum=0;this._generator=this._filters=null;this._evtDispatcher=new h(this)};a.prototype={setAnalogNumber:function(a){this._analogNumber=a},get analogNumber(){return this._analogNumber},
get number(){return this._number},setMaxPWMValue:function(){this._maxPWMValue=value},get maxPWMValue(){return this._maxPWMValue},get average(){return this._average},get minimum(){return this._minimum},get maximum(){return this._maximum},get value(){return this._value},set value(a){this.calculateMinMaxAndMean(a);this._lastValue=this._value;this._preFilterValue=a;this._value=this.applyFilters(a);this.detectChange(this._lastValue,this._value)},get lastValue(){return this._lastValue},get preFilterValue(){return this._preFilterValue},
get filters(){return this._filters},set filters(a){this._filters=a},get generator(){return this._generator},getType:function(){return this._type},setType:function(f){if(0<=f&&f<a.TOTAL_PIN_MODES)this._type=f},getCapabilities:function(){return this._capabilities},setCapabilities:function(a){this._capabilities=a},detectChange:function(a,i){a!==i&&this.dispatchEvent(new c(c.CHANGE))},clearWeight:function(){this._sum=this._average;this._numSamples=1},calculateMinMaxAndMean:function(a){var c=Number.MAX_VALUE;
this._minimum=Math.min(a,this._minimum);this._maximum=Math.max(a,this._maximum);this._sum+=a;this._average=this._sum/++this._numSamples;this._numSamples>=c&&this.clearWeight()},clear:function(){this._minimum=this._maximum=this._average=this._lastValue=this._preFilterValue;this.clearWeight()},addFilter:function(a){if(null!==a){if(null===this._filters)this._filters=[];this._filters.push(a)}},addGenerator:function(a){this.removeGenerator();this._generator=a;this._generator.addEventListener(j.UPDATE,
this.autoSetValue.bind(this))},removeGenerator:function(){null!==this._generator&&this._generator.removeEventListener(j.UPDATE,this.autoSetValue);this._generator=null},setFilters:function(a){this.filters=a},removeAllFilters:function(){this._filters=null},autoSetValue:function(){this.value=this._generator.value},applyFilters:function(a){if(null===this._filters)return a;for(var c=this._filters.length,h=0;h<c;h++)a=this._filters[h].processSample(a);return a},addEventListener:function(a,c){this._evtDispatcher.addEventListener(a,
c)},removeEventListener:function(a,c){this._evtDispatcher.removeEventListener(a,c)},hasEventListener:function(a){return this._evtDispatcher.hasEventListener(a)},dispatchEvent:function(a,c){return this._evtDispatcher.dispatchEvent(a,c)}};a.HIGH=1;a.LOW=0;a.ON=1;a.OFF=0;a.DIN=0;a.DOUT=1;a.AIN=2;a.AOUT=3;a.PWM=3;a.SERVO=4;a.SHIFT=5;a.I2C=6;a.TOTAL_PIN_MODES=7;return a}();BREAKOUT.namespace("BREAKOUT.IOBoard");
BREAKOUT.IOBoard=function(){var a=224,h=240,c=247,j=111,f=107,i=BREAKOUT.Pin,E=BREAKOUT.EventDispatcher,s=BREAKOUT.Event,A=BREAKOUT.WSocketEvent,O=BREAKOUT.WSocketWrapper,m=BREAKOUT.IOBoardEvent;return function(P,x,F,Q){function G(a){e.removeEventListener(m.FIRMWARE_VERSION,G);if(23<=10*a.version)e.send([h,f,c]);else throw Error("You must upload StandardFirmata version 2.3 or greater from Arduino version 1.0 or higher");}function R(){e.debug("debug: startup");e.dispatchEvent(new m(m.READY));e.enableDigitalPins()}
function H(a){a=a.substring(0,1);return a.charCodeAt(0)}function I(a){var b=a.target.getType(),c=a.target.number,a=a.target.value;switch(b){case i.DOUT:J(c,a);break;case i.AOUT:K(c,a);break;case i.SERVO:b=e.getDigitalPin(c),b.getType()==i.SERVO&&b.lastValue!=a&&K(c,a)}}function y(a){if(a.getType()==i.DOUT||a.getType()==i.AOUT||a.getType()==i.SERVO)a.hasEventListener(s.CHANGE)||a.addEventListener(s.CHANGE,I);else if(a.hasEventListener(s.CHANGE))try{a.removeEventListener(s.CHANGE,I)}catch(b){e.debug("debug: caught pin removeEventListener exception")}}
function K(g,b){var l=e.getDigitalPin(g).maxPWMValue,b=b*l,b=0>b?0:b,b=b>l?l:b;if(15<g||b>Math.pow(2,14)){var l=b,d=[];if(l>Math.pow(2,16))throw console.log("Extended Analog values > 16 bits are not currently supported by StandardFirmata"),"Extended Analog values > 16 bits are not currently supported by StandardFirmata";d[0]=h;d[1]=j;d[2]=g;d[3]=l&127;d[4]=l>>7&127;l>=Math.pow(2,14)&&(d[5]=l>>14&127);d.push(c);e.send(d)}else e.send([a|g&15,b&127,b>>7&127])}function J(a,b){var c=Math.floor(a/8);if(b==
i.HIGH)t[c]|=b<<a%8;else if(b==i.LOW)t[c]&=~(1<<a%8);else{console.log("Warning: Invalid value passed to sendDigital, value must be 0 or 1.");return}e.sendDigitalPort(c,t[c])}this.name="IOBoard";var e=this,n,B=0,C=0,r=[],o=[],p=0,t=[],u,D=[],L=[],M=[],q=[],v=0,N=19,w=0,z=new E(this);!F&&"number"===typeof x&&(x+="/websocket");n=new O(P,x,F,Q);n.addEventListener(A.CONNECTED,function(){console.log("Socket Status: (open)");e.dispatchEvent(new s(s.CONNECTED));e.addEventListener(m.FIRMWARE_VERSION,G);e.reportVersion()});
n.addEventListener(A.MESSAGE,function(g){var g=g.message,g=1*g,b;if(0<p&&128>g){if(p--,r[p]=g,0==p)switch(B){case 144:var l=8*C;b=l+8;var g=r[1]|r[0]<<7,d={};b>=v&&(b=v);for(var k=0,f=l;f<b;f++){d=e.getDigitalPin(f);if(void 0==d)break;if(d.getType()==i.DIN&&(l=g>>k&1,l!=d.value))d.value=l,e.dispatchEvent(new m(m.DIGITAL_DATA),{pin:d});k++}break;case 249:w=r[1]+r[0]/10;e.dispatchEvent(new m(m.FIRMWARE_VERSION),{version:w});break;case a:b=e.getAnalogPin(C);if(void 0==b)break;b.value=e.getValueFromTwo7bitBytes(r[1],
r[0])/1023;b.value!=b.lastValue&&e.dispatchEvent(new m(m.ANALOG_DATA),{pin:b})}}else if(0>p)if(g==c){p=0;switch(o[0]){case 121:b=o;g="";for(k=3;k<b.length;k+=2)d=String.fromCharCode(b[k]),d+=String.fromCharCode(b[k+1]),g+=d;w=b[1]+b[2]/10;e.dispatchEvent(new m(m.FIRMWARE_NAME),{name:g,version:w});break;case 113:b=o;g="";for(k=1;k<b.length;k+=2)d=String.fromCharCode(b[k]),d+=String.fromCharCode(b[k+1]),g+=d.charAt(0);e.dispatchEvent(new m(m.STRING_MESSAGE),{message:g});break;case 108:for(var g=o,d=
{},k=1,l=b=0,f=g.length,j;k<=f;)if(127==g[k]){L[b]=b;j=void 0;if(d[i.DOUT])j=i.DOUT;if(d[i.AIN])j=i.AIN,D[l++]=b;j=new i(b,j);j.setCapabilities(d);y(j);q[b]=j;j.getCapabilities()[i.I2C]&&M.push(j.number);d={};b++;k++}else d[g[k]]=g[k+1],k+=2;u=Math.ceil(b/8);e.debug("debug: num ports = "+u);for(g=0;g<u;g++)t[g]=0;v=b;e.debug("debug: num pins = "+v);e.send([h,105,c]);break;case 110:g=o;d=g.length;k=g[1];l=g[2];f=q[k];4<d?b=e.getValueFromTwo7bitBytes(g[3],g[4]):3<d&&(b=g[3]);f.getType()!=l&&(f.setType(l),
y(f));if(f.value!=b)f.value=b;e.dispatchEvent(new m(m.PIN_STATE_RESPONSE),{pin:k,type:l,value:b});break;case 106:b=o;g=b.length;for(d=1;d<g;d++)127!=b[d]&&(D[b[d]]=d-1,e.getPin(d-1).setAnalogNumber(b[d]));e.debug("debug: system reset");e.send(255);setTimeout(R,500);e.debug("debug: configured");break;default:e.dispatchEvent(new m(m.SYSEX_MESSAGE),{message:o})}o=[]}else o.push(g);else switch(240>g?(b=g&240,C=g&15):b=g,b){case 249:case 144:case a:p=2;B=b;break;case h:p=-1,B=b}});n.addEventListener(A.CLOSE,
function(){console.log("Socket Status: "+n.readyState+" (Closed)")});this.__defineGetter__("samplingInterval",function(){return N});this.__defineSetter__("samplingInterval",function(a){10<=a&&100>=a?(N=a,e.send([h,122,a&127,a>>7&127,c])):console.log("Warning: Sampling interval must be between 10 and 100")});this.getValueFromTwo7bitBytes=function(a,b){return b<<7|a};this.getSocket=function(){return n};this.reportVersion=function(){e.send(249)};this.reportFirmware=function(){e.send([h,121,c])};this.disableDigitalPins=
function(){for(var a=0;a<u;a++)e.sendDigitalPortReporting(a,i.OFF)};this.enableDigitalPins=function(){for(var a=0;a<u;a++)e.sendDigitalPortReporting(a,i.ON)};this.sendDigitalPortReporting=function(a,b){e.send([208|a,b])};this.enableAnalogPin=function(a){e.send([192|a,i.ON]);e.getAnalogPin(a).setType(i.AIN)};this.disableAnalogPin=function(a){e.send([192|a,i.OFF]);e.getAnalogPin(a).setType(i.AIN)};this.setDigitalPinMode=function(a,b){e.getDigitalPin(a).setType(b);y(e.getDigitalPin(a));e.send([244,a,
b])};this.enablePullUp=function(a){J(a,i.HIGH)};this.getFirmwareVersion=function(){return w};this.sendDigitalPort=function(a,b){e.send([144|a&15,b&127,b>>7])};this.sendString=function(a){for(var b=[],c=0,d=a.length;c<d;c++)b.push(H(a[c])&127),b.push(H(a[c])>>7&127);this.sendSysex(113,b)};this.sendSysex=function(a,b){var f=[];f[0]=h;f[1]=a;for(var d=0,i=b.length;d<i;d++)f.push(b[d]);f.push(c);e.send(f)};this.sendServoAttach=function(a,b,f){var b=b||544,f=f||2400,d=[];d[0]=h;d[1]=112;d[2]=a;d[3]=b%
128;d[4]=b>>7;d[5]=f%128;d[6]=f>>7;d[7]=c;e.send(d);a=e.getDigitalPin(a);a.setType(i.SERVO);y(a)};this.queryPinState=function(a){e.send([h,109,a.number,c])};this.getPin=function(a){return q[a]};this.getAnalogPin=function(a){return q[D[a]]};this.getDigitalPin=function(a){return q[L[a]]};this.analogToDigital=function(a){return e.getAnalogPin(a).number};this.getPinCount=function(){return v};this.getI2cPins=function(){return M};this.reportCapabilities=function(){for(var a={"0":"input",1:"output",2:"analog",
3:"pwm",4:"servo",5:"shift",6:"i2c"},b=0,c=q.length;b<c;b++)for(var d in q[b].getCapabilities())console.log("pin "+b+"\tmode: "+a[d]+"\tresolution (# of bits): "+q[b].getCapabilities()[d])};this.send=function(a){n.send(a)};this.close=function(){console.log("socket = "+n);n.close()};this.debug=function(a){console.log(a)};this.addEventListener=function(a,b){z.addEventListener(a,b)};this.removeEventListener=function(a,b){z.removeEventListener(a,b)};this.hasEventListener=function(a){return z.hasEventListener(a)};
this.dispatchEvent=function(a,b){return z.dispatchEvent(a,b)}}}();
