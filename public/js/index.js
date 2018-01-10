var socket = io();

function scrollToBottom() {
    // Selectors
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');

    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        //console.log('should scroll');
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('hh:mm a');
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    });

    $('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('hh:mm a');
    var template = $('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });

    $('#messages').append(html);
    scrollToBottom();
});

$('#message-form').on('submit', function (e) {
    e.preventDefault();     // prevent default behaviour for the event

    const txtMessageTextbox = $('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: txtMessageTextbox.val()
    }, function () {
        // acknowledgement callback
        txtMessageTextbox.val('');
        txtMessageTextbox.focus();
    });
});

var locationButton = $('#send-location');

locationButton.click(function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    const btnSendLocation = $('#send-location');
    btnSendLocation.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        btnSendLocation.removeAttr('disabled').text('Sending location');

        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });

        console.log(position);
    }, function () {
        btnSendLocation.removeAttr('disabled').text('Sending location');
        alert('Unable to fetch location.');
    });
});

