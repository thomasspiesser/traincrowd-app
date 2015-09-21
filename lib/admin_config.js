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
    Elapsed: {
      color: 'purple',
      tableColumns: [
       { label: 'Kurs', name: 'courseTitle' },
       { label: 'Trainer', name: 'ownerName' }
      ]
    },
    Bookings: {
      color: 'black',
      tableColumns: [
       { label: 'Kurs', name: 'courseTitle' },
       { label: 'Kunde', name: 'customerName' },
       { label: 'Trainer', name: 'trainerName' }
      ]
    },
    Categories: {
      color: 'blue-light'
    }
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