(function (app) {
    app.factory('PubNubService', function () {
        var pubnub = PUBNUB.init({
             publish_key   : 'pub-c-49eb40c0-e98d-4bdd-9097-cb18c084b4ec',
             subscribe_key : 'sub-c-ab59b2b8-41b9-11e3-9970-02ee2ddab7fe'
        });
        return {
            publish: function (channel, message) {
                pubnub.publish({channel: channel, message: {text: message}});
            },
            subscribe: function (channel, onMessage, onConnected) {
                pubnub.subscribe({channel: channel, message: onMessage, connect: onConnected});
            }
        } 
    });
    
    app.controller('ChatController', function ($scope, PubNubService) {
        $scope.messages = [];

        $scope.$on('message', function (event, message) {
            $scope.messages.push(message)
            $scope.$apply();
        });

        $scope.publish = function (channel, message) {
            PubNubService.publish(channel, message);
        }

        $scope.subscribe = function (channel) {
            PubNubService.subscribe(channel,
                function (message) {
                    $scope.$broadcast('message', message);
                },
                function () {

                });
        };
    });
})(angular.module('chat', []));