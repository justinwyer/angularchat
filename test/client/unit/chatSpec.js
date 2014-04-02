(function () {
    describe('Chat', function () {

        beforeEach(module('chat'));
        describe('PubNubService', function () {
            var service, pubnub;

            beforeEach(function () {
                PUBNUB = jasmine.createSpyObj('PUBNUB', ['init']);
                pubnub = jasmine.createSpyObj('pubnub', ['publish', 'subscribe']);
                PUBNUB.init.and.returnValue(pubnub);
            });
            beforeEach(inject(function (PubNubService) {
                service = PubNubService;
            }));   
            it('should init PubNub', function () {
                expect(PUBNUB.init).toHaveBeenCalled();
            });
            it('should publish a message', function () {
                service.publish('test', 'Hello World');
                expect(pubnub.publish).toHaveBeenCalledWith({channel: 'test', message: {text: 'Hello World'}});
            });
            it('should subscribe to a channel', function () {
                var onMessage = function (message) {};
                var onConnected = function (connected) {};
                service.subscribe('test', onMessage, onConnected);
                expect(pubnub.subscribe).toHaveBeenCalledWith({channel: 'test', message: onMessage, connect: onConnected});
            })
        });
        
        describe('Controller', function () {
            var rootScope, scope, service;
            beforeEach(inject(function($rootScope, $controller) {
                rootScope = $rootScope;
                scope = $rootScope.$new();
                service = jasmine.createSpyObj('service', ['publish', 'subscribe']);
                $controller('ChatController', {
                    $scope: scope,
                    PubNubService: service
                });
            }));
            
            it('should publish a message', function () {
                scope.publish('test_channel', 'Hello World!');
                expect(service.publish).toHaveBeenCalledWith('test_channel', 'Hello World!');
            });

            it('should subscribe to a channel', function () {
                var onMessage = function (message) {};
                var onConnected = function (connected) {};
                scope.subscribe('test_channel', onMessage, onConnected);
                expect(service.subscribe).toHaveBeenCalled();
            });

            it('should emit an event when a message is received', function () {
                var onMessage;
                service.subscribe = function (channel, _onMessage) {
                    onMessage = _onMessage;
                };
                spyOn(rootScope, '$broadcast');
                scope.subscribe('test_channel');
                onMessage('Hello');
                expect(scope.$broadcast).toHaveBeenCalledWith('message', 'Hello');
            });

            it('should listen for new messages', function () {
                rootScope.$broadcast('message', 'Hello');
                expect(scope.messages).toEqual(['Hello']);
            });
        })
    });
})();