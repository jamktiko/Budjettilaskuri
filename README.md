# Budjettilaskuri

A web application for tracking your monthly expenses and comparing them against your budget.

## Description

*Budjettilaskuri* is a modern personal finance tracker that simplifies how you manage your money. By combining intuitive manual expense entry with automated receipt scanning (via Tesseract OCR), the app makes it easy to log purchases and compare them against your monthly budget. Built on an AWS cloud infrastructure and utilizing modern web technologies, the project demonstrates user-friendly approach to expense management.

## Getting Started

### Tech Stack

- Frontend: Angular, Angular Material, Tesseract
- Backend: Node.js 24, Express
- Database: MongoDB Atlas
- Infrastructure (AWS): Elastic Beanstalk, S3, CloudFront, AWS Cognito, Application Load Balancer, NAT Gateway
- CI/CD: GitHub Actions

### Installing

- You can download / clone the repository for local use.
- Create own .env file in backend folder with own MongoDB URI and Cognito variables.
- Change frontend environments to your own Cognito variables.
- Configure CORS port if needed.
  
### Executing program

```
cd frontend
npm i
npm start
```

```
cd backend
npm i
npm start
```

## Authors

- Aapo Hampaala
- Sade Haarala
- Teemu Jalava
- Teemu Sairi

## Version History

- 1.0
  - Initial Release

## License

This project is licensed under the CC BY-SA 4.0 License - see the LICENSE.md file for details

[![CC BY-SA 4.0][cc-by-sa-image]][cc-by-sa]

[cc-by-sa]: http://creativecommons.org/licenses/by-sa/4.0/
[cc-by-sa-image]: https://licensebuttons.net/l/by-sa/4.0/88x31.png

## Acknowledgments

Inspiration, code snippets, etc.
