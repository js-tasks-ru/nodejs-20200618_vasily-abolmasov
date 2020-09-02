const User = require('../../models/User')
const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async (login, password, done) => {
      const user = await User.findOne({email: login});
      if (!user) {
        done(null, false, 'Нет такого пользователя');
      } else {
        if (await user.checkPassword(password)) {
          return done(null, user)
        } else {
          done(null, false, 'Неверный пароль');
        }
      }
    },
);
