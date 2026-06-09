const fs=require('fs');
const path=require('path');
const rootdir=require("../utils/pathutil")

const bookingPath = path.join(rootdir, 'data', 'booking.json');

const readBookings = (callback) => {
    fs.readFile(bookingPath, (err, data) => {
        if (err) {
            callback([]);
            return;
        }

        try {
            callback(JSON.parse(data));
        } catch (parseError) {
            callback([]);
        }
    });
};

const writeBookings = (bookings, callback) => {
    fs.writeFile(bookingPath, JSON.stringify(bookings), (err) => {
        if (callback) {
            callback(err);
        }
    });
};

module.exports = class booking{
    constructor(car,bookedat){
        this.car=car;
        this.bookedat=bookedat|| new Date().toISOString();
    }
    save() {
        booking.fetchAll((bookings)=>{
            bookings.push(this);
            writeBookings(bookings, (err) => {
                if(err){
                    console.log("q ree mc",err);
                }
            });
        });  
    }
    static fetchAll(callback){
       readBookings(callback);
     }

     static acceptByBookedAt(bookedAt, callback) {
        booking.fetchAll((bookings) => {
            const updatedBookings = bookings.map((entry) => {
                if (entry.bookedat === bookedAt) {
                    return { ...entry, status: "accepted" };
                }
                return entry;
            });

            writeBookings(updatedBookings, (err) => {
                if (callback) {
                    callback(err);
                }
            });
        });
     }

     static deleteByBookedAt(bookedAt, callback) {
        booking.fetchAll((bookings) => {
            const updatedBookings = bookings.filter((entry) => entry.bookedat !== bookedAt);

            writeBookings(updatedBookings, (err) => {
                if (callback) {
                    callback(err);
                }
            });
        });
     }
};