var User = require("../models/users")
var Cart = require("../models/carts")

//create account
module.exports.postRegister = async(req, res) => {
    //regist with email and username
    const { email, username, password } = req.body

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

    //create account with request from body
    try {
        var user = await User.create(req.body)
        await user.save()
    } catch {
        res.json({
            err_location: "users.controller.js",
            err_posistion: "postRegister",
            id: "create account with username and email"
        })
    }

    //create cart for new account
    try {
        var cart = await Cart.create({userId: user._id})
    } catch {
        res.json({
            err_location: "users.controller.js",
            err_posistion: "postRegister",
            id: "create cart for new account"
        })
    }

    //return value
    res.status(201).json({
        success: true,
        data: user
    })
}

//find all accounts
module.exports.getallUser = async(req, res) => {
    //find all accounts created
    const allUser = await User.find()

    //check and return result founded
    try {
        //check if can find anything
        if(allUser.length) {
            res.json({
                success: true,
                data: { allUser }
            })
        }
        //fail to find anyone
        else {
            res.json({
                success: false,
                data: "can't find any user"
            })
        }
    } catch {
        res.json({
            err_location: "users.controller.js",
            err_posistion: "getallUser",
            id: "check and return result founded"
        })
    }
}

// //not completed
// module.exports.getUser = async(req, res) => {
//     const { email, username } = req.body
//     const account_username = await User.find({ username }).exec()
//     const account_email = await User.find({ email }).exec()

//     if(account_username) {
//         res.json({
//             success: true,
//             data: { account_email }
//         })
//     } else if (account_email) {
//         res.json({
//             success: true,
//             data: { account_username }
//         })
//     } else {
//         res.json({
//             success: false,
//             data: "no account have username or email given"
//         })
//     }
// }