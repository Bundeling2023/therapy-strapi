const SOURCE_TABLE_NAME = 'navigations';

module.exports = {
  async up(knex) {
    // Check if locale or locale_code column exists (v4 vs v5)
    const hasLocaleCode = await knex.schema.hasColumn(SOURCE_TABLE_NAME, 'locale_code');
    const localeColumn = hasLocaleCode ? 'locale_code' : 'locale';

    // Get all entries and rewrite directly to the navigation_items table
    const all = await knex.from(SOURCE_TABLE_NAME).columns('id', 'slug', localeColumn).select();

    const run = async () => {
      await Promise.all(
        all.map(async (item) => {
          const { id, slug } = item;
          const locale = item[localeColumn];

          if (slug && locale && id) {
            const regex = new RegExp(`-${locale}$`);

            await knex
              .from(SOURCE_TABLE_NAME)
              .update({ slug: slug.replace(regex, '') })
              .where({ id });
          }
        })
      );
    };

    await strapi.db.transaction(async () => {
      // Run related id to document id migration
      await run();
    });
  },
};
