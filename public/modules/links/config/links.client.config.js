'use strict';

// Configuring the Links module
angular.module('links').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Links', 'links', 'dropdown', '/links(/create)?', 'link');
		Menus.addSubMenuItem('topbar', 'links', 'List Links', 'links');
		Menus.addSubMenuItem('topbar', 'links', 'New Link', 'links/create');
	}
]);