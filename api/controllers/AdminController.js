/**
 * AdminController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var async = require('async');

module.exports = {
  
	index: function(req, res)
	{
		var games = require('../games');
		var viewModel = {games: games};
		res.view(viewModel, 'admin');
	},

	game: function(req, res)
	{
		var games = require('../games');
		var gameId = parseInt(req.params.gameId, 10);
		var game = games[gameId];
		
		game.gameId = gameId;
		var viewModel = {game: game};
		
		res.view(viewModel, 'editgame');
	},

	createOutcome: function(req, res)
	{
		var gameId = parseInt(req.body.gameId, 10);
		var outcome = req.body.outcome;

		Outcome.create({gameId: gameId, outcome: outcome}, function(err)
		{
			if(!err)
			{
				res.redirect("/xxyba/admin");
			}
			else
			{
				res.send(400, err);
			}
		});
	}
};
