'use strict';
Ajmd
.config(function (
	$provide,
	$httpProvider
) {
    $provide.factory('httpInterceptor', function (
		$q
	) {

        var httpInterceptor = {

            request: function (config) {
                return config || $q.when(config);
            },

            requestError: function (rejection) {
                return $q.reject(rejection);
            },

            response: function (response) {

                // if (response.data && response.data.ResponseStatus) {

                //     if (response.data.ResponseStatus.Ack !== 'Success') {

                //         return $q.reject(response);
                //     }
                // }

                return response || $q.when(response);
            },

            responseError: function (rejection) {
                return $q.reject(rejection);
            }
        };

        return httpInterceptor;
    });

    $httpProvider.interceptors.push('httpInterceptor');
});
