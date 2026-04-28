const { CognitoJwtVerifier } = require('aws-jwt-verify');

// Määritä verifioija
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'access', // tai "id"
  clientId: process.env.COGNITO_CLIENT_ID,
});

const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Odottaa "Bearer <token>"
    if (!token) throw new Error('Token missing');

    const payload = await verifier.verify(token);
    req.user = payload; // Tallennetaan käyttäjän tiedot pyyntöön
    next();
  } catch (err) {
    res.status(401).json({ message: 'Luvaton pääsy', error: err.message });
  }
};

module.exports = checkAuth;
