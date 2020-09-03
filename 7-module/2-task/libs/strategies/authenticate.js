const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    done(null, false, 'Не указан email');
    return;
  }

  const user = await getUser(email);
  if (!user) {
    try {
      const user = await User.create(
          {
            email,
            displayName,
          }
      );
      done(null, user);
    } catch (e) {
      done(e);
    }
  } else {
    done(null, user);
  }
};

async function getUser(email) {
  const user = await User.findOne({email: email});
  return user;
}
