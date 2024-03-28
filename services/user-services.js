const User = require('../models/user')

const userServices = {
  signUp: async (req, cb) => {
    try {
      const { email, password, checkPassword } = req.body
      if ( !email || !password || !checkPassword) throw new Error('所有欄位皆為必填！')
      const user = await User.findOne({ email })
      if (user) throw new Error('信箱已存在！')
      if (password !== checkPassword) throw new Error('密碼與確認密碼不一致！')
      // const salt = bcrypt.genSaltSync(10)
      // const hash = bcrypt.hashSync(password, salt)
      const newUser = await User.create({
        email,
        password,
        // password: hash
      })
      const userData = newUser.toJSON()
      delete userData.password
      cb(null, {
          status: 'success',
          message: '註冊成功！',
          user: userData
      })
    } catch (err) {
      cb(err)
    }
  },
}

module.exports = userServices
