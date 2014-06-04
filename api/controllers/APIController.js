var self =
{
	checkname: function(req, res)
	{
		User.find({name: req.params.name}, function(err, users)
		{
			res.send(users.length === 0 ? 'YES' : 'NO');
		});
	}
};

module.exports = self;