const User = require('../models/User');

exports.syncUser = async (req, res) => {
  try {
    // req.user tiedot tulevat auth-middlewaresta
    const { id, email, name } = req.user;

    // 1. Etsitään käyttäjää id:n perusteella
    let user = await User.findById(id);

    // 2. Jos käyttäjää ei löydy, luodaan uusi
    if (!user) {
      console.log(`Luodaan uusi käyttäjä tietokantaan: ${email}`);
      user = new User({
        _id: id, // Cognito sub
        email: email, // Cognitosta tullut email
        nimi: name, // Cognitosta tullut name
      });
      await user.save();
    }

    // 3. Palautetaan käyttäjän profiili
    res.status(200).json(user);
  } catch (err) {
    console.error('Virhe käyttäjän synkronoinnissa:', err);
    res.status(500).json({ error: 'Palvelinvirhe käyttäjää synkronoitaessa' });
  }
};
