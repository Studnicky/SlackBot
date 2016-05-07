module.exports = function() {
	var db = require('./db.js');
	var mongoose = require('mongoose');

	var msgSchema = mongoose.Schema({
			type: String,
			channel: String,
			user: String,
			text: String,
			ts: Number,
			team: String,
			event: String,
			created_at: {
				type: Date,
				default: Date.now
			},
			updated_at: {
				type: Date,
				default: Date.now
			}
		}),

		_model = mongoose.model('msgs', msgSchema);

	// ADD ONE
	var _save = function(msg, success, fail) {

			var msg = new _model(msg);

			msg.save(function(err, doc) {
				if (err) {
					fail(err);
				} else {
					success(doc);
				}
			});
		},

		// UPDATE ONE
		_update = function(msg, success, fail) {

			_model.update({
				'_id': cleanData._id
			}, {
				$set: cleanData
			}, function(err) {
				if (err) {
					fail(err);
				} else {
					success(cleanData);
				}
			});

		},

		// REMOVE ONE
		_remove = function(msg, success, fail) {

			_model.findByIdAndRemove(cleanData, function(err, doc) {
				if (err) {
					fail(err);
				} else {
					success(doc);
				}
			});
		},

		// FIND One
		_findOne = function(msg, success, fail) {
			_model.findOne({
				_id: cleanData._id
			}, function(err, doc) {
				if (err) {
					fail(err);
				} else {
					success(doc);
				}
			});
		},

		// FIND Channel
		_findChannel = function(payload, success, fail) {
			_model.find({
				channel: payload.channel
			}, function(err, doc) {
				if (err) {
					fail(err);
				} else {
					success(doc);
				}
			}).sort({
				'created_at': -1
			}).limit(payload.limit);
		};
	// FIND
	_findAll = function(success, fail) {
		_model.find({}, function(err, doc) {
			if (err) {
				fail(err);
			} else {
				success(doc);
			}
		});
	};

	// 'Publicly' Available
	// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	return {
		schema: msgSchema,
		model: _model,
		add: _save,
		update: _update,
		remove: _remove,
		find: _findOne,
		all: _findAll,
		recall: _findChannel
	};
}();
