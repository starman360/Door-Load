var express = require('express')
var stylus = require('stylus')
var nib = require('nib')
var logger = require('morgan')
var bodyParser = require('body-parser')

var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);


function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib())
}
 
var sequence = []

function getlivenums() {
    var seq = []
    sequence.forEach(function(e){
        seq.push(e)
    });
    while (seq.length < 8){
        seq.push('- - -');
    }
    for(i = 0; i < seq.length; i++){
        seq[i] = seq[i].split(' ');
    }
    var msg = {
        "num1": seq[seq.length - 1][1],
        "num2": seq[seq.length - 2][1],
        "num3": seq[seq.length - 3][1],
        "num4": seq[seq.length - 4][1],
        "num5": seq[seq.length - 5][1],
        "num6": seq[seq.length - 6][1],
        "num7": seq[seq.length - 7][1],
        "num8": seq[seq.length - 8][1],
        "col1": seq[seq.length - 1][0],
        "col2": seq[seq.length - 2][0],
        "col3": seq[seq.length - 3][0],
        "col4": seq[seq.length - 4][0],
        "col5": seq[seq.length - 5][0],
        "col6": seq[seq.length - 6][0],
        "col7": seq[seq.length - 7][0],
        "col8": seq[seq.length - 8][0],
        "drive1": seq[seq.length - 1][2],
        "drive2": seq[seq.length - 2][2],
        "drive3": seq[seq.length - 3][2],
        "drive4": seq[seq.length - 4][2],
        "drive5": seq[seq.length - 5][2],
        "drive6": seq[seq.length - 6][2],
        "drive7": seq[seq.length - 7][2],
        "drive8": seq[seq.length - 8][2]
    };
    return msg;
}

function getmannums(){
    var seq = []
    sequence.forEach(function(e){
        seq.push(e)
    });
    while (seq.length < 8){
        seq.push('- - -');
    }
    for(i = 0; i < seq.length; i++){
        seq[i] = seq[i].split(' ');
    }
    var msg = {
        "num1": seq[7][1],
        "num2": seq[6][1],
        "num3": seq[5][1],
        "num4": seq[4][1],
        "num5": seq[3][1],
        "num6": seq[2][1],
        "num7": seq[1][1],
        "num8": seq[0][1],
        "col1": seq[7][0],
        "col2": seq[6][0],
        "col3": seq[5][0],
        "col4": seq[4][0],
        "col5": seq[3][0],
        "col6": seq[2][0],
        "col7": seq[1][0],
        "col8": seq[0][0],
        "drive1": seq[7][2],
        "drive2": seq[6][2],
        "drive3": seq[5][2],
        "drive4": seq[4][2],
        "drive5": seq[3][2],
        "drive6": seq[2][2],
        "drive7": seq[1][2],
        "drive8": seq[0][2]
    };

    return msg;
}


app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(logger('dev'))
app.use(stylus.middleware(
    {
        src: __dirname + '/public'
        , compile: compile
    }
))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: false
}));
app.use(bodyParser.json());       // to support JSON-encoded bodies

app.post('/editor', function (req, res) {

    console.log(req.body.sequenceInput);

    if (typeof req.body.sequenceInput == "undefined") {
        if (req.body.clear == "Delete") {
            sequence.splice(-1, 1); // Delete last element
        }
    }
    else {
        sequence.push(req.body.sequenceInput)
        console.log(sequence);
        console.log(getlivenums());
    }
    res.render('editor',
        {
            title: 'Editor'
        }
    )
    io.emit('update nums', getlivenums()) // Refresh Live
    io.emit('man update nums', getmannums()) // Refresh Line
});

app.get('/editor', function (req, res) {
    res.render('editor',
        {
            title: 'Editor'
        }
    )
    io.emit('update nums', getlivenums())
})

app.get('/', function (req, res) {
    res.render('live',
        {
            title: 'Live'
        }
    )
})

app.get('/Line/', function (req, res) {
    res.render('line',
        {
            title: 'Line'
        }
    )
})


io.on('connection', function (socket) {
    console.log('a user connected');
    io.emit('update nums', getlivenums())

    socket.on('man update', function (msg) {
        io.emit('man update nums', getmannums())
        sequence.splice(0,1); // Delete the oldest number
        io.emit('man update nums', getmannums())
    });
    socket.on('man refresh', function (msg) {
        io.emit('man update nums', getmannums())
    });
});

http.listen(8080, function () {
    console.log('listening on *:8080');
});