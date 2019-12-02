#Peralejo, Kenji Francis I.
#2012-24688

#MySQL version 8.0

#create database statements
drop database if exists Peralejo;
create database Peralejo;
use Peralejo;

#create table statements
create table PersonalData (
	name varchar(50),
	email varchar(50),
	telno varchar(10),
	primary key(name, email)
);

create table RoomRates (
	roomName varchar(50),
	rooomPrice numeric(10,2),
	primary key(roomName)
);

#changed attributes to record staff name and day of the week s/he works instead of date
#changed primary key to day of the week
#reverted change
create table StaffOnDuty (
	workdate date,
	staffName varchar(50),
	primary key(workdate)
);

#order number data type changed to int from numeric(14)
create table RequestForms (
	orderNo int unsigned auto_increment,
	activityName varchar(50),
	name varchar(50),
	email varchar(50),
	dateOfRequest date,
	deposit numeric(10,2),
	rentalPriceTotal numeric(10,2),
	primary key(orderNo),
	unique(name, email, dateOfRequest),
	foreign key(name, email) references PersonalData(name,email)
);

#the AttendeeDetails and TimeDetails relations have been merged into EventDetails
create table EventDetails (
	roomName varchar(50),
	reservedDate date,
	startTime time,
	eventStart time,
	eventEnd time,
	endTime time,
	age int,
	estimatedAttendees int,
	orderNo int unsigned,
	primary key(roomName, reservedDate, startTime),
	unique(orderNo),
	foreign key(roomName) references RoomRates(roomName),
	foreign key(orderNo) references RequestForms(orderNo)
);

#a new relation has been added which lists catering services and prices
create table Catering (
	caterer varchar(50),
	pricePerHead numeric(10,2),
	telno varchar(10),
	primary key(caterer)
);

#the name of the caterer has been turned into a primary key
#new attributes have been added which records number of people to be catered and price for catering the event
create table HasCatering (
	roomName varchar(50),
	reservedDate date,
	startTime time,
	caterer varchar(50),
	peopleToBeCatered int,
	cateringPayment numeric(7,2),
	primary key(roomName, reservedDate, startTime, caterer),
	foreign key(caterer) references Catering(caterer),
	foreign key(roomName ,reservedDate, startTime) references EventDetails(roomName, reservedDate, startTime)
);

create table HasSetup (
	roomName varchar(50),
	reservedDate date,
	startTime time,
	setupRequested varchar(15),
	comments varchar(50),
	primary key(roomName, reservedDate, startTime, setupRequested),
	foreign key(roomName ,reservedDate, startTime) references EventDetails(roomName, reservedDate, startTime)
);

#date of payment has been turned into a primary key
#added a new foreign key deposit from RequestForms
create table PaymentRecord (
	orderNo int unsigned,
	dateCollected date,
	feeToCollect numeric(10,2),
	primary key(orderNo, dateCollected),
	foreign key(orderNo) references RequestForms(orderNo)
);

#date of cancellation has been turned into a primary key
#a new attribute added which records the date money was refunded
create table CancellationRecord (
	orderNo int unsigned,
	dateCancelled date,
	canRefund boolean,
	refundAmount numeric(10,2) default 0,
	primary key(orderNo, dateCancelled),
	foreign key(orderNo) references RequestForms(orderNo)
);

#trigger statements
delimiter //
create trigger deleter after insert on CancellationRecord
	for each row
	begin
		delete from HasCatering where (roomName, reservedDate, startTime) = (select roomName, reservedDate, startTime from EventDetails where orderNo = new.orderNo);
		delete from HasSetup where (roomName, reservedDate, startTime) = (select roomName, reservedDate, startTime from EventDetails where orderNo = new.orderNo);
		delete from EventDetails where orderNo = new.orderNo;
	end // 
delimiter ;



#insert statements

insert into RoomRates values('50m Competition Pool', 150.00);
insert into RoomRates values('Administration Conference Room', 200.00);
insert into RoomRates values('Lobby', 100.00);
insert into RoomRates values('MAC Gymnasium', 100.00);
insert into RoomRates values('Basketball Court 1', 300.00);
insert into RoomRates values('Racquetball Court 1', 400.00);
insert into RoomRates values('Squash Court 1', 400.00);
insert into RoomRates values('Studio 112', 200.00);
insert into RoomRates values('Studio 227A', 600.00);
insert into RoomRates values('25yd Instructional Pool', 150.00);
insert into RoomRates values('Green Roof', 125.00);
insert into RoomRates values('Game Room', 110.00);
insert into RoomRates values('Indoor Track', 275.00);
insert into RoomRates values('Basketball Court 2', 300.00);
insert into RoomRates values('Racquetball Court 2', 400.00);
insert into RoomRates values('Squash Court 2', 500.00);
insert into RoomRates values('Studio 158', 300.00);
insert into RoomRates values('Studio 229B', 200.00);

insert into StaffOnDuty values('2019-11-20','Victor Von Doom');
insert into StaffOnDuty values('2019-11-21','Harry Potter');
insert into StaffOnDuty values('2019-11-24','Victor Von Doom');
insert into StaffOnDuty values('2019-11-23','Harry Potter');
insert into StaffOnDuty values('2019-11-25','Victor Von Doom');
insert into StaffOnDuty values('2019-12-21','Elizabeth Windsor');
insert into StaffOnDuty values('2019-12-05','Elizabeth Windsor');

