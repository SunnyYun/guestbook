'use strict';

angular.module('guestbooks').run(['Menus',
	function(Menus) {
		Menus.addMenuItem('topbar', {
			title: '留言板',
			state: 'guestbooks.list',
			//type: 'dropdown'
		});

		//Menus.addSubMenuItem('topbar', 'guestbooks', {
		//	title: '查看留言',
		//	state: 'guestbooks.list'
		//});
        //
		//Menus.addSubMenuItem('topbar', 'guestbooks', {
		//	title: '发布留言',
		//	state: 'guestbooks.create'
		//});
	}
]);
