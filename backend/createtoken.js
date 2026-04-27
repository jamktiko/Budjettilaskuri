const jwt = require('jsonwebtoken');
require('dotenv').config(); //dotenv -moduuli tarvitaan jos aiotaan käyttää .env -filua
/* luodaan token jos user (username ja password) on saatu.
    Token muodostuu user-objektista (payload),
    secret keystä ja optioista (tässä expiresIn)
    tokeniin ei pitäisi laittaa salasanaa koska se
    voidaan dekryptata tokenista. Kannattaa laittaa tokeniin
    vain tieto siitä onko käyttäjä admin. */
createToken = (user) => {
  const payload = {
    username: user.username,
    isadmin: user.isadmin,
  }; 
  console.log(payload); // Voisi näyttää tältä: {'username':'tuito', 'isadmin': true}
  const token = jwt.sign(payload, process.env.SECRET, {
    expiresIn: 60 * 60 * 4, // expiroituu 4 tunnissa
  });
  // const decodedtoken = jwt.decode(token);
  // console.log(decodedtoken);
  return token;
}

module.exports = createToken;
