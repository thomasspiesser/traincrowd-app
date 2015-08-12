Template.editUserProfile.events({
  'input .form-control': function (event, template) {
    var field = event.currentTarget.id.split('-')[2];
    $('#edit-user-'+field).parent().removeClass('has-error');
    $('#help-text-edit-user-'+field).text('speichern...').fadeIn(300);
    lazysaveUserField( { argName: field, argValue: event.currentTarget.value } );
  },
  'click #saveEditUserProfile': function (event, template) {
    Session.set('editUserTemplate', "editUserAddress");

    $('#editUserProfile').parent().removeClass('active');
    $('#editUserAddress').parent().addClass('active');

    return false;
  },
});