$(function() {
  var moment = window.moment

  $('.time').each(function() {
    var unixTime = $(this).text()
    $(this).text(moment(parseInt(unixTime,10)).format('MM/DD/YYYY h:mma'))
  })
})
