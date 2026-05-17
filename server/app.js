const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helper/jwt.js');


app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());

// Public Routes
const searchRoutes = require('./routes/search.js')
app.use(`/api/search`, searchRoutes);

app.use(authJwt());



// //Routes
const userRoutes = require('./routes/user.js')
const productRoutes = require('./routes/products.js')
const categoryRoutes = require('./routes/categories.js')
const subCatSchema = require('./routes/subCat.js')
const productWeightRoutes = require('./routes/productWEIGHT.js')
const productRAMSRoutes = require('./routes/productRAMS.js')
const productSIZESRoutes = require('./routes/productSIZE.js')
const productCARTRoutes = require('./routes/cart.js')
const productReviewsRoutes = require('./routes/productReviews.js')
const myListSchema = require('./routes/myList.js')
const ordersRoutes = require('./routes/orders.js')
const homeBannerSchema = require('./routes/homeBanner.js')
const recommendationsRoutes = require('./routes/recommendations.js')
const aiRoutes = require('./routes/ai.js')


app.use("/api/user", userRoutes);
app.use('/uploads', express.static('uploads'));
app.use(`/api/category`, categoryRoutes);
app.use(`/api/subCat`, subCatSchema);
app.use(`/api/products`, productRoutes);
app.use(`/api/productWEIGHT`, productWeightRoutes);
app.use(`/api/productRAMS`, productRAMSRoutes);
app.use(`/api/productSIZE`, productSIZESRoutes);
app.use(`/api/cart`, productCARTRoutes);
app.use(`/api/myList`, myListSchema);
app.use(`/api/productReviews`, productReviewsRoutes);
app.use(`/api/orders`, ordersRoutes);
app.use(`/api/homeBanner`, homeBannerSchema);
app.use(`/api/recommendations`, recommendationsRoutes);
app.use(`/api/ai`, aiRoutes);

//Database
mongoose.connect(process.env.CONNECTION_STRING, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
    .then(() => {
        console.log('DATABASE IS READY...')
    })
    .catch((err) => {
        console.log("DB ERROR")
        console.log(err);
    })

// app.use(express.json());

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});




// Global Error Handler
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ message: "The user is not authorized" })
    }

    if (err.name === 'ValidationError') {
        //  validation error
        return res.status(401).json({ message: err })
    }

    // default to 500 server error
    return res.status(500).json(err);
})


//server
app.listen(process.env.PORT, () => {
    console.log(`server is running http://localhost:${process.env.PORT}`);
});



