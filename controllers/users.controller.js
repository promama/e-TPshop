var User = require("../models/users")

module.exports.postRegister = async(req, res) => {
    const { email, username } = req.body
    const userByUsername = await User.find({ username })

    if (userByUsername.length) {
        return res.status(202).json({
            success: false.valueOf,
            msg: "Your account has beed used"
        })
    }

    const userByMail = await User.find({ email })

    if (userByMail.length) {
        return res.status(202).json({
            success: false,
            msg: "Your email has been used"
        })
    }

    var user = await User.create(req.body)

    await user.save()

    res.status(201).json({
        success: true,
        data: { user }
    })
}

module.exports.getUser = async(req, res) => {
    const username = req.body
    const user = await User.find({ username })

    return res.json(user)
}