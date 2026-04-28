export const environment = {
  production: false, // Tämä on yleensä jo valmiina
  apiUrl: 'http://localhost:3000/api', // Paikallinen backend
  cognito: {
    userPoolId: 'eu-central-1_zkaFNKayr', // Laita OMA User Pool ID tähän
    userPoolClientId: '2po45730dimecr3mr2h1eju80e', // Laita OMA Client ID tähän
  },
};
