Template.editEmail.events({
  'input #edit-email': function (event, template) {
    var field = event.currentTarget.id.split('-')[1];
    $('#edit-'+field).parent().removeClass('has-error');
    $('#help-text-edit-'+field).text('speichern...').fadeIn(300);
    var id = this.data._id || "";
    lazysaveField( this.collection, { id: id, argName: field, argValue: event.currentTarget.value } );
  }
});