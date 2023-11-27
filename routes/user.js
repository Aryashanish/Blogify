const { Router } = require("express");
const { userModel } = require("../models/user");

const router = Router();

router.get("/signup", (req, res) => {
    return res.render("signup");
})

router.get("/signin", (req, res) => {
    return res.render("login",{message : ''});
})

router.post("/signup", async (req, res) => {
    const { fullname, email, password } = req.body;
    // console.log(fullname);
    // console.log(email);
    console.log(password);
    if (!fullname ||
        !email ||
        !password)
        return res.render("signup");
    
    const result = await userModel.create({
         fullname,
         email,
         password
     })
    // console.log(result);
    res.render("login",{message : ''});
})

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        // console.log(req.body);
        const token = await userModel.matchpassword(email, password);
        // console.log(token);
        return res.cookie("token", token).redirect("/");
    } catch (err) {
        return res.render("login", {
            message: "Incorrect Email or Password",
        })
    };
});

router.get("/logout", (req, res) => {
    res.clearCookie("token").redirect("/");
})

module.exports = {router};