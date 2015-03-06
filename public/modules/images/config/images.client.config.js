'use strict';

// Configuring the Images module
angular.module('images').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Images', 'images', 'dropdown', '/images(/create)?', 'image');
		Menus.addSubMenuItem('topbar', 'images', 'List Images', 'images');
		Menus.addSubMenuItem('topbar', 'images', 'New Image', 'images/create');
	}
]);