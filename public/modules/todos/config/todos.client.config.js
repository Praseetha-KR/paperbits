'use strict';

// Configuring the Todos module
angular.module('todos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Todos', 'todos', 'dropdown', '/todos(/create)?', 'check-square-o');
		Menus.addSubMenuItem('topbar', 'todos', 'List Todos', 'todos');
		Menus.addSubMenuItem('topbar', 'todos', 'New Todo', 'todos/create');
	}
]);