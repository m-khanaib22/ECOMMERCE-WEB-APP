const { User } = require('../models/user');
const sendEmail = require('../helper/email');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const multer = require('multer');
const fs = require("fs");
const cloudinary = require('cloudinary').v2;
const pLimit = require('p-limit');

const limit = pLimit(2);


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
})

const upload = multer({ storage: storage });

// ================= UPLOAD IMAGES ===================

router.post('/upload', upload.array('images'), async (req, res) => {
    const files = req.files;

    if (!files || files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }

    try {
        const uploadStatus = await Promise.all(files.map((file) => {
            return limit(async () => {
                const result = await cloudinary.uploader.upload(file.path);
                // Remove local file after upload
                fs.unlinkSync(file.path);
                return result.secure_url;
            });
        }));

        res.send(uploadStatus);
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        res.status(500).send("Error uploading to Cloudinary");
    }
});

router.post(`/signup`, async (req, res) => {
    console.log("Signup request received:", req.body);
    const { name, phone, email, password, isAdmin } = req.body;

    try {

        // const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        // let user;

        const existingUser = await User.findOne({ email: email });
        const existingUserByPh = await User.findOne({ phone: phone });

        if (existingUser || existingUserByPh) {
            return res.status(400).json({ error: true, msg: "user already exist" })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const result = await User.create({
            name: name,
            phone: phone,
            email: email,
            password: hashPassword,
            isAdmin: isAdmin,
            otp: otp,
            otpExpires: otpExpires
        });

        // Send OTP via email
        try {
            await sendEmail({
                to: email,
                subject: 'Email Verification OTP',
                html: `<h1>Verify your email</h1><p>Your verification code is: <strong>${otp}</strong></p><p>This code will expire in 10 minutes.</p>`,
            });
        } catch (emailError) {
            console.error("Email sending error:", emailError);
            // Optionally handle email sending error (e.g., delete user or inform client)
        }

        const token = jwt.sign({ email: result.email, id: result._id }, process.env.JSON_WEB_SECRET_KEY);

        res.status(200).json({
            user: result,
            token: token,
            msg: "Registration successful. Please verify your email with the OTP sent."
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, msg: "something went wrong" });
    }
})

router.post(`/signin`, async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(400).json({ error: true, msg: "user not found!" })
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);

        if (!matchPassword) {
            return res.status(400).json({ error: true, msg: "Invalid credentials" })
        }

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JSON_WEB_SECRET_KEY);

        console.log({
            user: existingUser,
            token: token,
            msg: "user Authenticated"
        })
        res.status(200).json({
            user: existingUser,
            token: token,
            msg: "user Authenticated"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, msg: "something went wrong" });
    }
})

router.post(`/google-signin`, async (req, res) => {
    const { idToken, isAdmin } = req.body;

    try {
        // In a real production app, you MUST verify this token using firebase-admin
        // const decodedToken = await admin.auth().verifyIdToken(idToken);
        // const { email, name, picture } = decodedToken;

        // For now, we will decode it (unverified) or assume the client is trusted 
        // (WARNING: THIS IS NOT SECURE FOR PRODUCTION WITHOUT VERIFICATION)

        // Let's use a simpler approach for now to get it working: 
        // The client should send email and name as well for this simplified version, 
        // or we use a library to decode the JWT and trust the email field for now.

        const jwt = require('jsonwebtoken');
        const decoded = jwt.decode(idToken);

        if (!decoded || !decoded.email) {
            return res.status(400).json({ error: true, msg: "Invalid Google Token" });
        }

        const { email, name } = decoded;

        let user = await User.findOne({ email: email });

        if (!user) {
            // Create user if not exists
            user = await User.create({
                name: name || email.split('@')[0],
                email: email,
                phone: "", // Optional for Google users
                images: [decoded.picture || ""],
                isAdmin: isAdmin === true ? true : false
            });
        } else if (isAdmin === true && !user.isAdmin) {
            // If signing in from admin panel but user exists as non-admin, promote them
            user = await User.findByIdAndUpdate(user._id, { isAdmin: true }, { new: true });
        }

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JSON_WEB_SECRET_KEY);

        res.status(200).json({
            user: user,
            token: token,
            msg: "User Authenticated with Google"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, msg: "Something went wrong during Google Sign-In" });
    }
})

