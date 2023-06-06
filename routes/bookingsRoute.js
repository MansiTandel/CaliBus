const router = require("express").Router();
const User = require('../models/usersModel');
const authMiddleware = require("../middlewares/authMiddleware");
const Booking = require("../models/bookingsModel");
const Bus = require("../models/busModel");
const stripe = require("stripe")(process.env.stripe_key);
const {v4:uuidv4} = require("uuid");


// Book a Seat

router.post("/book-seat", authMiddleware, async (req, res) => {
    try {
        const newBooking = new Booking({
            ...req.body,
            user: req.body.userId,
        });
        await newBooking.save();
        const bus = await Bus.findById(req.body.bus);
        bus.seatsBooked = [...bus.seatsBooked, ...req.body.seats];
        await bus.save();
        res.status(200).send({
            message: "Booking successful",
            data: newBooking,
            success: true,
        });
    } catch (error) {
        res.status(500).send({
            message: "Booking failed",
            data: error,
            success: false,
        });

    }
});



//make a payment
router.post("/make-payment", authMiddleware, async (req, res) => {
    try {
        const { token, amount } = req.body;
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });
        const payment = await stripe.charges.create({
            amount: amount,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
        },
         {
            idempotencyKey: uuidv4(),  // not charging again for same transaction
        });
        if (payment) {
            
                res.status(200).send({
                    message: "Successful payment",
                    data: {
                        transactionId: payment.source.id,
                    },
                    success: true,
                });
            } else {
                res.status(500).send({
                    message: "Payment failed",
                    data: error,
                    success: false,
                });
            }
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:"Payment failed",
            data:error,
            success: false,
        });
     }
});

// get bookings by user id
router.post("/get-bookings-by-user-id", authMiddleware, async (req, res) => {
    try {
        const bookings = await Booking.find({user: req.body.userId})
        .populate("bus")
        .populate("user");
        const user = await User.findById(req.body.userId); // Fetch user by ID
        res.status(200).send({
            message: "Bookings fetched successfully",
            data:bookings,
            success:true,
            userName: user.name, // Include user's name in the response
        });



    } catch(error){
        res.status(500).send({
            message: "Couldn't fetch Bookings",
            data: error,
            success: false,
        });

    }
});

// get all bookings by users
router.post("/get-all-bookings", authMiddleware, async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate("bus").populate("user");
        res.status(200).send({
            message: "Bookings fetched successfully",
            data:bookings,
            success:true,
        });



    } catch(error){
        res.status(500).send({
            message: "Couldn't fetch Bookings",
            data: error,
            success: false,
        });

    }
});
module.exports = router;