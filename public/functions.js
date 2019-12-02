function getValuesByDR() {
    let d = document.getElementById("DC").value;
    let r = document.getElementById("RC").value;
    drpath = `getValuesByDR?DateCheck=${d}&RoomCheck=${r}`;
    $.get(drpath, (data) => {
        if(!data) {
            console.log("No Data Received");
        }
        else {
            showTable(data);
        }
    });
}

function getValuesByID() {
    let i = document.getElementById("payID").value;
    drpath = `getPayById/${i}`;
    $.get(drpath, (data) => {
        if(!data) {
            console.log("No Data Received");
        }
        else {
            showPayTable(data);
        }
    });
}

function showTable(data) {
    var TableSection = document.getElementById("EdiTable");
    $("table").remove();
    var table = document.createElement("table");
    table.border = "1";
    if (data.length > 0) {
        var row = document.createElement("tr");
        row.className += "EdiTable";
        var colST = document.createElement("td");
        colST.innerHTML = "Start Time";
        var colES = document.createElement("td");
        colES.innerHTML = "Event Start";
        var colEE = document.createElement("td");
        colEE.innerHTML = "Event End";
        var colET = document.createElement("td");
        colET.innerHTML = "End Time";
        var colA = document.createElement("td");
        colA.innerHTML = "Age"
        var colEA = document.createElement("td");
        colEA.innerHTML = "Attendees"
        var colON = document.createElement("td");
        colON.innerHTML = "Order No"
        row.appendChild(colST);
        row.appendChild(colES);
        row.appendChild(colEE);
        row.appendChild(colET);
        row.appendChild(colA);
        row.appendChild(colEA);
        row.appendChild(colON);
        table.appendChild(row);
    }
    else {
        var row = document.createElement("tr");
        row.className += "EdiTable";
        var col = document.createElement("td");
        col.innerHTML = "No Reservations for this room at this date";
        row.appendChild(col);
        table.appendChild(row);
    }
    

    for (var i = 0; i < data.length; i++) {
        var row = document.createElement("tr");
        row.className += "EdiTable";
        var colST = document.createElement("td");
        colST.innerHTML = data[i].startTime;
        var colES = document.createElement("td");
        colES.innerHTML = data[i].eventStart;
        var colEE = document.createElement("td");
        colEE.innerHTML = data[i].eventEnd;
        var colET = document.createElement("td");
        colET.innerHTML = data[i].endTime;
        var colA = document.createElement("td");
        colA.innerHTML = data[i].age;
        var colEA = document.createElement("td");
        colEA.innerHTML = data[i].estimatedAttendees;
        var colON = document.createElement("td");
        colON.innerHTML = data[i].orderNo;

        row.appendChild(colST);
        row.appendChild(colES);
        row.appendChild(colEE);
        row.appendChild(colET);
        row.appendChild(colA);
        row.appendChild(colEA);
        row.appendChild(colON);
        table.appendChild(row);
    }
    TableSection.appendChild(table);
}