insert into Catering values('CSU Catering', 100.00, '333-4444');
insert into Catering values('Aladdin Catering', 50.00, '555-6666');
insert into Catering values('Buffet Catering', 20.00, '666-777');

insert into PersonalData values('Victor Frankenstein', 'franken@coldmail.com', '123-4567');
insert into PersonalData values('Henry Jekyll', 'hyde@yahoo.com', '891-0111');
insert into PersonalData values('Jack Merridew', 'jackmew@island.com', '213-1415');
insert into PersonalData values('Kafka Tamura', 'kafka@shore.com', '161-7181');
insert into PersonalData values('Huckleberry Finn', 'hfinn@fence.com', '920-2122');
insert into PersonalData values('Oliver Twist', 'twisto@another.com', '232-4252');

#Interface Queries

insert into RequestForms(activityName, name, email, dateOfRequest, deposit, rentalPriceTotal)
	values('Carsor ACLE', 'Victor Frankenstein', 'franken@coldmail.com', '2019-11-20', 100.00, 3110.00);
insert into EventDetails values('Game Room', '2019-12-07', '13:00:00', '13:15:00', '13:45:00', '14:00:00', 55, 20, (select max(orderNo) from RequestForms));
insert into HasCatering values('Game Room', '2019-12-07', '13:00:00', 'CSU Catering', 30, 3000.00);
insert into HasSetup values('Game Room', '2019-12-07', '13:00:00', 'Lecture Style', 'Use brown chairs');

insert into RequestForms(activityName, name, email, dateOfRequest, deposit, rentalPriceTotal)
	values('GPs ACLE', 'Jack Merridew', 'jackmew@island.com', '2019-11-21', 100.00, 110.00);
insert into EventDetails values('Game Room', '2019-12-08', '13:00:00', '13:15:00', '13:45:00', '14:00:00', 30, 30, (select max(orderNo) from RequestForms));
insert into HasSetup values('Game Room', '2019-12-08', '13:00:00', 'Classroom Style', 'Use brown chairs');

insert into RequestForms(activityName, name, email, dateOfRequest, deposit, rentalPriceTotal)
	values('Bball Showdown', 'Huckleberry Finn', 'hfinn@fence.com', '2019-11-24', 100.00, 1800.00);
insert into EventDetails values('Basketball Court 1', '2019-12-07', '14:00:00', '14:15:00', '14:45:00', '15:00:00', 25, 40, (select max(orderNo) from RequestForms));
insert into HasCatering values('Basketball Court 1', '2019-12-07', '14:00:00', 'Aladdin Catering', 30, 1500.00);

insert into RequestForms(activityName, name, email, dateOfRequest, deposit, rentalPriceTotal)
	values('Orphan Dance Off', 'Oliver Twist', 'twisto@another.com', '2019-11-23', 100.00, 200.00);
insert into EventDetails values('Studio 112', '2019-12-17', '13:00:00', '13:15:00', '13:45:00', '14:00:00', 5, 10, (select max(orderNo) from RequestForms));

insert into RequestForms(activityName, name, email, dateOfRequest, deposit, rentalPriceTotal)
	values('Ballet by Victor', 'Victor Frankenstein', 'franken@coldmail.com', '2019-11-24', 100.00, 300.00);
insert into EventDetails values('Studio 158', '2019-12-19', '13:00:00', '13:15:00', '13:45:00', '14:00:00', 22, 13, (select max(orderNo) from RequestForms));
insert into HasSetup values('Studio 158', '2019-12-19', '13:00:00', 'Other', 'Clear the floor');

insert into RequestForms(activityName, name, email, dateOfRequest, deposit, rentalPriceTotal)
	values('Night Swimming Lessons', 'Kafka Tamura', 'kafka@shore.com', '2019-11-25', 100.00, 150.00);
insert into EventDetails values('50m Competition Pool', '2019-12-27', '17:00:00', '17:15:00', '18:45:00', '19:00:00', 20, 10, (select max(orderNo) from RequestForms));

insert into RequestForms(activityName, name, email, dateOfRequest, deposit, rentalPriceTotal)
	values('Jack\'s Birthday Partry', 'Henry Jekyll', 'hyde@yahoo.com', '2019-11-23', 100.00, 600.00);
insert into EventDetails values('Lobby', '2019-12-01', '13:00:00', '13:15:00', '13:45:00', '14:00:00', 20, 10, (select max(orderNo) from RequestForms));
insert into HasCatering values('Lobby', '2019-12-01', '13:00:00', 'Aladdin Catering', 10, 500.00);
insert into HasSetup values('Lobby', '2019-12-01', '13:00:00', 'Other', 'Balloons');

insert into CancellationRecord values(2, '2019-12-03', 0, 0.00);
insert into CancellationRecord values(4, '2019-12-03', 1, 100.00);
insert into CancellationRecord values(6, '2019-12-05', 1, 100.00);

insert into PaymentRecord values(1, '2019-12-01', 3010.00);
insert into PaymentRecord values(3, '2019-12-02', 1700.00);
insert into PaymentRecord values(5, '2019-12-03', 200.00);