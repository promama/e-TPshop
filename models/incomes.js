const mongoose = require('mongoose')

var incomeSchema = new mongoose.Schema({
    Id: { type: mongoose.Schema.Types.ObjectId },
    total: { type: Number, default: 0 },
    year: { type: Number },
    month: { type: Number }
})

var Income = mongoose.model("Incomes", incomeSchema, "incomes")
module.exports = Income