// Template.filters.events({
//   'click .filter' : function (event, template) {
//     var category = event.target.id;
//     var instance = EasySearch.getComponentInstance(
//       { index : 'courses' }
//     );

//     // Change the currently filteredCategories like this
//     EasySearch.changeProperty('courses', 'filteredCategory', category);
//     // Trigger the search again, to reload the new products
//     instance.triggerSearch();
//   }
// });