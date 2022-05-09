<p align="center">
  <a href="https://github.com/lgsfarias/MyWalletAPI">
    <img src="./assets/img/wallet-128.png" alt="readme-logo" width="80" height="80">
  </a>

  <h3 align="center">
    myWallet
  </h3>
  <p align="center">
    Financial Control API
    <br />
    <a href="https://github.com/lgsfarias/MyWalletAPI"><strong>Explore the docs »</strong></a>
    <br />
</p>

<details>
  <summary><h2 style="display: inline-block">Abstract</h2></summary>
  <ol>
    <li>
      <a href="#built-with">Built With</a>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#api-usage-example">API usage example</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<br/>

## Built With

API to financial control.

![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![Nodejs](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

<br/>

## Usage

```bash
$ git clone https://github.com/lgsfarias/MyWalletAPI
$ cd MyWalletAPI
$ npm install
$ npm run dev
```

Create a `.env` file with the following content:

```
MONGO_URI='mongodb://localhost:27017'
MONGO_DB='mywallet'
```

Connect to MongoDB.

API:

```
- POST /api/signup
  - Route to create new user account
- POST /api/login
  - Route to login the user
- POST /api/logout
  - Route to end current session
- POST /api/transactions
  - Route to create a new transactions
- GET /api/transactions
  - Route to get all transactions from an user logged in
- PUT /api/transactions/:id
  - Route to update a transaction by id
- DELETE /api/transactions/:id
  - Route to delete a transaction by id
```

## API usage example

<a href="https://my-wallet-lgsfarias.vercel.app/"><strong>myWallet site</strong></a>

<br />

## Contact

<div>
  <a href="https://www.linkedin.com/in/lgsfarias" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank"></a>
  <a href = "mailto:lgsfarias.dev@gmail.com"><img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" target="_blank"></a>
</div>