function showPayTable(data) {
    var TableSection = document.getElementById("EdiTable");
    $("table").remove();
    var table = document.createElement("table");
    table.border = "1";

    var d = new Date();
    let datetoday = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

    if (data.length > 0) {
        var Hrow = document.createElement("tr");
        Hrow.className += "EdiTable";
        var HcolON = document.createElement("td");
        HcolON.innerHTML = "Order No";
        var HcolDRQ = document.createElement("td");
        HcolDRQ.innerHTML = "Date of Request";
        var HcolRPT = document.createElement("td");
        HcolRPT.innerHTML = "Rental Price Total";
        var HcolD = document.createElement("td");
        HcolD.innerHTML = "Initial Deposit";

        var row = document.createElement("tr");
        row.className += "EdiTable";
        var colON = document.createElement("td");
        colON.innerHTML = data[0].orderNo;
        var colDRQ = document.createElement("td");
        colDRQ.innerHTML = data[0].dateOfRequest;
        var colRPT = document.createElement("td");
        colRPT.innerHTML = data[0].rentalPriceTotal;
        var colD = document.createElement("td");
        colD.innerHTML = data[0].deposit;

        Hrow.appendChild(HcolON);
        Hrow.appendChild(HcolDRQ);
        Hrow.appendChild(HcolRPT);
        Hrow.appendChild(HcolD);
        row.appendChild(colON);
        row.appendChild(colDRQ);
        row.appendChild(colRPT);
        row.appendChild(colD);
        
        if (data[0].reservedDate != null) {
            var HcolRN = document.createElement("td");
            HcolRN.innerHTML = "Room Name";
            var HcolRD = document.createElement("td");
            HcolRD.innerHTML = "Event Date";
            Hrow.appendChild(HcolRN);
            Hrow.appendChild(HcolRD);
            var colRN = document.createElement("td");
            colRN.innerHTML = data[0].roomName;
            var colRD = document.createElement("td");
            colRD.innerHTML = data[0].reservedDate;
            row.appendChild(colRN);
            row.appendChild(colRD);
            if (data[0].dateCollected == null) {
                var HcolDCo = document.createElement("td");
                HcolDCo.innerHTML = "Paid?";
                Hrow.appendChild(HcolDCo);
                var colDCo = document.createElement("td");
                colDCo.innerHTML = "No";
                row.appendChild(colDCo);
            }
            else {
                var HcolDCo = document.createElement("td");
                HcolDCo.innerHTML = "Date Total Collected";
                Hrow.appendChild(HcolDCo);
                var colDCo = document.createElement("td");
                colDCo.innerHTML = data[0].dateCollected;
                row.appendChild(colDCo);
            }
        }
        else {
            var HcolDCa = document.createElement("td");
            HcolDCa.innerHTML = "Date Cancelled";
            var HcolCR = document.createElement("td");
            HcolCR.innerHTML = "Can Refund?";
            var HcolRA = document.createElement("td");
            HcolRA.innerHTML = "Refund Amount";
            Hrow.appendChild(HcolDCa);
            Hrow.appendChild(HcolCR);
            Hrow.appendChild(HcolRA);
            var colDCa = document.createElement("td");
            colDCa.innerHTML = data[0].dateCancelled
            var colCR = document.createElement("td");
            colCR.innerHTML = data[0].canRefund;
            var colRA = document.createElement("td");
            colRA.innerHTML = data[0].refundAmount;
            row.appendChild(colDCa);
            row.appendChild(colCR);
            row.appendChild(colRA);
        }
        table.appendChild(Hrow);
        table.appendChild(row);
    }
    else {
        var row = document.createElement("tr");
        row.className += "EdiTable";
        var col = document.createElement("td");
        col.innerHTML = "No Event with this Order No";
        row.appendChild(col);
        table.appendChild(row);
    }
    TableSection.appendChild(table);
    if (data.length > 0) {
        addbuttons(data);
    }
}

function addbuttons(data) {
    removebutton();
    var d = new Date();
    let datetoday = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

    if (data[0].reservedDate != null) {
        if (data[0].dateCollected == null) {
            paybutton(data);
            lbreak();
            let a = Date.parse(datetoday);
            let b = Date.parse(data[0].reservedDate);
            if (b > a) {
                cancelbutton(data);
            }
        }
    }
}

function removebutton() {
    var bodynode = document.getElementsByTagName("body")[0];
    var section = document.getElementById("buttonsection");
    section.remove();
    var newsection = document.createElement("div");
    newsection.id = "buttonsection";
    bodynode.appendChild(newsection);
}

