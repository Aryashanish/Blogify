const { Router } = require("express");
const { blogModel } = require("../models/blog");
const { commentModel } = require("../models/comment");
const multer = require("multer");
const path = require("path");

const blogrouter = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('./public/uploads/'))
    },
    filename: function (req, file, cb) {
        const uniquefilename = `${Date.now()}-${file.originalname}`;
      cb(null,  uniquefilename)
    }
  })
  
  const upload = multer({ storage: storage })

blogrouter.get("/add-blog", (req, res) => {
    res.render("addblog", {
        user: req.user
    });
})

blogrouter.get("/:id", async (req, res) => {
  const blog = await blogModel.findById(req.params.id).populate("createdBy");
  const comments = await commentModel.find({ blogId: req.params.id }).populate("createdBy");
  // console.log(comments);
  // console.log(blog)
  return res.render("blog", {
    user: req.user,
    message: '',
    blog,
    comments,
  })
})

blogrouter.post("/",upload.single('coverImg'), async (req, res) => {
    const { title, body } = req.body;
    const result = await blogModel.create({
        title: title,
        body: body,
        createdBy: req.user._id,
        coverImgURL: `/uploads/${req.file.filename}`,
    })
    // console.log(result);
    res.redirect("/");
})


blogrouter.post("/comment/:blogId", async (req, res) => {
  const result = await commentModel.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);
})


module.exports = {blogrouter};