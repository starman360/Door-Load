
$(function () {
    var socket = io();
    socket.on('man update nums', function (msg) {
        $('#num1').text(msg['num1']);
        $('#num2').text(msg['num2']);
        $('#num3').text(msg['num3']);
        $('#num4').text(msg['num4']);
        $('#num5').text(msg['num5']);
        $('#num6').text(msg['num6']);
        $('#num7').text(msg['num7']);
        $('#num8').text(msg['num8']);
    });
});