function paybutton(data) {
    var section = document.getElementById("buttonsection");
    var payform = document.createElement("form");
    var idno = data[0].orderNo;
    var difference = data[0].rentalPriceTotal - data[0].deposit;
    payform.action = `/PayById?id=${idno}&diff=${difference}`;
    payform.method = "POST";
    var pbutton = document.createElement("input");
    pbutton.type = "submit";
    pbutton.value = "Pay Fee";
    payform.appendChild(pbutton);
    section.appendChild(payform);
}

function lbreak() {
    var section = document.getElementById("buttonsection");
    var linebreak = document.createElement("br");
    section.appendChild(linebreak);
    section.appendChild(linebreak);
}

function cancelbutton(data) {
    var section = document.getElementById("buttonsection");
    var cancelform = document.createElement("form");
    var idno = data[0].orderNo;
    if (data[0].dateCollected == null) {
        var tot = data[0].deposit;
    }
    else {
        var tot = data[0].rentalPriceTotal;
    }
    var rd = data[0].reservedDate;
    cancelform.action = `/CancelById?id=${idno}&ra=${tot}&rd=${rd}`
    cancelform.method = "POST";
    var cbutton = document.createElement("input");
    cbutton.type = "submit";
    cbutton.value = "Cancel Fee";
    cancelform.appendChild(cbutton);
    section.appendChild(cancelform);
}

function getWorkerByDate() {
    let date = document.getElementById("WDate").value;
    let drpath = `getWorkerByDate/${date}`;
    $.get(drpath, (data) => {
        if(!data) {
            console.log("No Data Received");
        }
        else {
            showWorker(data, date);
        }
    });
}

function showWorker(data, date) {
    var Section = document.getElementById("Editable");
    var d = new Date();
    var dateToday = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    $("p").remove();
    var statement = document.createElement("p");
    if (data.length > 0) {
        if (date < dateToday) {
            statement.innerHTML = `${data[0].staffName} was working on this date`;
        }
        else if (dateToday == date) {
            statement.innerHTML = `${data[0].staffName} is working today`;
        }
        else {
            statement.innerHTML = `${data[0].staffName} will be working that day`;
        }
    }
    else {
        if (date < dateToday) {
            statement.innerHTML = 'No one was working on this date';
        }
        else if (dateToday == date) {
            statement.innerHTML = 'No one is working today';
        }
        else {
            statement.innerHTML = 'No one has been assigned to work that day yet';
        }
    }
    Section.appendChild(statement);
}

function checkUpdate() {
    let date = document.getElementsByName("UpdateDate")[0].value;
    var d = new Date();
    var dateToday = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    if (date > dateToday) return true;
    else {
        alert('Cannot update past dates');
        return false;
    }
}

