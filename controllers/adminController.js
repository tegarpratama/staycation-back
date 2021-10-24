const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/item');
const Image = require('../models/Image');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
   viewDashboard: (req, res) => {
      res.render('admin/dashboard/index')
   },

   viewCategory: async (req, res) => {
      try {
         const category = await Category.find();
         const alertMessage = req.flash('alertMessage');
         const alertStatus = req.flash('alertStatus');
         const alert = { message: alertMessage, status: alertStatus };
         res.render('admin/category/index', {category, alert});
      } catch (err) {
         res.redirect('/admin/category');
      }
   },

   addCategory: async (req, res) => {
      try {
         const { name } = req.body;
         await Category.create({ name });
         req.flash('alertMessage', 'Success add category');
         req.flash('alertStatus', 'success');
         res.redirect('/admin/category');
      } catch (err) {
         req.flash('alertMessage', '$err.message');
         req.flash('alertStatus', 'danger');
         res.redirect('/admin/category');
      }
   },

   editCategory: async (req, res) => {
      try {
         const { id, name } = req.body;
         const category = await Category.findOne({ _id: id });
         category.name = name;
         await category.save();
         req.flash('alertMessage', 'Success update category');
         req.flash('alertStatus', 'success');
         res.redirect('/admin/category');
      } catch (err) {
         req.flash('alertMessage', '$err.message');
         req.flash('alertStatus', 'danger');
         res.redirect('/admin/category');
      }
   },

   deleteCategory: async (req, res) => {
      try {
         const { id } = req.params;
         const category = await Category.findOne({ _id: id});
         await category.remove();
         req.flash('alertMessage', 'Success delete category');
         req.flash('alertStatus', 'success');
         res.redirect('/admin/category');
      } catch(err) {
         req.flash('alertMessage', err.message);
         req.flash('alertStatus', 'danger');
         res.redirect('/admin/category');
      }
   },

   viewBank: async (req, res) => {
      try {
         const bank = await Bank.find();
         const alertMessage = req.flash('alertMessage');
         const alertStatus = req.flash('alertStatus');
         const alert = { message: alertMessage, status: alertStatus };
         res.render('admin/bank/index', { bank, alert });
      } catch (err) {
         req.flash('alertMessage', err.message);
         req.flash('alertStatus', 'danger');
         res.redirect('/admin/bank');
      }
   },

   addBank: async (req, res) => {
      try {
         const { name, nameBank, nomorRekening } = req.body;
         // console.log(req.file);
         await Bank.create({
            name,
            nameBank,
            nomorRekening,
            imageUrl: `images/${req.file.filename}`
         });
         req.flash('alertMessage', 'Success added bank');
         req.flash('alertStatus', 'success');
         res.redirect('/admin/bank');
      } catch (err) {
         req.flash('alertMessage', err.message);
         req.flash('alertStatus', 'danger');
         res.redirect('/admin/bank');
      }
   },

   editBank: async (req, res) => {
      try {
         const { id, name, nameBank, nomorRekening } = req.body;
         const bank = await Bank.findOne({ _id: id });

         // If user select new image
         if (req.file != undefined) {
            await fs.unlink(path.join(`public/${bank.imageUrl}`));
            bank.imageUrl =  `images/${req.file.filename}`
         }

         bank.name = name;
         bank.nameBank = nameBank;
         bank.nomorRekening = nomorRekening;
         await bank.save();
         req.flash('alertMessage', 'Success updated bank');
         req.flash('alertStatus', 'success');
         res.redirect('/admin/bank');
      } catch (err) {
         req.flash('alertMessage', err.message);
         req.flash('alertStatus', 'danger');
         res.redirect('/admin/bank');
      }
   },

   deleteBank: async (req, res) => {
      try {
         const { id } = req.params;
         const bank = await Bank.findOne({ _id: id });
         await fs.unlink(path.join(`public/${bank.imageUrl}`));
         await bank.remove();
         req.flash('alertMessage', 'Success deleted bank');
         req.flash('alertStatus', 'success');
         res.redirect('/admin/bank');
      } catch (err) {
         req.flash('alertMessage', err.message);
         req.flash('alertStatus', 'danger');
         res.redirect('/admin/bank');
      }
   },

   viewItem: async (req, res) => {
      try {
         const item = await Item.find()
            .populate({ path: 'imageId', select: 'id imageUrl' })
            .populate({ path: 'categoryId', select: 'id name' });
         
         const category = await Category.find();
         const alertMessage = req.flash('alertMessage');
         const alertStatus = req.flash('alertStatus');
         const alert = { message: alertMessage, status: alertStatus };
         res.render('admin/item/index', { category, alert, item, action: 'view' });
      } catch (err) {
         req.flash('alertMessage', err.message);
         req.flash('alertStatus', 'danger');
         res.redirect('/admin/item');
      }
      res.render('admin/item/index');
   },

   addItem: async (req, res) => {
      try {
         const { categoryId, title, price, city, about } = req.body;
         if (req.files.length > 0) {
            const category = await Category.findOne({ _id: categoryId });
            const newItem = {
               categoryId: category._id,
               title,
               description: about,
               price,
               city
            }
            const item = await Item.create(newItem);
            category.itemId.push({ _id: item._id });
            await category.save();
            for(let i = 0; i < req.files.length; i++) {
               const imageSave = await Image.create({ imageUrl: `images/${req.files[i].filename}`});
               item.imageId.push({ _id: imageSave._id });
               await item.save();
            }

            req.flash('alertMessage', 'Success added item');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/item');
         }
      } catch (err) {
         req.flash('alertMessage', err.message);
         req.flash('alertStatus', 'danger');
         res.redirect('/admin/item');
      }
   },

   showImageItem: async (req, res) => {
      try {
         const { id } = req.params;
         const item = await Item.findOne({ _id: id })
            .populate({ path: 'imageId', select: 'id imageUrl' })
         
         const alertMessage = req.flash('alertMessage');
         const alertStatus = req.flash('alertStatus');
         const alert = { message: alertMessage, status: alertStatus };
         res.render('admin/item/index', { alert, item, action: 'show-image' });
      } catch (err) {
         req.flash('alertMessage', err.message);
         req.flash('alertStatus', 'danger');
         res.redirect('/admin/item');
      }
   },

   showEditItem: async (req, res) => {
      try {
         const { id } = req.params;
         const item = await Item.findOne({ _id: id })
            .populate({ path: 'imageId', select: 'id imageUrl' })
            .populate({ path: 'categoryId', select: 'id name' })
         const category = await Category.find();
         const alertMessage = req.flash('alertMessage');
         const alertStatus = req.flash('alertStatus');
         const alert = { message: alertMessage, status: alertStatus };
         res.render('admin/item/index', { alert, item, category ,action: 'edit-item' });
      } catch (err) {
         req.flash('alertMessage', err.message);
         req.flash('alertStatus', 'danger');
         res.redirect('/admin/item');
      }
   },

   editItem: async (req, res) => {
      try {
         const { id } = req.params;
         const { categoryId, title, price, city, about } = req.body;
         const item = await Item.findOne({ _id: id })
            .populate({ path: 'imageId', select: 'id imageUrl' })
            .populate({ path: 'categoryId', select: 'id name' })

         if (req.files.length > 0) {
            for(let i = 0; i < item.imageId.length; i++) {
               const imageUpdate = await Image.findOne({ _id: item.imageId[i]._id });
               await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
               imageUpdate.imageUrl = `images/${req.files[i].filename}`;
               await imageUpdate.save();
            }
         }

         item.title = title;
         item.price = price;
         item.city = city;
         item.description = about;
         item.categoryId = categoryId;

         await item.save();

         req.flash('alertMessage', 'Success updated item');
         req.flash('alertStatus', 'success');
         res.redirect('/admin/item');
      } catch (err) {
         req.flash('alertMessage', err.message);
         req.flash('alertStatus', 'danger');
         res.redirect('/admin/item');
      }
   },

   deleteItem: async (req, res) => {
      try {
         const { id } = req.params;
         const item = await Item.findOne({ _id: id }).populate('imageId');
         for(let i = 0; i < item.imageId.length; i++) {
            Image.findOne({ _id: item.imageId[i]._id}).then((image) => {
               fs.unlink(path.join(`public/${image.imageUrl}`));
               image.remove();
            }).catch((err) => {
               req.flash('alertMessage', err.message);
               req.flash('alertStatus', 'danger');
               res.redirect('/admin/item');
            })
         }

         await item.remove();
         req.flash('alertMessage', 'Success deleted item');
         req.flash('alertStatus', 'success');
         res.redirect('/admin/item');
      } catch (err) {
         req.flash('alertMessage', err.message);
         req.flash('alertStatus', 'danger');
         res.redirect('/admin/item');
      }
   },

   viewBooking: (req, res) => {
      res.render('admin/booking/index');
   }
}