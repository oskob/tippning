var self = {
	index: function(req, res)
	{
		var games = require('../games');
		var viewModel = {"games": games};
		return res.view(viewModel, 'register');
	},

	submit: function(req, res)
	{
		var name = req.body.name;
		User.find({name: name}, function(err, users)
		{
			if(users.length === 0)
			{
				var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
				User.create({name: name, ip: ip}, function(err, user)
				{
					if(err)
					{
						res.send("ERROR creating User: " + err);
					}
					else
					{
						var callbackCount = 0;
						var error = false;

						var completionHandler = function()
						{
							res.redirect("/register/thanks");
						};

						var createUserPredictedGameCompletionHandler = function(err)
						{
							callbackCount++;
							if(err)
							{
								error = true;
								res.send("ERROR creating prediction: " + err);
							}
							if(callbackCount >= Object.keys(predictions).length)
							{
								completionHandler();
							}
						};

						var predictions = {};

						for(var key in req.body)
						{
							if(key.substr(0, 8) == 'outcome-')
							{
								var gameId = parseInt(key.substr(8), 10);
								var outcome = req.body[key];
								predictions[gameId] = outcome;
							}
						}

						for(var gameId in predictions)
						{
							var outcome = predictions[gameId];
							UserPredictedGame.create({userId: user.id, gameId: gameId, outcome: outcome}, createUserPredictedGameCompletionHandler);
						}
					}
				});
			}
			else
			{
				res.send("ERROR: Name taken. HOW CAN IT BE?!");
			}
		});


		

		//return res.redirect('/register/thanks');
	},

	thanks: function (req, res) {
		return res.view('thanks');
	}

};

module.exports = self;