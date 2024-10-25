import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  sold: Boolean,
  dateOfSale: String,
 
});

export const Product = mongoose.model('Product', productSchema);
