// regular categories:
Categories = new Mongo.Collection('categories');

categorySchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Bezeichnung',
  },
});

Categories.attachSchema(categorySchema);

// meta categories:

MetaCategories = new Mongo.Collection('metaCategories');

metaCategorySchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Bezeichnung',
  },
});

MetaCategories.attachSchema(metaCategorySchema);

// category mapping:

CategoriesMap = new Mongo.Collection('categoriesMap');

categoriesMapSchema = new SimpleSchema({
  categoryId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'Kategorie Id',
  },
  metaCategoryId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'Meta-Kategorie Id',
  },
});

CategoriesMap.attachSchema(categoriesMapSchema);
