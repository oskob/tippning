/**
 * ScoresController
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

		Outcome.find(function(err, outcomes)
		{

			for(var outcomeKey in outcomes)
			{
				var outcome = outcomes[outcomeKey];
				games[outcome.gameId][3] = outcome.outcome;
			}

			User.find(function(err, users)
			{
				var scores = [];
				
				async.each(users, function(user, callback)
				{
					user.score = 0;
					user.predictions = [];
					UserPredictedGame.find({userId: user.id}, function(err, predictions)
					{
						for(var key in predictions)
						{
							var prediction = predictions[key];
							user.predictions.push(prediction);
							
							var game = games[prediction.gameId];
							if(game[3] && prediction.outcome == game[3])
							{
								user.score++;
							}
						}
						
						callback();
					});

				}, function(err)
				{
					var orderedUsers = [];

					for(var i = 0; i < users.length; i++)
					{
						var inserted = false;
						for(var orderedUserIndex = 0; orderedUserIndex < orderedUsers.length; orderedUserIndex++)
						{
							if(users[i].score > orderedUsers[orderedUserIndex].score)
							{
								orderedUsers.splice(orderedUserIndex, 0, users[i]);
								inserted = true;
								break;
							}
						}

						if(!inserted)
						{
							orderedUsers.push(users[i]);
						}
					}

					var viewModel = {games: games, users: orderedUsers};
					res.view(viewModel, 'scores');
				});
			});
		});

	
	}
};
