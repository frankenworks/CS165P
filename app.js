const express = require('express');
const mysql = require('mysql');
const PORT = process.env.PORT || 5000;
var bodyParser = require('body-parser');

// Create connection
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'peralejo'
});

// Connect
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
});

const app = express();

// Public Files Routes
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'html');
app.get('/', (req, res) => res.render('/index'));

// Get Table by Date + Room
app.get('/getValuesByDR', (req, res) => {
    let d = req.query.DateCheck;
    let r = req.query.RoomCheck;
    let sql = `SELECT * FROM EventDetails WHERE reservedDate = '${d}' and roomName = '${r}'`;
    db.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    });
});

// Get Schedule by id
app.get('/getValuesById/:id', (req, res) => {
    let i = req.params.id;
    let post = {orderNo: i};
    let sql = 'SELECT * FROM EventDetails WHERE ?';
    db.query(sql, post, (err, results) => {
        if(err) throw err;
        res.send(results);
    });
});

// Get Payment Details by id
app.get('/getPayById/:id', (req, res) => {
    let i = req.params.id;
    let sql = `SELECT orderNo, roomName, dateOfRequest, reservedDate, rentalPriceTotal, dateCollected, deposit, dateCancelled, canRefund, refundAmount
        FROM ((RequestForms left outer join EventDetails using(orderNo)) left outer join PaymentRecord using (orderNo)) left outer join CancellationRecord using (orderNo)
        WHERE orderNo = ${i};`;
    db.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    });
});

app.post('/test', (req, res) => {
    console.log('test performed');
    res.status(200).redirect('/payment.html');
});

// Pay by id
app.post('/PayById', (req, res) => {
    let id = req.query.id;
    let diff = req.query.diff;
    let today = new Date();
    let d = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let sql = `INSERT INTO PaymentRecord values(${id}, '${d}', ${diff})`;
    db.query(sql, (err) => {
        if(err) throw err;
        else {
            res.status(200).redirect('/index.html');
        }
    });
});

// Cancel by id
app.post('/CancelById', (req, res) => {
    let id = req.query.id;
    var refamount = req.query.ra;
    let reservedDate = req.query.rd;
    let today = new Date();
    let d = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let msperday = 1000 * 60 * 60 * 24;
    let a = new Date(today);
    let b = new Date(reservedDate);
    let utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    let utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    if ((utc2 - utc1) / msperday > 7) {
        var canref = 1;
    }
    else {
        var canref = 0;
        refamount = 0;
    }
    let sql = `INSERT INTO CancellationRecord values(${id}, '${d}', ${canref}, ${refamount})`;
    db.query(sql, (err) => {
        if(err) throw err;
        else {
            res.status(200).redirect('/index.html');
        }
    });
});

// Conflict Checker - Schedule
app.get('/check', (req, res) => {
    let room = req.query.rn;
    let date = req.query.d;
    let timestart = req.query.ts;
    let timeend = req.query.te;
    let sql = `(SELECT * FROM (SELECT * FROM EventDetails WHERE reservedDate = '${date}' AND roomName = '${room}') subquery1
	    WHERE startTime >= '${timestart}' AND startTime < '${timeend}')
        UNION
        (SELECT * FROM (SELECT * FROM EventDetails WHERE reservedDate = '${date}' and roomName = '${room}') subquery2
        WHERE endTime > '${timestart}' AND endTime <= '${timeend}')`;
    db.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    });
});

// Conflict Checker - Person/Day
app.get('/pcheck', (req, res) => {
    let pname = req.query.pn;
    let pemail = req.query.em;
    var d = new Date();
    var datetoday = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    let sql = `SELECT * FROM RequestForms WHERE name = '${pname}' AND email = '${pemail}' AND dateOfRequest = '${datetoday}'`;
    db.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    });
});

// Conflict Checker - New Person
app.get('/newcheck', (req, res) => {
    let pname = req.query.pn;
    let pemail = req.query.em;
    let sql = `SELECT * FROM PersonalData WHERE name = '${pname}' AND email = '${pemail}'`;
    db.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    });
});

