const Car = require("../models/cardata");
const http = require("http");
const https = require("https");

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
   res.render("user/addcar", { content: "ADD CAR AND GET GREAT DEALS" });
};

const postcar = async (req, res, next) => {
   const { carName, carNo, carPhoto,carRate} = req.body;
   let photoUrl = (carPhoto || "").trim();

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

   const newCar = new Car(carName, carNo, photoUrl,carRate);
   newCar.save();

   res.render("host/caradded", { content: "thank you for adding" });
};

const getcar = (req, res, next) => {
   const lcar = Car.fetchAll((lcar) => {
      res.render("user/home", { lcar: lcar });
   });
};
const getManageCar = (req, res) => {
   res.render("host/manage-car");
};

const getAdminPanel = (req, res) => {
   Car.fetchAll((cars)=>{
   res.render("host/admin-panel",{cars});
   });
};

const getMyBooking = (req, res) => {
   res.render("user/my-booking");
};

const getFavourites = (req, res) => {
   res.render("user/favourites");
};

module.exports = {
   getaddcar,
   postcar,
   getcar,
   getManageCar,
   getAdminPanel,
   getMyBooking,
   getFavourites,
};