Categories = new Mongo.Collection("categories");
/*
  all the categories are store in the Categories collection:
    _id: categories id
    categories: [kat1, kat2, kat3, etc]
*/

categorySchema = new SimpleSchema({
	categories:{
		type: [ String ],
		label: "Kategorien"
	}
});

Categories.attachSchema(categorySchema);