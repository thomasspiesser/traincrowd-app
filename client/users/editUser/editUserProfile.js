Template.editUserProfile.events({
  'input .form-control': function (event, template) {
    var field = event.currentTarget.id.split('-')[2];
    $('#edit-user-'+field).parent().removeClass('has-error');
    $('#help-text-edit-user-'+field).text('speichern...').fadeIn(300);
    lazysaveUserField( { argName: field, argValue: event.currentTarget.value } );
  },
  'click #saveEditUserProfile': function (event, template) {
    Session.set('editUserTemplate', "editUserAddress");

    $('#editUserProfile').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#editUserAddress').children('.progress-tracker').removeClass('inactive').addClass('active');

    return false;
  },
});