'use strict';

// Setting up route
angular.module('notes').config(['$stateProvider',
	function($stateProvider) {
		// Notes state routing
		$stateProvider.
		state('listNotes', {
			url: '/notes',
			templateUrl: 'modules/notes/views/list-notes.client.view.html'
		}).
		state('createNote', {
			url: '/notes/create',
			templateUrl: 'modules/notes/views/create-note.client.view.html'
		}).
		state('viewNote', {
			url: '/notes/:noteId',
			templateUrl: 'modules/notes/views/view-note.client.view.html'
		}).
		state('editNote', {
			url: '/notes/:noteId/edit',
			templateUrl: 'modules/notes/views/edit-note.client.view.html'
		});
	}
]);