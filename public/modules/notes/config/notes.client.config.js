'use strict';

// Configuring the Notes module
angular.module('notes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Notes', 'notes', 'dropdown', '/notes(/create)?', 'book');
		Menus.addSubMenuItem('topbar', 'notes', 'List Notes', 'notes');
		Menus.addSubMenuItem('topbar', 'notes', 'New Note', 'notes/create');
	}
]);