function checkConflict() {
    // time conflict
    let room = document.getElementById("RN").value;
    let date = document.getElementsByName("DC")[0].value;
    let timestart = document.getElementsByName("TimeSetStart")[0].value;
    let timeEstart = document.getElementsByName("TimeEventStart")[0].value;
    let timeEend = document.getElementsByName("TimeEventEnd")[0].value;
    let timeend = document.getElementsByName("TimeSetEnd")[0].value;
    
    if (timestart < timeEstart) {
        if (timeEstart < timeEend) {
            if (timeEend >= timeend) {
                alert('Invalid Times');
                return false;
            }
        }
        else {
            alert('Invalid Times');
            return false;
        }
    }
    else {
        alert('Invalid Times');
        return false;
    }

    let drpath = `/check?rn=${room}&d=${date}&ts=${timestart}&te=${timeend}`;
    $.get(drpath, (data) => {
        if(!data) {
            console.log("No Data Received");
        }
        else {
            if (data.length > 0) {
                alert('Conflict in Schedule');
                return false;
            }
            else {
                // person limit per day
                let pname = document.getElementsByName("PersonName")[0].value;
                let pemail = document.getElementsByName("Email")[0].value;
                let nepath = `/pcheck?pn=${pname}&em=${pemail}`;
                $.get(nepath, (data) => {
                    if(!data) {
                        console.log("No Data");
                    }
                    else {
                        if (data.length > 0) {
                            alert('You cannot make more than one reservation/day');
                            return false;
                        }
                        else {
                            // new person
                            let newpath = `newcheck?pn=${pname}&em=${pemail}`;
                            $.get(newpath, (dota) => {
                                if(!dota) {
                                    console.log("No Data");
                                }
                                else {
                                    if (dota.length == 0) {
                                        alert('Register your name with an admin first');
                                        return false;
                                    }
                                    else {
                                        submitter();
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
    return false;
}

function submitter(){
    var tbuttons = document.getElementById("testbuttons");
    tbuttons.remove();
    var catering = document.getElementById("Cat").value;
    var rmname = document.getElementById("RN").value;
    let quantity = document.getElementsByName("Quantity")[0].value;
    let deposit = document.getElementsByName("Deposit")[0].value;
    let cprice;
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
    if (cprice + rprice < deposit) {
        alert('Deposit is too high');
        return;
    }
    var rform = document.getElementById("rform");
    var question = document.createElement("p");
    question.innerHTML = `Are you sure? Total is ${cprice + rprice}`;
    var submitbutton = document.createElement("input");
    submitbutton.type = "submit";
    submitbutton.value = "I'm Sure";
    var anc = document.createElement("a");
    anc.href = "./form.html";
    var denybutton = document.createElement("input");
    denybutton.type = "button";
    denybutton.value = "Never mind...";
    rform.appendChild(question);
    rform.appendChild(submitbutton);
    anc.appendChild(denybutton);
    rform.appendChild(anc);
    makereadonly();
}

function makereadonly() {
    var pname = document.getElementsByName("PersonName")[0];
    pname.readOnly = true;
    var email = document.getElementsByName("Email")[0];
    email.readOnly = true;
    var rmname = document.getElementById("RN");
    rmname.disabled = true;
    var setup = document.getElementById("Setup");
    setup.disabled = true;
    var cmnts = document.getElementsByName("comments")[0];
    cmnts.readOnly = true;
    var cater = document.getElementsByName("Catering")[0];
    cater.disabled = true;
    var datechoice = document.getElementsByName("Deposit")[0];
    datechoice.readOnly = true;
    var activityname = document.getElementsByName("AN")[0];
    activityname.readOnly = true;
    var datechoice = document.getElementsByName("DC")[0];
    datechoice.readOnly = true;
    var timesetstart = document.getElementsByName("TimeSetStart")[0];
    timesetstart.readOnly = true;
    var timeeventstart = document.getElementsByName("TimeEventStart")[0];
    timeeventstart.readOnly = true;
    var timeeventend = document.getElementsByName("TimeEventEnd")[0];
    timeeventend.readOnly = true;
    var timesetend = document.getElementsByName("TimeSetEnd")[0];
    timesetend.readOnly = true;
    var attendance = document.getElementsByName("Quantity")[0];
    attendance.readOnly = true;
    var age = document.getElementsByName("Age")[0];
    age.readOnly = true;
}

function revert() {
    var rmname = document.getElementById("RN");
    rmname.disabled = false;
    var setup = document.getElementById("Setup");
    setup.disabled = false;
    var cater = document.getElementsByName("Catering")[0];
    cater.disabled = false;
}

function TestValues1() {
    var pname = document.getElementsByName("PersonName")[0];
    pname.value = "Victor Frankenstein";
    var email = document.getElementsByName("Email")[0];
    email.value = "franken@coldmail.com";
    var rmname = document.getElementById("RN");
    rmname.value = "Basketball Court 1";
    var setup = document.getElementById("Setup");
    setup.value = "Lec";
    var cmnts = document.getElementsByName("comments")[0];
    cmnts.value = "Hello World";
    var cater = document.getElementsByName("Catering")[0];
    cater.value = "NoCatering";
    var datechoice = document.getElementsByName("Deposit")[0];
    datechoice.value = "100";
    var activityname = document.getElementsByName("AN")[0];
    activityname.value = "ACLE Presentation";
    var datechoice = document.getElementsByName("DC")[0];
    datechoice.value = "2019-12-07";
    var timesetstart = document.getElementsByName("TimeSetStart")[0];
    timesetstart.value = "15:00:00";
    var timeeventstart = document.getElementsByName("TimeEventStart")[0];
    timeeventstart.value = "15:15:00";
    var timeeventend = document.getElementsByName("TimeEventEnd")[0];
    timeeventend.value = "16:45:00";
    var timesetend = document.getElementsByName("TimeSetEnd")[0];
    timesetend.value = "17:00:00";
    var attendance = document.getElementsByName("Quantity")[0];
    attendance.value = "25";
    var age = document.getElementsByName("Age")[0];
    age.value = "25";
}

function TestValues2() {
    var pname = document.getElementsByName("PersonName")[0];
    pname.value = "Victor Frankenstein";
    var email = document.getElementsByName("Email")[0];
    email.value = "franken@coldmail.com";
    var rmname = document.getElementById("RN");
    rmname.value = "Basketball Court 1";
    var setup = document.getElementById("Setup");
    setup.value = "Lec";
    var cmnts = document.getElementsByName("comments")[0];
    cmnts.value = "Hello World";
    var cater = document.getElementsByName("Catering")[0];
    cater.value = "Aladdin Catering";
    var datechoice = document.getElementsByName("Deposit")[0];
    datechoice.value = "100";
    var activityname = document.getElementsByName("AN")[0];
    activityname.value = "ACLE Presentation";
    var datechoice = document.getElementsByName("DC")[0];
    datechoice.value = "2019-12-07";
    var timesetstart = document.getElementsByName("TimeSetStart")[0];
    timesetstart.value = "13:00:00";
    var timeeventstart = document.getElementsByName("TimeEventStart")[0];
    timeeventstart.value = "13:15:00";
    var timeeventend = document.getElementsByName("TimeEventEnd")[0];
    timeeventend.value = "13:45:00";
    var timesetend = document.getElementsByName("TimeSetEnd")[0];
    timesetend.value = "14:00:00";
    var attendance = document.getElementsByName("Quantity")[0];
    attendance.value = "25";
    var age = document.getElementsByName("Age")[0];
    age.value = "25";
}

function TestValues3() {
    var pname = document.getElementsByName("PersonName")[0];
    pname.value = "Jack Merridew";
    var email = document.getElementsByName("Email")[0];
    email.value = "jackmew@island.com";
    var rmname = document.getElementById("RN");
    rmname.value = "Basketball Court 1";
    var setup = document.getElementById("Setup");
    setup.value = "Lec";
    var cmnts = document.getElementsByName("comments")[0];
    cmnts.value = "Hello World";
    var cater = document.getElementsByName("Catering")[0];
    cater.value = "Aladdin Catering";
    var datechoice = document.getElementsByName("Deposit")[0];
    datechoice.value = "100";
    var activityname = document.getElementsByName("AN")[0];
    activityname.value = "ACLE Presentation";
    var datechoice = document.getElementsByName("DC")[0];
    datechoice.value = "2019-12-07";
    var timesetstart = document.getElementsByName("TimeSetStart")[0];
    timesetstart.value = "13:00:00";
    var timeeventstart = document.getElementsByName("TimeEventStart")[0];
    timeeventstart.value = "13:15:00";
    var timeeventend = document.getElementsByName("TimeEventEnd")[0];
    timeeventend.value = "13:45:00";
    var timesetend = document.getElementsByName("TimeSetEnd")[0];
    timesetend.value = "14:00:00";
    var attendance = document.getElementsByName("Quantity")[0];
    attendance.value = "25";
    var age = document.getElementsByName("Age")[0];
    age.value = "25";
}