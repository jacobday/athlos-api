const mongoose = require("mongoose");

const PromotionSchema = mongoose.Schema({
    promotionCode: {type: String, required: true},
    promotionEnd: {type: String, required: true},
    promotionInfo: {type: String},
    promotionName: {type: String, required: true},
    promotionPercentage: {type: Number, required: true},
    promotionStart: {type: String, required: true}
});

const Promotion = mongoose.model("promotions", PromotionSchema);
module.exports = Promotion;
