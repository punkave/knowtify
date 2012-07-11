$(function() {
  var moment = window.moment
  var whiskers = window.whiskers

  $('#notification-add').submit(function() {
    var data = $(this).toJSON()
    $.ajax({
      type: 'post',
      url: 'notification',
      data: data,
      success: function(data) {
        $.ajax({
          url: 'templates/notification.html',
          success: function(template) {
            data.raw = encodeURIComponent(JSON.stringify(data))
            data.time = moment(data.time).format('MM/DD/YYYY h:mma')
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

  $(document).on('submit', '.notification-delete', function() {
    if (!confirm('Delete this notification?')) return false
    var raw = decodeURIComponent($(this).find('input[name=notification]').val())
    var data = {value: raw}
    var $el = $(this).parents('.notification')
    console.log($el)
    $.ajax({
      type: 'delete',
      url: 'notification',
      data: data,
      success: function() {
        $el.remove()
      },
      error: function(jqXHR, stat, err) {
        console.error(err)
      }
    })
    return false
  })
})
