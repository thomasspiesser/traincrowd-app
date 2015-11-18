Template.searchTrainer.helpers({
  index() {
    return TrainersIndex;
  },
  inputAttributes() {
    let attrs = {
      class: 'form-control',
      placeholder: i18n('search.short'),
    };
    return attrs;
  },
  loadMoreAttributes() {
    return { class: 'btn btn-light-blue btn-block margin-bottom' };
  },
});
