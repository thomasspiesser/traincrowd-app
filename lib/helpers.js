reformatDate = function(date) { // expects string 'date' of type dd.mm.yyyy
  return date.slice(6,10) +'.'+ date.slice(3,6) + date.slice(0,2); // return of type yyyy.mm.dd
}