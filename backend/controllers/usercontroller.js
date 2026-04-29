const User = require('../models/User');

exports.syncUser = async (req, res) => {
  try {
    console.log(
      'Yritetään synkronoida käyttäjä. Data middlewaresta:',
      req.user,
    );

    const { id, email, name } = req.user;

    // Jos jokin näistä on tyhjä, koodi saattaa kaatua tähän
    if (!id || !email) {
      console.error('VIRHE: ID tai Email puuttuu tokenista!');
      return res
        .status(400)
        .json({ error: 'Tokenista puuttuu tarvittavia tietoja' });
    }

    let user = await User.findById(id);

    if (!user) {
      console.log('Luodaan uusi käyttäjä...');
      user = new User({ _id: id, email, nimi: name });
      await user.save();
      console.log('Käyttäjä tallennettu onnistuneesti!');
    }

    res.json(user);
  } catch (err) {
    console.error('Tarkka virheilmoitus tietokannasta:', err.message);
    res.status(500).json({ error: err.message });
  }
};
