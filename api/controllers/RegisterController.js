var self = {
	index: function(req, res)
	{
		var games = require('../games');
		var viewModel = {"games": games};
		return res.view(viewModel, 'register');
	}

};

module.exports = self;