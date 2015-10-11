//third step
'use strict';

//guestbooks service used for communicating with the guestbooks REST endpoints
angular.module('guestbooks').factory('Guestbooks', ['$resource',
	function($resource) {
		return $resource('api/guestbooks/:guestbookId', {
			guestbookId: '@_id'
		}, {
			update: {
				method: 'put'
			}
		});
	}
]);