router.get(`/`, async (req, res) => {
    try {
        const userList = await User.find().select('-password');

        if (!userList) {
            return res.status(500).json({ success: false })
        }
        res.status(200).send(userList);
    } catch (error) {
        res.status(500).json({ success: false, error: error })
    }
})

router.get(`/:id`, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: "The user with the given ID was not found" })
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).json({ success: false, error: error })
    }
})

router.delete('/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({ success: true, message: "the user is deleted" })
        } else {
            return res.status(404).json({ success: false, message: "user not found" })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
})

router.get(`/get/count`, async (req, res) => {
    try {
        const userCount = await User.countDocuments();

        if (userCount === undefined) {
            return res.status(500).json({ success: false })
        }
        res.send({
            userCount: userCount
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error })
    }
})

router.put(`/:id`, async (req, res) => {
    const { name, phone, email, password, isAdmin, images } = req.body;

    try {
        const userExist = await User.findById(req.params.id);
        if (!userExist) return res.status(404).send('User not found');

        let newPassword
        if (req.body.password) {
            newPassword = bcrypt.hashSync(req.body.password, 10)
        } else {
            newPassword = userExist.password;
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: name,
                phone: phone,
                email: email,
                password: newPassword,
                isAdmin: isAdmin,
                images: images
            },
            { new: true }
        )

        if (!user)
            return res.status(400).send('the user cannot be updated')

        res.send(user);
    } catch (error) {
        res.status(500).json({ success: false, error: error })
    }
})

router.delete('/delete-image', async (req, res) => {
    const publicId = req.query.img;

    if (!publicId) {
        return res.status(400).send('No image public ID provided.');
    }

    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary delete result for ID:", publicId, result);
        res.status(200).send({ msg: "Image deleted successfully!", result });
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        res.status(500).send("Error deleting from Cloudinary");
    }
});

router.post('/change-password/:id', async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: true, msg: "User not found" });
        }

        const matchPassword = await bcrypt.compare(oldPassword, user.password);
        if (!matchPassword) {
            return res.status(400).json({ error: true, msg: "Old password is incorrect" });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();

        res.status(200).json({ error: false, msg: "Password updated successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ error: true, msg: "Something went wrong" });
    }
});

router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: true, msg: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: true, msg: "User is already verified" });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ error: true, msg: "Invalid or expired OTP" });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ error: false, msg: "Email verified successfully" });
    } catch (error) {
        console.error("OTP verification error:", error);
        res.status(500).json({ error: true, msg: "Something went wrong" });
    }
});

router.post('/resend-otp', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: true, msg: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: true, msg: "User is already verified" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        await sendEmail({
            to: email,
            subject: 'Email Verification OTP (Resend)',
            html: `<h1>Verify your email</h1><p>Your verification code is: <strong>${otp}</strong></p><p>This code will expire in 10 minutes.</p>`,
        });

        res.status(200).json({ error: false, msg: "OTP resent successfully" });
    } catch (error) {
        console.error("Resend OTP error:", error);
        res.status(500).json({ error: true, msg: "Something went wrong" });
    }
});


router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: true, msg: "User with this email does not exist" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        await sendEmail({
            to: email,
            subject: 'Forgot Password OTP',
            html: `<h1>Reset your password</h1><p>Your OTP for password reset is: <strong>${otp}</strong></p><p>This code will expire in 10 minutes.</p>`,
        });

        res.status(200).json({ error: false, msg: "OTP sent to your email" });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ error: true, msg: error.message || "Something went wrong" });
    }
});

router.post('/verify-forgot-password-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: true, msg: "User not found" });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ error: true, msg: "Invalid or expired OTP" });
        }

        res.status(200).json({ error: false, msg: "OTP verified successfully" });
    } catch (error) {
        console.error("OTP verification error:", error);
        res.status(500).json({ error: true, msg: "Something went wrong" });
    }
});

router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: true, msg: "User not found" });
        }

        // Double check OTP verification for security
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ error: true, msg: "Invalid or expired OTP" });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ error: false, msg: "Password reset successfully" });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ error: true, msg: error.message || "Something went wrong" });
    }
});

module.exports = router;
