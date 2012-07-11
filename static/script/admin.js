$(function() {
  var moment = window.moment
  var whiskers = window.whiskers

  $('#notification-add').submit(function() {
    var data = $(this).toJSON()
    data.id = Date.now()
    console.log(data)
    $.ajax({
      type: 'post',
      url: 'notification',
      data: data,
      success: function() {
        $.ajax({
          url: 'templates/notification.html',
          success: function(template) {
            data.time = moment(data.id).format('MM/DD/YYYY h:mma')
            $(whiskers.render(template, {auth: true, notification: data})).prependTo('#notifications')
          }
        })
      },
      error: function(jqXHR, stat, err) {
        console.error(err)
      }
    })
    return false
  })

  $('#notification-delete').submit(function() {
    return false
  })
})
