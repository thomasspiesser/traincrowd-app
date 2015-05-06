Template.editCourseLogistics.helpers({
  noLocation: function () {
    if (typeof this.noLocation !== 'undefined')
      Session.setDefault("noLocation", this.noLocation);
    else
      Session.setDefault("noLocation", false);
    return Session.get("noLocation");
  }
});

Template.editCourseLogistics.events({
  'click #saveEditCourseLogistics': function (event, template) {
    var noLocation = template.find("#editCourseNoLocation").checked;
    if (! noLocation)
      var street = template.find("#route").value;
    var modifier = {_id: this._id,
                owner: this.owner,
                noLocation: noLocation };

    if (! noLocation && ! street.length) {
      console.log('none');
      $('.form-group').addClass('has-error');
      $('.help-block').text('Bitte geben Sie an, ob Sie bereits einen Veranstaltungsort haben.');
      toastr.error( "Bitte machen Sie Angaben zum Veranstaltungsort." );
      return false;
    }

    if (noLocation) {
      Meteor.call('updateCourse', modifier, function (error, result) {
        if (error)
          toastr.error( error.reason );
        else
          toastr.success( 'Änderungen gespeichert.' );
      });
    } 
    else {

      var street_number = template.find("#street_number").value;
      var streetAdditional = template.find("#editCourseStreetAdditional").value;
      var plz = template.find("#postal_code").value;
      var city = template.find("#administrative_area_level_1").value;

      if (! street.length || ! street_number.length || plz.length < 5 || ! city.length ) {
        toastr.error( "Bitte geben Sie ein vollständige Adresse an." );
        return false;
      }
      
      modifier.street = street;
      modifier.streetNumber = street_number;
      modifier.streetAdditional = streetAdditional;
      modifier.plz = plz;
      modifier.city = city;

      Meteor.call('updateCourse', modifier, function (error, result) {
        if (error)
          toastr.error( error.reason );
        else
          toastr.success( 'Änderungen gespeichert.' );
      });
    }

    Session.set('editCourseTemplate', "editCoursePreview");

    $('#editCourseLogistics').children('.progress-tracker').removeClass('active').addClass('inactive');
    $('#editCoursePreview').children('.progress-tracker').removeClass('inactive').addClass('active');

      // $('#infoModal').modal('show');
    
  },
  'change #editCourseNoLocation': function (event) {
    Session.set("noLocation", event.target.checked);
  }
});