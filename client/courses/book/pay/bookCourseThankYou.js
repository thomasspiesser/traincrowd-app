Template.bookCourseThankYou.helpers({
  invoice: function () {
    return this.paymentMethod === 'Rechnung';
  }
});