var settings;
var ws;
$(document).ready(function(){
});
    
angular.module("mainApp",[])
    .factory("initServices", function($http,$q) {
        
        return {
            init: function () {
                var res = {};
                var defered = $q.defer();
                $http.get("configs/default.json").then(function(result) {
                    res.sets = result.data;
                    var def2 = $q.defer();
                    var w = new WebSocket(res.sets.WS_ADDRESS + res.sets.WS_PORT,res.sets.WS_PROTOCOL);
                    res.w = w;
                    res.w.onopen=function(evt) {
                        def2.resolve(res);
                        res.w.send(JSON.stringify({ action : "connect"}, "data : [{type: 'terminal'}]"));
                    };
                    return def2.promise;
                }).then(function(result) {
                    defered.resolve(res);       
                });
                return defered.promise;
            }
        };
        
   })
   .controller('ctrl', function ($rootScope,$scope,$http,$q,initServices) {
       initServices.init().then(function(result) {
           $scope.settings = result.sets;
           $scope.ws = result.w;   
           $scope.ws.onclose = function(evt) {
               $scope.$digest();
                    l("Ws closed. ReadyState: "+$scope.ws.readyState);
                };
            $scope.ws.onerror = function(evt) {
               $scope.$digest();
                    l("Ws error. ReadyState: "+$scope.ws.readyState);
                };
            
       });
   });
        
    //UTIL
function l(message) {
    console.log("log[" + message + "]");          
}
//log user in div with id= log
function lu(message) {
    $("#log").append(message + "<br>");          
}
function lall(message) {
    l(message);
    lu(message);          
}