Template.editUserProfile.events({
  'input .form-control': function (event, template) {
    var field = event.currentTarget.id.split('-')[1];
    $('#edit-'+field).parent().removeClass('has-error');
    $('#help-text-edit-'+field).text('speichern...').fadeIn(300);
    lazysaveField( 'User', { id: "", argName: field, argValue: event.currentTarget.value } );
  },
  'click #saveEditUserProfile': function (event, template) {
    Session.set('editUserTemplate', "editUserAddress");

    $('#editUserProfile').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#editUserAddress').children('.progress-tracker').removeClass('inactive').addClass('active');

    return false;
  },
});