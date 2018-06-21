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
        seq.push('-');
    }
    var msg = {
        "num1": seq[seq.length - 1],
        "num2": seq[seq.length - 2],
        "num3": seq[seq.length - 3],
        "num4": seq[seq.length - 4],
        "num5": seq[seq.length - 5],
        "num6": seq[seq.length - 6],
        "num7": seq[seq.length - 7],
        "num8": seq[seq.length - 8]
    };
    return msg;
}

function getmannums(){
    var seq = []
    sequence.forEach(function(e){
        seq.push(e)
    });
    while (seq.length < 8){
        seq.push('-');
    }
    var msg = {
        "num1": seq[7],
        "num2": seq[6],
        "num3": seq[5],
        "num4": seq[4],
        "num5": seq[3],
        "num6": seq[2],
        "num7": seq[1],
        "num8": seq[0]
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