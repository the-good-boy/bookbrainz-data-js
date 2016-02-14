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

const util = require('../../util');

module.exports = (bookshelf) => {
	const Creator = bookshelf.Model.extend({
		tableName: 'bookbrainz.creator',
		idAttribute: 'bbid',
		parse: util.snakeToCamel,
		format: util.camelToSnake,
		initialize() {
			this.on('fetching', (model, col, options) => {
				// If no revision is specified, fetch the master revision
				if (!model.get('revisionId')) {
					options.query.where({master: true});
				}
			});
		},
		annotation() {
			return this.belongsTo('Annotation', 'annotation_id');
		},
		disambiguation() {
			return this.belongsTo('Disambiguation', 'disambiguation_id');
		},
		defaultAlias() {
			return this.belongsTo('Alias', 'default_alias_id');
		},
		relationshipSet() {
			return this.belongsTo('RelationshipSet', 'relationship_set_id');
		},
		aliasSet() {
			return this.belongsTo('AliasSet', 'alias_set_id');
		},
		identifierSet() {
			return this.belongsTo('IdentifierSet', 'identifier_set_id');
		},
		revision() {
			return this.belongsTo('CreatorRevision', 'revision_id');
		}
	});

	return bookshelf.model('Creator', Creator);
};
