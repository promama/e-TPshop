const mongoose = require('mongoose')

var incomeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    total: { type: Number, default: 0 },
    create_at: { type: Date, default: Date.now }
})

var Income = mongoose.model("Incomes", incomeSchema, "incomes")
module.exports = Income