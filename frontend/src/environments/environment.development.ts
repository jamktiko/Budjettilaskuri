export const environment = {
  production: false, // Tämä on yleensä jo valmiina
  apiUrl: 'http://localhost:3000/api', // Paikallinen backend
  cognito: {
    userPoolId: 'eu-central-1_zXLOhTVA9', // Laita OMA User Pool ID tähän
    userPoolClientId: '5556f14at2ra0ucn04r04rs493', // Laita OMA Client ID tähän
  },
};
