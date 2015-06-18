Template.trainerPreview.helpers({
  hostedCourses: function () {
    return Courses.find( { owner: this._id, isPublic: true }, {fields: {title: 1, slug:1}} );
  }
});