// Post a Request
app.post('/requestForm', (req, res) => {
    let nme = req.body.PersonName;
    let email = req.body.Email;
    let rmname = req.body.RoomName;
    let setups = req.body.Setups;
    let cmnts = req.body.comments;
    let catering = req.body.Catering;
    let cprice;
    let deposit = req.body.Deposit;
    let actname = req.body.AN;
    let datechoice = req.body.DC;
    let timesetstart = req.body.TimeSetStart;
    let timeeventstart = req.body.TimeEventStart;
    let timeeventend = req.body.TimeEventEnd;
    let timesetend = req.body.TimeSetEnd;
    let quantity = req.body.Quantity;
    let age = req.body.Age;
    let d = new Date();
    let dateofreq = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    let rprice;
    switch(catering) {
        case ('NoCatering'):
            cprice = 0;
            break;
        case ('CSU Catering'):
            cprice = 100.00 * quantity;
            break;
        case ('Aladdin Catering'):
            cprice = 50.00 * quantity;
            break;
        case ('Buffet Catering'):
            cprice = 20.00 * quantity;
            break;
    }
    switch(rmname) {
        case ('50m Competition Pool'):
            rprice = 150.00;
            break;
        case ('Administration Conference Room'):
            rprice = 200.00;
            break;
        case ('Lobby'):
            rprice = 100.00;
            break;
        case ('MAC Gymnasium'):
            rprice = 100.00;
            break;
        case ('Basketball Court 1'):
            rprice = 300.00;
            break;
        case ('Basketball Court 2'):
            rprice = 300.00;
            break;
        case ('Racquetball Court 1'):
            rprice = 400.00;
            break;
        case ('Racquetball Court 2'):
            rprice = 400.00;
            break;
        case ('Squash Court 1'):
            rprice = 400.00;
            break;
        case ('Squash Court 2'):
            rprice = 500.00;
            break;
        case ('Studio 112'):
            rprice = 200.00;
            break;
        case ('Studio 227A'):
            rprice = 600.00;
            break;
        case ('Studio 158'):
            rprice = 300.00;
            break;
        case ('Studio 229B'):
            rprice = 200.00;
            break;
        case ('25yd Instructional Pool'):
            rprice = 150.00;
            break;
        case ('Green Roof'):
            rprice = 125.00;
            break;
        case ('Game Room'):
            rprice = 110.00;
            break;
        case ('Indoor Track'):
            rprice = 275.00;
            break;
    }

    // insert into request forms
    let sql1 = `INSERT into RequestForms(activityName, name, email, dateOfRequest, deposit, rentalPriceTotal)
        VALUES('${actname}', '${nme}', '${email}', '${dateofreq}', '${deposit}', '${rprice + cprice}')`;
    db.query(sql1, (err) => {
        if(err) throw err;
    });

    //insert into event details
    let sql2 = `INSERT INTO EventDetails VALUES ('${rmname}', '${datechoice}', 
        '${timesetstart}', '${timeeventstart}', '${timeeventend}', '${timesetend}', ${quantity}, ${age}, 
        (select max(orderNo) from RequestForms))`;
    db.query(sql2, (err) => {
        if(err) throw err;
    });
    
    // insert into catering
    if (catering != 'NoCatering') {
        let sql4 = `INSERT INTO HasCatering VALUES('${rmname}', '${datechoice}', '${timesetstart}', 
            '${catering}', '${quantity}', '${cprice}')`;
        db.query(sql4, (err) => {
            if(err) throw err;
    });
    }
    
    // insert into setups
    if (setups != 'NoSetup') {
        let sql3 = `INSERT INTO HasSetup VALUES ('${rmname}', '${datechoice}', '${timesetstart}', 
            '${setups}', '${cmnts}')`;
        db.query(sql3, (err) => {
            if(err) throw err;
        });
    }

    res.status(200).redirect('form.html');
});

//Admin Privs
// Get Worker by Date
app.get('/getWorkerByDate/:date', (req, res) => {
    let d = req.params.date;
    let sql = `SELECT * FROM StaffOnDuty WHERE workdate = '${d}'`;
    db.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    });
});

// Update Worker Date
app.post('/updateWorker', (req, res) => {
    let wname = req.body.UpdateName;
    let date = req.body.UpdateDate;
    // check if the date has values
    let sqlCheck = `SELECT * FROM StaffOnDuty WHERE workdate = '${date}'`;
    db.query(sqlCheck, (err, data) => {
        if(err) throw err;
        else {
            // update if exists
            if (data.length > 0) {
                let sql = `UPDATE staffonduty SET staffName = '${wname}' WHERE workdate = '${date}'`;
                db.query(sql, (err) => {
                    if(err) throw err;
                    res.status(200).redirect('admin.html');
                });
            }
            // insert if doesn't exist
            else {
                let sql = `INSERT INTO StaffOnDuty VALUES ('${date}', '${wname}')`;
                db.query(sql, (err) => {
                    if(err) throw err;
                    res.status(200).redirect('admin.html');
                });
            }
        }
    });
});

// Add new Person
app.post('/updateNames', (req, res) => {
    let pname = req.body.PersonName;
    let email = req.body.Email;
    let telno = req.body.TelNo;
    // check if the Person is in the list
    let sqlCheck = `SELECT * FROM PersonalData WHERE name = '${pname}' AND email = '${email}'`;
    db.query(sqlCheck, (err, data) => {
        if(err) throw err;
        else {
            // update if exists
            if (data.length > 0) {
                let sql = `UPDATE PersonalData SET telno = '${telno}' WHERE name = '${pname}' AND email = '${email}'`;
                db.query(sql, (err) => {
                    if(err) throw err;
                    res.status(200).redirect('admin.html');
                });
            }
            // insert if doesn't exist
            else {
                let sql = `INSERT INTO PersonalData VALUES ('${pname}', '${email}', '${telno}')`;
                db.query(sql, (err) => {
                    if(err) throw err;
                    res.status(200).redirect('admin.html');
                });
            }
        }
    });
});

// listen
app.listen(PORT, () => {
    console.log('Server started on port');
});