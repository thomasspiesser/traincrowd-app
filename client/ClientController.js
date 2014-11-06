//////////// global helper functions /////////

var canEditHelper = { 
  canEdit: function () {
    return this.owner === Meteor.userId();
  } 
}

var errorHelper = {
  error: function () {
    return Session.get("createError");
  }
}

var trimInput = function(val) {
  return val.replace(/^\s*|\s*$/g, "");
}

var ownerNameHelper = {
  // works only where data context is Course
  ownerName: function () {
    return Meteor.users.findOne( this.owner ).profile.name;
  }
}

//////////// courseInquiry template /////////

Template.courseInquiry.helpers( errorHelper );

Template.courseInquiry.rendered=function() {
    $('#inquireDatesDatepicker').datepicker({
      format: "dd/mm/yyyy",
      weekStart: 1,
      language: "de",
      todayBtn: true,
      multidate: true,
      todayHighlight: true
    });
}

Template.courseInquiry.events({
  'click #cancelBookCourseButton': function () {
    Router.go("course.show", {_id: this._id} );
  },
  'click #inquireCourseDatesButton': function (event, template) {
    var inquiredDates = template.find("#inquireDatesDatepicker").value;
    if (inquiredDates.length > 1) {
      var inquiredDatesArray = inquiredDates.split(",");
      var instanceId = inquireNewCourseDates({ courseId:this._id, dates: inquiredDatesArray });
      Session.set("createError", "");
      Router.go("course.show", {_id: this._id} );
    } else {
      Session.set("createError",
                  "Please, choose at least one date!");
    }
    return false
  }
}); 

//////////// course template /////////

Template.course.helpers( ownerNameHelper );

//////////// courseDetail template /////////

Template.courseDetail.helpers( canEditHelper );
Template.courseDetail.helpers( errorHelper );


Template.courseDetail.events({
  'click #editCourseButton': function () {
    Router.go("course.edit", {_id: this._id} );
  },
  'click #inquireCourseDatesButton': function () {
    Router.go("course.inquire", {_id: this._id} );
  },
  'click .confirmDateButton': function (event,template) {
    var instanceId = event.target.name;
    var date = template.find('input:radio[name='+instanceId+']:checked');
    if (date) {
      var options = {
        courseId: template.data._id,
        instanceId: this.instanceId,
        confirmedDate: date.value,
        inquirer: this.inquirer
      }
      Meteor.call('confirmCourseDate', options);
      Session.set("createError", "");
      return false
    }
    else {
      Session.set("createError",
                  "Please, select a date to confirm!");
    }
  },
  'click .joinCourseButton': function (event, template) {
    var instanceId = event.target.name;
    $("#bookCourseButton").attr('name',instanceId); // pass the instanceId to modal through name
    $('#paymentModal').modal('show');
  }
});

//////////// paymentModal template /////////

Template.paymentModal.helpers( errorHelper );

Template.paymentModal.events({
  'click #bookCourseButton': function (event, template) {
    var instanceId = event.target.name;
    var currentCourse = _.findWhere(this.current, {instanceId: instanceId});
    // data context is still course: access using 'this.'
    if (Meteor.userId() === this.owner) {
      Session.set('errorMessage', 'You cannot book your own course!');
      return false
    }
    if (_.contains(currentCourse.participants, Meteor.userId())) {
      Session.set('errorMessage', 'You already booked this course!');
      return false
    }

    var courseId = this._id;
    Session.set("bookingMessage",
                  "Contact external service, wait for callback success/error!");
    var clock = 5;
    timeLeft = function(){
      if (clock > 0) {
        clock--;
        Session.set('time',clock);
      } else {
        Session.set('time','');
        Session.set("bookingMessage",'');
        Meteor.clearInterval(interval);
        $('#paymentModal').modal('hide');
        // assume success, push userId into current.participants if not already there
        var options = {
          courseId: courseId,
          instanceId: instanceId,
          userId: Meteor.userId()
        }
        Meteor.call('addParticipant', options);  
      }
    }
    var interval = Meteor.setInterval(timeLeft, 1000);
  }
});

Template.paymentModal.helpers({
  countdown: function () {
    return "wait for it: "+Session.get('time');
  },
  message: function () {
    return Session.get("bookingMessage");
  },
  errorMessage: function () {
    return Session.get("errorMessage");
  }
});  

//////////// editCourse template /////////

Template.editCourse.helpers( canEditHelper );
Template.editCourse.helpers( errorHelper );

Template.editCourse.events({ 
  'click #editCourseButton': function (event, template) {
    var title = template.find("#inputTitleCourse").value;
    var description = template.find("#inputDescriptionCourse").value;
    var maxParticipants = parseInt(template.find("#inputMaxNrParticipantsCourse").value);
    var public = template.find("#publishCourse").checked;

    if (title.length && description.length && maxParticipants > 1) {
      modifier = {  title: title,
                    description: description,
                    maxParticipants: maxParticipants,
                    public: public }
      Courses.update(this._id, { $set: modifier });

      Session.set("selectedCourse", this._id);
      Session.set("createError", "");
      Router.go("course.show", {_id: this._id} );
    } else {
      Session.set("createError",
                  "Please, fill out the entire form!");
    }
    return false
  },
  'click #removeCourseButton': function (event, template) {
    Courses.remove(this._id);
    Router.go("/courses");
  },
  'click #cancelEditCourseButton': function (event, template) {
    Router.go("course.show", {_id: this._id} );
  }
});

//////////// createCourse template /////////

Template.createCourse.events({
  'click #createCourseButton': function (event, template) {
    var title = template.find("#inputTitleCourse").value;
    var description = template.find("#inputDescriptionCourse").value;
    var maxParticipants = parseInt(template.find("#inputMaxNrParticipantsCourse").value);
    var public = template.find("#publishCourse").checked;

    if (title.length && description.length && maxParticipants > 1) {
      var id = createCourse({
        title: title,
        description: description,
        maxParticipants: maxParticipants,
        public: public
      });
      Session.set("selectedCourse", id);
      Session.set("createError", "");
      Router.go("course.show", {_id: id} );
    } else {
      Session.set("createError",
                  "Please, fill out the entire form!");
    }
    return false
  }
});

Template.createCourse.helpers( errorHelper );

//////////// register template /////////

Template.register.helpers( errorHelper );

Template.register.events({
    'click #signUpButton' : function(e, t) {
        var email = t.find('#account-email').value;
        var password = t.find('#account-password').value;
        var email = trimInput(email);
    
        Accounts.createUser({email: email, password : password}, function(err){
          if (err) {
            Session.set( "createError", "Sorry, "+err.reason );
          } else {
            Session.set( "createError", '' );
          }
        });
        return false;
    }
});

Template.register.events({
    'click #logInButton' : function(e, t) {
        var email = t.find('#account-email').value;
        var password = t.find('#account-password').value;
        var email = trimInput(email);

        Meteor.loginWithPassword(email, password, function(err){
            if (err) {
                Session.set( "createError", "Sorry, "+err.reason );
            } else {
                Session.set( "createError", '' );
            }
        });
        return false;
    }
});