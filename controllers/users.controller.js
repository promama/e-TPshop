var User = require("../models/users")

//create account
module.exports.postRegister = async(req, res) => {
    //regist with email and username
    const { email, username } = req.body

    //check if username is used
    const userByUsername = await User.find({ username })
    if (userByUsername.length) {
        return res.status(202).json({
            success: false.valueOf,
            msg: "Your account has beed used"
        })
    }

    //check if email is used
    const userByMail = await User.find({ email })
    if (userByMail.length) {
        return res.status(202).json({
            success: false,
            msg: "Your email has been used"
        })
    }

    //create account with username and email
    var user = await User.create(req.body)
    await user.save()

    //return value
    res.status(201).json({
        success: true,
        data: { user }
    })
}

//find all accounts
module.exports.getallUser = async(req, res) => {
    const allUser = await User.find()

    if(allUser.length) {
        res.json({
            success: true,
            data: { allUser }
        })
    }
    else {
        res.json({
            success: false,
            data: "can't find any user"
        })
    }
}

//not completed
module.exports.getUser = async(req, res) => {
    const username = req.body
    const user = await User.find({ username })

    return res.json(user)
}