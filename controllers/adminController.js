const Category = require('../models/Category');
const Bank = require('../models/Bank');
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

   viewItem: (req, res) => {
      res.render('admin/item/index');
   },

   viewBooking: (req, res) => {
      res.render('admin/booking/index');
   }
}