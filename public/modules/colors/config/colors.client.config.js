'use strict';

// Configuring the Colors module
angular.module('colors').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Colors', 'colors', 'dropdown', '/colors(/create)?', 'paint-brush');
		Menus.addSubMenuItem('topbar', 'colors', 'List Colors', 'colors');
		Menus.addSubMenuItem('topbar', 'colors', 'New Color', 'colors/create');
	}
]);