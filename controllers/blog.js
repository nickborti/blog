const Blog = require('../models/blog')
const Category = require('../models/category')
const Tag = require('../models/tag')

const fs = require('fs')
const formidable = require('formidable')
const slugify = require('slugify')
const {stripHtml} = require('string-strip-html')
const _ = require('lodash')

const {errorHandler} = require('../helpers/dbErrorHandler')
const {smartTrim} = require('../helpers/blog')

// const pushToBlog = () => {

// }


exports.create = (req, res) => {
    let form = new formidable.IncomingForm() // form data
    // console.log("form ", form)
    form.keepExtensions = true // if file is there in form data
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: 'Image could not upload'
            })
        }

        const {title, body, categories, tags} = fields // extract these

        if(!title || !title.length) {
            return res.status(400).json({
                error: 'Title is required'
            })
        }

        if(!body || body.length < 200) {
            return res.status(400).json({
                error: 'Content is too short'
            })
        }

        if(!categories || categories.length === 0) {
            return res.status(400).json({
                error: 'Atleast one category is required'
            })
        }

        if(!tags || tags.length === 0) {
            return res.status(400).json({
                error: 'Atleast one tag is required'
            })
        }
        
        let blog = new Blog()
        blog.title = title
        blog.body = body
        blog.excerpt = smartTrim(body, 320, ' ', ' ...')
        blog.slug = slugify(title).toLowerCase()
        blog.mtitle = `${title} | ${process.env.APP_NAME}`
        blog.mdesc = stripHtml(body.substring(0, 160)).result // first 160 characters
        blog.postedBy = req.profile._id

        let arrayOfCategories = categories && categories.split(',')
        let arrayOfTags = tags && tags.split(',')
       
        if(files.photo) {
            if(files.photo.size > 10000000) { // > 1MB in bytes
                return res.status(400).json({
                    error: 'Image should be less than 1 MB'
                })
            }
            
            blog.photo.data = fs.readFileSync(files.photo.path)
            blog.photo.contentType = files.photo.type 
        }

       blog.save((err, result) => {
           if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
           }
           
        //    res.json(result)
        Blog.findByIdAndUpdate(result._id, {$push: {categories: arrayOfCategories}}, {new: true}).exec((err, result) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            } else {
                Blog.findByIdAndUpdate(result._id, {$push: {tags: arrayOfTags}}, {new: true}).exec((err, result) => {
                    if(err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        })
                    }

                    res.json(result)
                    
                })
            }
        })
       })
    })
}