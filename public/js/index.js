var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
    var li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    $('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
    var li = $('<li></li>');
    var a = $('<a target="_blank">My current location</a>');    // open the url in the new tab

    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);

    $('#messages').append(li);
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

