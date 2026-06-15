const Car = require("../models/cardata");
const http = require("http");
const https = require("https");
const Booking = require("../models/booking");
const favourites = require("../models/favourites");
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
   res.render("host/addcar", { content: "ADD CAR AND GET GREAT DEALS" });
};

const postcar = async (req, res, next) => {
   const { carName, carNo, carPhoto, carRate, carDescription } = req.body;
   let photoUrl = (carPhoto || "").trim();
   const description = (carDescription || "").trim();

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

   const newCar = new Car(carName, carNo, photoUrl, carRate, description);
   newCar.save();

   res.render("host/caradded", { content: "thank you for adding" });
};

const getcar = (req, res, next) => {
   const lcar = Car.fetchAll((lcar) => {
      res.render("user/home", { lcar: lcar });
   });
};
const gethostview=(req, res, next) => {
   Booking.fetchAll((bookings) => {
      res.render("host/hostview", { bookings: bookings.reverse() });
   });
};
const getManageCar = (req, res) => {
   Car.fetchAll((lcar) => {
      res.render("host/manage-car", { lcar: lcar.reverse() });
   });
};
const getEditCar = (req, res) => {
   const carID = req.params.carID;
   const editing = req.query.editing
      ? req.query.editing.toLowerCase() === "true"
      : true;
   console.log(carID, editing);
   Car.FindBy(carID, (car) => {
      if (!car) {
         return res.redirect("/host/");
      }
      res.render("host/editcar",{car});
      console.log(car)
      editing:editing;
   });
};

const getAdminPanel = (req, res) => {
   Car.fetchAll((cars)=>{
   res.render("host/admin-panel",{cars});
   });
};

const getMyBooking = (req, res) => {
   Booking.fetchAll((bookings) => {
      res.render("user/my-booking", { content: "HERE ARE YOUR BOOKED CARS", bookings: bookings.reverse() });
   });
};

const bookcar=(req,res)=>{
    const { carName, carNo, carPhoto, carRate } = req.body;
   const booking = new Booking({
      name: carName,
      cno: carNo,
      photoUrl: carPhoto,
      carRate: carRate,
   });
   booking.save();
   res.redirect("/my-booking");
};

const getFavList = (req, res) => {
    favourites.getfavourites((favIds) => {
         Car.fetchAll((cars) => {
             const favList = cars.filter((car) => favIds.includes(car.id));
             res.render("user/favourites", { content: "YOUR FAVOURITES", favourites: favList });
         });
    });
};
const postfavourites = (req, res,next) => {
   
   favourites.addfavourites(req.body.id ,error=>{
      if(error){
         console.log("error ",error);
      }
      res.redirect("/favourites");
   })
};
const getfavourites = (req, res) => {
   favourites.getfavourites((favIds) => {
      Car.fetchAll((cars) => {
         const favList = cars.filter((car) => favIds.includes(car.id));
         res.render("user/favourites", { content: " HERE ARE YOUR FAVOURITES CARS ", favourites: favList });
      });
   });
};
const getCarAdded = (req, res) => {
   res.render("host/caradded");
};
const acceptBooking = (req, res) => {
   const { bookedat } = req.params;
   Booking.acceptByBookedAt(bookedat, () => {
      res.redirect("/host/accept");
   });
};
const getAcceptView=(req,res)=>{
   res.render("host/accept")
}

const deleteBooking = (req, res) => {
   const { bookedat } = req.params;
   Booking.deleteByBookedAt(bookedat, () => {
      res.redirect("/host/");
   });
};
const potbookcar=(req,res,next)=>{
   const { carName, carNo, carPhoto,carRate} = req.body;
   
   }
   const getcardetails=(req,res)=>{
      const carID=req.params.carID;
      Car.FindBy(carID,car=>{
         if(!car){
            console.log("error");
            Car.fetchAll(lcar=>{            
               res.render("user/home", { lcar: lcar });})

         }
         else{
           console.log("car details",car);
           res.render("user/details",{content : "get detailed  overview of ur car", car});
         }
        
      })
    
   }
     const deleteCar=(req,res)=>{
         const CarID=req.params.CarID;
         console.log("Deleted id",CarID)
         Car.Deleteby(CarID,error=>{
            if(error){
               console.log("kya chedha bhonnsdi");
            }
            res.redirect("/host/manage-car");
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
   postfavourites,
   getcardetails,
   deleteCar,
   getCarAdded,
   getEditCar,
   getfavourites,
   acceptBooking,
   deleteBooking,
   
};