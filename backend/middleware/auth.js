const { CognitoJwtVerifier } = require('aws-jwt-verify');

// Alustetaan verifioija Cognito-tiedoilla, beanstalkista
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'access',
  clientId: process.env.COGNITO_CLIENT_ID,
});

const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token puuttuu' });

    const payload = await verifier.verify(token);

    // Poimitaan tiedot tokenista.
    // Huom: Cognitossa kenttä on yleensä 'name', mutta mallissasi se on 'nimi'.
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name || payload.given_name || 'Käyttäjä',
    };

    next();
  } catch (err) {
    res.status(401).json({ message: 'Luvaton pääsy' });
  }
};

module.exports = checkAuth;
