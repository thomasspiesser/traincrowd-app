Template.trainerPreview.helpers({
  hostedCourses: function () {
    return Courses.find( { owner: this._id, public: true }, {fields: {title: 1}} );
  }
});