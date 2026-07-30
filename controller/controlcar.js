const Car = require("../models/cardata");
const http = require("http");
const https = require("https");
const path=require('path')
const rootdir=require("../utils/path-util")

const Favourite = require("../models/favourites");

const booking = require("../models/booking");
const lcar = [];

const isImageUrl = (value) => /\.(png|jpe?g|webp|gif|svg)(\?|#|$)/i.test(value);

const fetchHtml = (url) => new Promise((resolve, reject) => {
   const client = url.startsWith("https") ? https : http;
   client
      .get(url, (res) => {
         if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            const nextUrl = new URL(res.headers.location, url).toString();
            return resolve(fetchHtml(nextUrl));
         }
         let data = "";
         res.setEncoding("utf8");
         res.on("data", (chunk) => {
            data += chunk;
         });
         res.on("end", () => resolve(data));
      })
      .on("error", reject);
});

const extractImageFromHtml = (html) => {
   const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["'][^>]*>/i);
   if (ogImageMatch && ogImageMatch[1]) {
      return ogImageMatch[1];
   }

   const twitterImageMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["'][^>]*>/i);
   if (twitterImageMatch && twitterImageMatch[1]) {
      return twitterImageMatch[1];
   }

   return "";
};

const getaddcar = (req, res, next) => {
   res.render("host/addcar", {
      isLoggedIN: req.session.isLoggedIN,
      content: "ADD CAR AND GET GREAT DEALS"
   });
};

const postcar = async (req, res, next) => {
   console.log(req.body)
   const { carName, carNo, carPhoto, carRate, carDescription } = req.body;
   console.log(carName, carNo, carPhoto, carRate, carDescription )
   console.log(req.file)
    
   let photoUrl = ""
   const description = (carDescription || "").trim();
    
if (req.file) {
    photoUrl = "/uploads/" + req.file.filename;
}
else{
    photoUrl = (carPhoto || "").trim();
}
   if (photoUrl && !isImageUrl(photoUrl)) {
      try {
         const html = await fetchHtml(photoUrl);
         const extracted = extractImageFromHtml(html);
         if (extracted) {
            photoUrl = extracted;
         }
      } catch (err) {
         photoUrl = "";
      }
   }

   const newCar = new Car({carName, carNo,carRate, photoUrl, description,owner: req.session.user._id
});
   newCar.save().then(()=>{
      console.log(lcar[0]);
      console.log('car added succesfully');
   });

   res.render("host/caradded", {
      isLoggedIN: req.session.isLoggedIN,
      content: "thank you for adding"
   });
};

const getcar = (req, res, next) => {

    Car.find().then((cars)=>{
      res.render("user/home", {
         isLoggedIN: req.session.isLoggedIN,
         lcar: cars
      })
   })
      console.log("session:",req.session)

};

const gethostview=(req, res, next) => {
   booking.find().then((bookings)=>{
      res.render("host/hostview", {
         isLoggedIN: req.session.isLoggedIN,
         bookings
      });
   });
};
const getManageCar = (req, res) => {
  Car.find(({
   owner: req.session.user._id
})).then((cars)=>{
      res.render("host/manage-car", {
         isLoggedIN: req.session.isLoggedIN,
         lcar: cars
      })
   })

};
const getEditCar = (req, res,next) => {
   const id = req.params.id;
   const editing = req.query.editing
      ? req.query.editing.toLowerCase() === "true"
      : true;
   console.log(id, editing);
   Car.findById(id).then(car => {
      if (!car) {
         return res.redirect("/host/");
      }
      res.render("host/editcar", {
         isLoggedIN: req.session.isLoggedIN,
         car,
         editing
      });
      console.log(car)
   });
};
const postEditcar=(req,res)=>{
   const id=req.params.id
    const { carName, carNo,carRate,carPhoto, carDescription } = req.body;
    Car.findById(id).then((car)=>{
   car.carName=carName;
   car.carNo=carNo;
   car.carRate=carRate;
  
   car.description=carDescription;
   if(req.file){
      car.photoUrl= "/uploads/"+req.file.filename
   }
   console.log(car);
   return car.save()
   }) .then((car) => {
        return Favourite.updateMany(
            { carNo: car.carNo },
            {
                carName: car.carName,
                carRate: car.carRate,
                photoUrl: car.photoUrl
            }
        );
    })
   .then(() => {
            console.log("Car edited successfully");
            res.redirect("/host/manage-car");
        }).catch(err=>{
      console.log("err while finding car",err);
      res.redirect("/host/")
    })
     
}
const getAdminPanel = (req, res) => {
    Car.find().then(([cars])=>{
         res.render("host/admin-panel", {
            isLoggedIN: req.session.isLoggedIN,
            cars: cars
         })
   })

};

const getMyBooking = (req, res) => {
   booking.find().then(bookings=>{
      res.render("user/my-booking", {
         isLoggedIN: req.session.isLoggedIN,
         content: "HERE ARE YOUR BOOKED CARS",
         bookings: bookings.reverse()
      });
   });
};

const bookcar=(req,res)=>{
     const id = req.params.id;
     console.log(id);
    const { carName, carNo,photoUrl, carRate,bookedAt } = req.body;
   Car.findById(id)
   .then((car)=>{

    if (!car) {
       
        return res.status(404).send("Car not found");
        res.redirect("/")
    }


      const newBooking = new booking({
         carName:car.carName,
         carNo:car.carNo,
         photoUrl:car.photoUrl,
         carRate:car.carRate,
         bookedAt: new Date()

   });
    
        console.log(newBooking)
      return newBooking.save();
   })
   .then(()=>{
      res.redirect("/my-booking");
   })
   .catch((err)=>{
      console.log(err);
   });
};
const potbookcar=(req,res,next)=>{
   booking.find()
   .then((bookings)=>{
      res.render("my-booking", {
         isLoggedIN: req.session.isLoggedIN,
         bookings: bookings
      });
   }).catch((err) => {
            console.log(err);
            res.status(500).send("Something went wrong");
        });

   }
   
const getFavList = (req, res) => {
    favourites.getfavourites.then(([favourites]) => {
              Car.find().then(([cars])=>{
             const favList = cars.filter((car) => favIds.includes());
                   res.render("user/favourites", {
                      isLoggedIN: req.session.isLoggedIN,
                      content: "YOUR FAVOURITES",
                      favourites: favList
                   });
         });
    });
};

const addfavourites = (req, res) => {
    const id = req.params.id;

 Car.findById(id)
 .then(car=>{
    const favourite = new Favourite({
      carName: car.carName,
       carNo:car.carNo,
        carRate:car.carRate,
       photoUrl:car.photoUrl
      
 });
    console.log(favourite)
    return favourite.save();

 })
 .then(()=>{
    res.redirect("/favourites");
 })
 .catch(err=>{
    console.log(err);
 });
};
const deletefavourites=(req,res) =>{
  const id=req.params.id;
         Favourite.findByIdAndDelete(id).then(()=>{
            res.redirect("/favourites");
         })
         .catch((err)=>{
            console.log(err)
         })
          
}
const getfavourites = (req,res)=>{

 Favourite.find()
 .then(favourites=>{

   res.render("user/favourites", {
      favourites: favourites
   });

 });

};
const getCarAdded = (req, res) => {
   res.render("host/caradded");
};
const acceptBooking = (req, res) => {
   const id = req.params.id;
  booking.findById(id).then((bookingData)=>{
     bookingData.status="accepted";
     return bookingData.save()
  }).then(()=>{
   res.render("host/accept")
  }).catch(err=>{
    console.log(err)
  })
    
};
const getAcceptView=(req,res)=>{
   res.render("host/accept")
}

const getRejectView=(req,res)=>{
   res.render("host/reject")
}
const deleteBooking = (req, res) => {
   const id = req.params.id;
   booking.findById(id).then((bookingData)=>{
      bookingData.status="rejected"
     return  bookingData.save()
      
   }).then(()=>{
      res.redirect("/host/reject")
   }).catch((error)=>{
        console.log("kya chedha bhonnsdi");
   })
};

const getcardetails= (req,res)=>{
  const id=req.params.id;
    Car.findById(id).then(car=>{
      if(!car){
         res.redirect("/");
      }
      return Favourite.findOne({carNo:car.carNo}).then(favourite=>{
          car.isFavourite = !!favourite;

                    res.render("user/details", {
                        car: car
                    });
      })
    }).catch(err=>{
      console.log(err);
    })
}
const getrules=[(req,res,next)=>{
   console.log(req.params);
    console.log(req.params.carId);

   if(!req.session.isLoggedIN){
     return res.redirect("/login")
   }
   next()
},
  (req,res,next)=>{
   const carId=req.params.carId;
   const rulesfilename='carRules.pdf'
   const filepath=path.join(rootdir,'rules',rulesfilename)
   res.download(filepath,'carRules.pdf')
  }
]
     const deleteCar=(req,res)=>{
         const id=req.params.CarID;
         console.log("Deleted id",id)
         Car.findByIdAndDelete(id).then(()=>{
            res.redirect("/host/manage-car");
         }).catch((error)=>{
           console.log("kya chedha bhonnsdi");
         })
      }
   
module.exports = {
   getaddcar,
   postcar,
   getcar,
   gethostview,
   getManageCar,
   getAdminPanel,
   getMyBooking,
   bookcar,
   getFavList,
   getAcceptView,
   getRejectView,
   getfavourites,
   getcardetails,
   getrules,
   deleteCar,
   getCarAdded,
   getEditCar,
   postEditcar,
   addfavourites,
   deletefavourites,
   acceptBooking,
   deleteBooking,
   
};