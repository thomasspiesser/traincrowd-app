AdminConfig = { 
  collections: {
    Courses: {
      color: 'green',
      tableColumns: [
       { label: 'Titel', name: 'title' },
       { label: 'Trainer', name: 'ownerName' }
      ]
    }, 
    Current: {
      color: 'red',
      tableColumns: [
       { label: 'Kurs', name: 'courseTitle' },
       { label: 'Trainer', name: 'ownerName' }
      ]
    }, 
    Elapsed: {},
    Bookings: {},
    Categories: {}
  }, 
  autoForm: {
    omitFields: ['createdAt','updatedAt']
  },
  userSchema: new SimpleSchema([userSchema, publicStateSchema])
};

AdminDashboard.addSidebarItem('Custom', AdminDashboard.path('/custom'), { icon: 'angellist' });

Router.route('custom', {
  path: AdminDashboard.path('custom'),
  controller: 'AdminController',
  onAfterAction: function () {
    Session.set('admin_title', 'Custom');
  }
});