
$(function () {
    var socket = io();
    socket.on('update nums', function (msg) {
        $('#num1').text(msg['num1']);
        $('#num2').text(msg['num2']);
        $('#num3').text(msg['num3']);
        $('#num4').text(msg['num4']);
        $('#num5').text(msg['num5']);
        $('#num6').text(msg['num6']);
        $('#num7').text(msg['num7']);
        $('#num8').text(msg['num8']);
        $('#col1').text(msg['col1']);
        $('#col2').text(msg['col2']);
        $('#col3').text(msg['col3']);
        $('#col4').text(msg['col4']);
        $('#col5').text(msg['col5']);
        $('#col6').text(msg['col6']);
        $('#col7').text(msg['col7']);
        $('#col8').text(msg['col8']);
        $('#drive1').text(msg['drive1']);
        $('#drive2').text(msg['drive2']);
        $('#drive3').text(msg['drive3']);
        $('#drive4').text(msg['drive4']);
        $('#drive5').text(msg['drive5']);
        $('#drive6').text(msg['drive6']);
        $('#drive7').text(msg['drive7']);
        $('#drive8').text(msg['drive8']);
    });
});