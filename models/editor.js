/*
 * Copyright (C) 2015  Ben Ockmore
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

'use strict';

const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));

const util = require('../util');

module.exports = (bookshelf) => {
	const Editor = bookshelf.Model.extend({
		tableName: 'bookbrainz.editor',
		idAttribute: 'id',
		initialize() {
			this.on('saving', (model) => {
				if (model.hasChanged('password')) {
					return bcrypt.genSaltAsync(10)
						.then((salt) => {
							return bcrypt.hashAsync(model.get('password'),
								salt);
						})
						.then((hash) => {
							model.set('password', hash);
						});
				}
			});
		},
		parse: util.snakeToCamel,
		format: util.camelToSnake,
		gender() {
			return this.belongsTo('Gender', 'gender_id');
		},
		type() {
			return this.belongsTo('EditorType', 'type_id');
		},
		revisions() {
			return this.hasMany('Revision', 'author_id');
		},
		achievements() {
			return this.hasMany('AchievementType').through('AchievementUnlock');
		},
		checkPassword(password) {
			return bcrypt.compareAsync(password, this.get('password'));
		},
		incrementEditCount() {
			this.set('totalRevisions', this.get('totalRevisions') + 1);
			this.set('revisionsApplied', this.get('revisionsApplied') + 1);
		}
	});

	return bookshelf.model('Editor', Editor);
};
