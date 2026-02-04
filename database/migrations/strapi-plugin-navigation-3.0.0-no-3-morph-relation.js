const SOURCE_TABLE_NAME = 'navigations';
const SOURCE_TABLE_NAME_NAVIGATION_ITEMS = 'navigations_items';
const TARGET_TABLE_NAME = 'navigations_items_related_mph';
const JOIN_TABLE_V5 = 'navigations_items_master_lnk';
const JOIN_TABLE_V4 = 'navigations_items_master_links';

const RELATED_ITEM_SEPARATOR = '$';

module.exports = {
  async up(knex) {
    const run = async () => {
      let hasMorphTable = false;

      await knex.schema.hasTable(TARGET_TABLE_NAME).then((exists) => {
        hasMorphTable = exists;
      });

      if (hasMorphTable) {
        console.log('Navigation morph table already exists, skipping migration');
        return;
      }

      // Check which join table exists (v4 or v5)
      const hasV5JoinTable = await knex.schema.hasTable(JOIN_TABLE_V5);
      const hasV4JoinTable = await knex.schema.hasTable(JOIN_TABLE_V4);
      const JOIN_TABLE = hasV5JoinTable ? JOIN_TABLE_V5 : JOIN_TABLE_V4;

      if (!hasV5JoinTable && !hasV4JoinTable) {
        console.log('No join table found, skipping navigation migration');
        return;
      }

      console.log(`Using join table: ${JOIN_TABLE}`);

      // Check if the 'related' column still exists
      const hasRelatedColumn = await knex.schema.hasColumn(SOURCE_TABLE_NAME_NAVIGATION_ITEMS, 'related');

      if (!hasRelatedColumn) {
        console.log('Related column does not exist - migration already ran or data already migrated by plugin');
        return;
      }

      await knex.schema.createTable(TARGET_TABLE_NAME, (table) => {
        table.increments('id');
        table.integer('navigation_item_id');
        table.integer('related_id');
        table.string('related_type');
        table.string('field');
        table.float('order');
      });

      // Check if locale or locale_code column exists (v4 vs v5)
      const hasLocaleCode = await knex.schema.hasColumn(SOURCE_TABLE_NAME, 'locale_code');
      const localeColumn = hasLocaleCode ? 'locale_code' : 'locale';

      const navigations = await knex.from(SOURCE_TABLE_NAME).columns('id', localeColumn).select();

      for (const navigation of navigations) {
        const locale = navigation[localeColumn];
        const items = await knex(SOURCE_TABLE_NAME_NAVIGATION_ITEMS)
          .join(
            JOIN_TABLE,
            `${JOIN_TABLE}.navigation_item_id`,
            '=',
            `${SOURCE_TABLE_NAME_NAVIGATION_ITEMS}.id`
          )
          .where(`${JOIN_TABLE}.navigation_id`, navigation.id)
          .select(
            `${SOURCE_TABLE_NAME_NAVIGATION_ITEMS}.id`,
            `${SOURCE_TABLE_NAME_NAVIGATION_ITEMS}.related`
          );

        for (const item of items) {
          if (!item.related) {
            continue;
          }

          const [uid, idOrDocumentId] = item.related.split(RELATED_ITEM_SEPARATOR);

          if (!uid || !idOrDocumentId) {
            continue;
          }

          // In v4, the related field contains numeric IDs, not documentIds
          // So we can just use the ID directly for the morph table
          const relatedId = parseInt(idOrDocumentId, 10);

          if (isNaN(relatedId)) {
            console.log(`Skipping invalid related ID: ${idOrDocumentId}`);
            continue;
          }

          await knex(TARGET_TABLE_NAME).insert({
            navigation_item_id: item.id,
            related_id: relatedId,
            related_type: uid,
            order: 1,
          });
        }
      }

      knex.schema.alterTable(SOURCE_TABLE_NAME_NAVIGATION_ITEMS, function (table) {
        table.dropColumn('related');
      });
    };

    await strapi.db.transaction(run);
  },
};
