---
Title:  Decentralized Digital Identity Model
Author: Alberto Ballesteros Rodríguez
Date:   August 2018
Mail:   ballesterosbr@protonmail.com
File:   README
---

Consensys Academy's 2018 Dev Program Final Project
===

## [Live Demo on IPFS](https://gateway.ipfs.io/ipfs/QmWm2jDY2SZ7uyuPGpLFqiQcmZNvF8NDa7EmcdQSAdgURA/)

## Index

- [What does this project do?](#what-does-this-project-do)
- [Why do you build this project?](#why-do-you-build-this-project)
    - [Example 1](#example-1)
    - [Example 2](#example-2)
    - [Solution proposed and possible scenario](#solution-proposed-and-possible-scenario)
- [How to set up?](#how-to-set-up)
    - [Possible errors](#possible-errors)
- [What do you need to know as evaluator?](#what-do-you-need-to-know-as-evaluator)
    - [Use cases](#use-cases)
- [How to use this DAPP?](#how-to-use-this-dapp)
- [Test](#test)
- Documents
    - [Implementations details - desing_pattern_decisions.md](https://github.com/ballesterosbr/consensys_devprogram_project/blob/master/design_pattern_decisions.md)
    - [Security details - avoiding_common_attacks.md](https://github.com/ballesterosbr/consensys_devprogram_project/blob/master/avoiding_common_attacks.md)
    - [deployed_addresses.txt](https://github.com/ballesterosbr/consensys_devprogram_project/blob/master/deployed_addresses.txt)
- [The existence of this project and his context](#the-existence-of-this-project-and-his-context)
- [FAQs](#faqs)

## What does this project do?

This project is about a Decentralized Application (DApp) that allows the user to create a Digital Identity based on an standards explained in the [design_patter_decisions.md](https://github.com/ballesterosbr/consensys_devprogram_project/blob/master/design_pattern_decisions.md) file.

You can compare the behaviour of this DApp with an Identity Provider. 

*Keep in mind that creating a Service Provider for testing the application is not a project requirements. Is only commented for a better understanding of the project.*

*Digital Identity: Understood as an Identity used only for Internet services, not things like academic titles or driving licenses).*

## Why do you build this project?

Please, always take this project as a model based on the Self-Sovereign Identity concept.

This project seeks to decentralize Digital Identity and remove the fragmentation caused by creating a different identity for each service. The application doesn't get any information about you, only encrypts and send it to the Ethereum blockchain, making possible that can be readed by a Service Provider.

While Ethereum exists, your Identity exists.

In order to understand this project quickly and easily, I will give you two simple examples.

### Example 1
1. You have an account at an Identity Provider such as Facebook (it's the simplest one that I know).

2. You decide to register in a Service Provider with your Facebook account, such as Spotify.

3. You decide for whatever reason to cancel your Facebook account, which is associated with one or more Service Providers. This will cause that you lose the access to your associated Service Providers.
   
### Example 2
1. You have an account at an Identity Provider such as Google (GMail).
   
2. You decide to register in a Service Provider with your Google account.
   
3. You decide for whatever reason to cancel your Google account, which is associated with one or more Service Providers. This will cause that you lose the access to your associated Service Providers.

Maybe we can think this is something totally normal and it's defined in the Legal Terms, but we are not here to discuss about that.

### Solution proposed and possible scenario

A platform that allows you to create, edit or delete a Digital Identity. Always encrypted by the user with one or more passwords (this details are explained in the [avoiding_common_attacks.md](https://github.com/ballesterosbr/consensys_devprogram_project/blob/master/avoiding_common_attacks.md) file).

In this project, is proposed that you can change any attribute of your Identity without losing the access with a Service Provider.

- You create a new Digital Identity with the DApp and add some attributes about you. (The typical ones requested by the Service Providers: Name, lastname, age, email...). You saved a Google mail.
  
- You register in a Service Provider, that reads the information stored in your smart contract.
  
- For some reason you delete your Google account and create a email with Protonmail.
  
- With this DApp, you can update your email attribute of your Identity without losing the access to the Service Provider where you are registered. (Obviously you must update the information in the Service Provider).

If you have interest in the subject, read [The existence of this project and his context](#the-existence-of-this-project-and-his-context)

## How to set up?

If you have an error during the set up, go to the [Possible errors](#possible-errors) sections of this document.

Clone this repository.
```
$ git clone https://github.com/ballesterosbr/consensys_devprogram_project.git
$ cd consensys_devprogram_project/
```
Go to the repository folder.
```
$ npm install //This take a while with some update recommendations.
``` 
You must see something like this:

```
$ ls
app                          migrations         test
avoiding_common_attacks.md   node_modules       truffle.js
contracts                    package.json       webpack.config.js
deployed_addresses.txt       package-lock.json
design_pattern_decisions.md  README.md
```
This project uses Oraclize, so you need to install the oraclize-api.
```
$ truffle install oraclize-api
$ ls
app                          installed_contracts  README.md
avoiding_common_attacks.md   migrations           test
contracts                    node_modules         truffle.js
deployed_addresses.txt       package.json         webpack.config.js
design_pattern_decisions.md  package-lock.json

```
A new folder has been created after the installation: `installed_contracts`

Start Ganache or Ganache-cli.

Open a new terminal and go to the project path. Now you are going to install ethereum-bridge to communicate with the Oracle.

```
$ cd consensys_devprogram_project/
$ mkdir ethereum-bridge
$ git clone https://github.com/oraclize/ethereum-bridge ethereum-bridge
```
You will see something like (ethereum-bridge new folder):
```
$ ls
app                          ethereum-bridge      package-lock.json
avoiding_common_attacks.md   installed_contracts  README.md
contracts                    migrations           test
deployed_addresses.txt       node_modules         truffle.js
design_pattern_decisions.md  package.json         webpack.config.js

$ cd ethereum-bridge
$ npm install
$ node bridge -a 9 // This get the 9 account of Ganache
```
**Be careful, Ethereum bridge and Ganache need to use the same port (Ethereum node port).**

From the output of: `node bridge -a 9` copy the line that looks like:

`OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43...)`

Ethereum bridge try to connect to http://localhost:8545

At this point, go to `/consensys_devprogram_project/contracts` and open the file `OraclizePrice.sol`.

**Replace the existing `OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA21...)` with the one you wrote down before**

Open a new terminal and in the path of the project.

```
$ truffle migrate --reset // Use --reset if you have a previous build.
```
Be sure that the account (usually the first account of Ganache) has at least 15 ethers (used for Oraclize).

If the migration is successful.

```
$ npm run dev
```

Go to [http//localhost:8080](http://localhost:8081/) (if port 8080 is in use, try 8081).

**I recommend at this point to running the tests.**

If everything goes well, you will see:

![Alt text](https://github.com/ballesterosbr/consensys_devprogram_project/blob/master/screenshot.png?raw=true)

### Possible errors

**If port 8080 is in use and npm don't change it automatically, try to change to :8081, must show:**
```
Project is running at http://localhost:8081/
```
**If you see something like this:**
```
WARN log with contract myid: 0x1e84508fa52c2d976ef07fe21f02446249a23e0a0b20eeaee263fa309b9c7e49 was triggered, but it was already seen before, skipping event...
```
**I recommend you to restart the set up tutorial and delete the `build` folder, don't forget to replace the new OraclizeAddrResolver**

**If you have errors running the tests, try deleting the file `.babelrc`**

**If you have errors running the tests, check that ethereum-bridge is running, otherwise you will get a revert() exception and the tests will fail.**

**If you have Ganache running in a different port from 8545, ethereum-bridge need to start in the same port as Ganache:**

```
$ node bridge -a 9 -H 127.0.0.1 -p ganachePort --dev
for example:
$ node bridge -a 9 -H 127.0.0.1 -p 9545 --dev 
```
---

## What do you need to know as evaluator?

### IPFS Hosting - [Live Demo on IPFS](https://gateway.ipfs.io/ipfs/QmWm2jDY2SZ7uyuPGpLFqiQcmZNvF8NDa7EmcdQSAdgURA/)

* The DApp is hosted on IPFS, you can test it the same way as localhost, but Oraclize is not available in this demo.
* Demo URL: https://gateway.ipfs.io/ipfs/QmWm2jDY2SZ7uyuPGpLFqiQcmZNvF8NDa7EmcdQSAdgURA/
* *Please be patient, IPFS sometimes is slow.*
* **Please, be sure you have MetaMask installed, otherwise the webpage won't load correctly.**

### Localhost testing

* ENS not available. Test it with the live demo! [Why?](#faqs)

### Rinkeby testing

* Oraclize not available, you can see how it works with localhost testing.
* When you use the DApp hosted on IPFS think that this is a real network with traffic, and some functionalities that worked fine in localhost will be affected
* 
#### If you want to test this project on Rinkeby, feel free to get one of the following accounts:
```
Account 1 priv_key - ccf3cbd39c8cb3c338743b4a8404c9a288853123e2bbfb5ba8b0750d4d9dfc64
Account 2 priv_key - 6bc8426286e02bfc39524181be665fe91a44630358fe8b5ffec31fd3953db200
Account 3 priv_key - 37c4963d8c5551c701683cd5b6bc2e14d04706eebd2c7f9a711ecc84824cf50b
```

#### If you prefer to use your account, you can get free Ether for testing proposals:

* [Rinkeby faucet](https://faucet.rinkeby.io/)

---

### Use cases
---
#### Create a new Digital Identity
1. First, you need to create an Identity pressing the 'Create Identity' button.
2. Submit the Transaction in MetaMask.
3. To protect your information, you need to write a password (save it!).
4. Click on 'Add attributes' tab and start adding attributes to your Identity.

---

#### You have changed your email and need to update your Identity.
1. Introduce your password (or a new password if you want to protect with a different one).
2. Mark the checkbox of the 'email' attribute.
3. Press 'Select Update' to enable the input box of the attribute 'email'.
4. Once you have written the new email, press 'Update attributes'.
5. Submit the Transaction in MetaMask.
6. Now you can press 'Show All' and verify that your email has been updated.

---

#### You have changed more than one attribute and need to update your Identity
1. Introduce your password (or a new password if you want to protect with a different one).
2. Mark the checkbox of all the attributes you want to update.
3. Press 'Select Update' to enable the input box of all attributes.
4. Once you have written the new information, press 'Update attributes'.
5. MetaMask prompt with more than one transaction.
6. Submit the Transactions in MetaMask.
7. Now you can press 'Show All' and verify that your Identity has been updated.

---

#### You want to remove all your Identity information and protect your data with a different password 
1. Click on 'Manage Attributes' tab.
2. Press 'Remove attributes'.
3. Submit the Transaction in MetaMask.
4. Introduce a different password from the one you used before.
5. Click on 'Add Attributes' tab.
6. Start adding attributes to your Identity.

---

#### You want to forget the Identity associated with your address

1. Click on 'Manage Attributes' tab.
2. *If your Identity has no attributes go to step 5.*
3. Press 'Remove attributes'.
4. Submit the Transaction in MetaMask.
5. Click on 'My Identity' tab.
6. Press 'Forget Identity'.
7. Submit the Transaction in MetaMask.

---

#### You don't want to remember your address (0x...) - ONLY RINKEBY
 
1. Click on 'ENS' tab.
2. Go to the Step I. Write a domain that is available without '.test'.
3. Press 'Register'. (*You can check de status using the link provided*).
4. Go to the Step II. Write the same domain that you register, but with '.test' now.
5. Press 'Save'. (*You can check de status using the link provided*).
6. Go to the Step III. Write the same domain that you saved.
7. Press 'Link'. (*You can check de status using the link provided*).

*You can register more than one domain. Only need to repeat the steps.*

---

#### Display the ENS domain created - ONLY RINKEBY
1. Click on 'ENS' tab.
2. In the first input box write your ENS domain. (*You can use a domain that you haven't registered*).
3. Press 'Check ENS'.
4. You will see in the top of the screen your ENS. (e.g. Your address is: yourensdomain.test).
   
*You can display only one of your domains.*

---

## How to use this DApp?
* The first thing is create a new Identity.
* Once your Identity has been created you must introduce a password in the Password tab.
    * This password can be different for each attribute. Expires after 10 minutes or you can expire it manually.
* You can forget your Identity, but must be empty before.
---
* When you introduce a password, you are able to add new attributes to your Identity, be aware about the messages that appear when you are writing.
* After that, you can see, update or remove your attributes.
    * Show attribute: Select with the checkbox the attribute or attributes that you want to update, then press 'Show All' and wait until you can see your attribute in the input box. You need the same password you used for adding the attributes.
    * Update attribute: Select with the checkbox the attribute or attributes that you want to update, then press 'Select Update', write your new attribute in the input box and finally press 'Update Attributes'. This will create one transaction per attribute, you can submit all.
    * Remove attributes: This will remove ALL your attributes and clean your Identity. You don't need to use the checkbox here.
--- 
* Etherum Name Service (ENS) - Only for Rinkeby
    * You can register a domain using the Ethereum Name Service (ENS). Please follow the steps, be careful with '.test' and be aware of the Gas limit showed in MetaMask.
    * If you don't know if the transaction succeed use the link provided or Metamask.
---
* Oraclize API - Only for localhost
    * The footer show you the price of the Gas in Ether and the ETHUSD price.
    * Gas price from: [ETHGasStation](https://ethgasstation.info/)
    * ETHUSD price from: [etherscan.io](https://etherscan.io/)

## Thanks for using this DApp!

---

## Test

### Identity.sol

1. Compare struct properties and mapping with the created identity properties.
    - Test that if you don't have an Identity, the mapping is empty.
    - Create a new Identity and compare the values of the struct with the expected ones.
  
2. Test that it's not possible to create new identities if exist one.
    - If you have an Identity created, you can't create a new one. Used try/catch to get the revert error from the require.

3. Test that it's possible to remove the identity if it hasn't any attributes.
    - If you have an empty Identity, it's possible to delete it. 
    
4. Test that it's not possible to remove the identity if it has attributes.
    - If your Identity is not empty you can't delete it and unlink your account with this Identity address.
    - Used try/catch to get the revert error from the require.
    
5. Testing Emergency Stop.
    - Test only the owner can activate the emergency stop and it works disabling the rest of the functions, except the getters.
    
### PersonalIdentity.sol
1. Test add function (data and empty data) with different users and testing require conditions.
    - Test adding data with value and without it.
    -  Try to add data with a user that is not the owner of the Identity. Used try/catch to get the revert errors from the require.

2. Test update function (data and empty data) with different users and test require conditions.
    - Test updating the data previosly created with newData and empty data.
    - Try to update data with a user that is not the owner of the Identity. Used try/catch to get the revert errors from the require.

3. Test getData function with different users and test require conditions
    - Test anyone can get the Data.
    - Test that an array index without data cause exception. Used try/catch to get the revert error from the require.

4. Test removeAllData function with different users and test require conditions.
    - Test only the owner can remove his data. Not possible if the Identity is empty.
    - Different users can't remove data from another one. Used try/catch to get the revert error from the require.

5. Test selfdestruct (Owner only, non-emtpy PersonalIdentity)
    - Test destroy function. To test the contract is destroyed, try to run any function and it will fail.
    - Not possible to destroy if the PersonalIdentity is not empty. Used try/catch to catch de error.

---

## The existence of this project and his context

Currently, the way to take on presence in the digital world is through the consumption of different digital services. These services and the identities that are created to consume it define a digital fingerprint of yourself. 

However, as far as identity is concerned, it is fragmented and there are no unique credentials that carry out the authentication in all thoseservices.

To avoid the security and usability problems considered by this fragmentation, there are solutions such as Identity Providers (IdPs) that, with trust schemes, lighten the user of the responsibility to authenticate themselves in Service Providers (SPs). Examples of these systems are OpenID Connect and Facebook Connect.

These IdPs are also Service Providers, that is, implies that the identity used for authenticate in different services such as banks, online stores or the Public Administration, is the identity created as a user of an application suite or a social network.

Thus, the trust scheme turns to a captivity scheme in which, to maintain the profiles of different services the identity, these ones must be maintained in the IdP, without there being any portability process. This situation becomes more critical if it is approached from a legal perspective when approving the terms of use of these IdP, where they are allowed to use that identity for their internal processes of knowledge generation.

---

## FAQs
### Why don't you deploy the ENS in localhost?
- The difficult part is to connect with the real smart contracts deployed on Rinkeby and set up a friendly UI where the user can register a domain using ENS, ignoring all the scripts and code necessary to register a domain with ENS. I think it has much more value the use with a 'real' net like Rinkeby.

### Why don't you test the Oraclize contract?
- Because the best test is to watch if the DApp shows the Gas price and the ETHUSD price. Create a test file it would be the same.

### Why you create this if uPort exists?
- Because it could be possible to have different schemes of Digital Identity in the same Blockchain ecosystem.

### This is not a Self-Sovereign Identity project.
- No, this project gets the concept of self-sovereign identity to apply it to a Digital Identity Model. Think that this is just a project defining a model.