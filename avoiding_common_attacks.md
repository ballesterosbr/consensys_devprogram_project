---
Title:  Decentralized Digital Identity Model
Author: Alberto Ballesteros Rodríguez
Date:   August 2018
Mail:   ballesterosbr@protonmail.com
FIle:   Avoiding Common Attacks
---

Avoiding Common Attacks
===

## Index
- [Avoiding Common Attacks](#avoiding-common-attacks)
	- [Index](#index)
	- [Race Conditions](#race-conditions)
		- [Reentrancy & Pitfalls in Race Condition Solutions](#reentrancy--pitfalls-in-race-condition-solutions)
		- [Cross-function Race Conditions](#cross-function-race-conditions)
	- [Transaction-Ordering Dependence (TOP) /Front Running](#transaction-ordering-dependence-top-front-running)
	- [Timestamp Dependence](#timestamp-dependence)
	- [Integer Overflow and Underflow](#integer-overflow-and-underflow)
	- [DoS with (Unexpected) revert](#dos-with-unexpected-revert)
	- [DoS with Block Gas Limit](#dos-with-block-gas-limit)
	- [Forcibly Sending Ether to a Contract](#forcibly-sending-ether-to-a-contract)
	- [Recommendations](#recommendations)
		- [Remember that on-chain data is public](#remember-that-on-chain-data-is-public)
			- [AES Encryption](#aes-encryption)
		- [Require use](#require-use)
		- [Explicitly mark visibility in functions and state variables](#explicitly-mark-visibility-in-functions-and-state-variables)
		- [Lock pragmas to specific compiler version](#lock-pragmas-to-specific-compiler-version)
		- [Differentiate functions and events](#differentiate-functions-and-events)
		- [Avoid using tx.origin](#avoid-using-txorigin)

## Race Conditions

The design of the smart contracts of this project doesn't use any Ether.

### Reentrancy & Pitfalls in Race Condition Solutions

Race conditions can occur across multiple functions and contracts. It's recommended finishing all internal work first.

To prevent that a function could be called repeatedly, like our "newIdentity()" function. The function set one value to the User struct that is checked at the beginning of the function, only allowing to create one PersonalIdentity contract.

Without setting the value of the Struct before the creation of the new contract, the call would be vulnerable to a race condition.

### Cross-function Race Conditions

Another possible similar attack exist when two different functions share the same state. 

In this project there are no functions that share the same state.

## Transaction-Ordering Dependence (TOP) /Front Running

The alteration of the order of the transactions, as the documentation shows, it's more critical to decentralized markets. In this project require conditions are enough.

Frontend is designed in such a way that it's not possible to alter the order of the Identity attributes, even at the time to update those attributes.

## Timestamp Dependence

It's known that the that the timestamp of the block can be manipulated by the miner.

In this project the timestamp is only used to show the user a date when the Identity has been created. So, is nothing critical, only a simple parameter used in events that doesn't affect the use of the application.

The user is enough smart to know that if the timestamp does not match with the creation date of the Identity, it has been manipulated but this won't affect the use of the application.

## Integer Overflow and Underflow

If a balance reaches the maximum uint value (2^256) it will circle back to zero. This checks for that condition

In this project, uint are used to access to the array index where the attributes are stored (getters). It's not necessary to implement a Math Library because the implementation used in the project is really simple.

The require conditions test that the uint value introduced exist and if not, it will fail.

## DoS with (Unexpected) revert

In this project there isn't an implementation of a "leader" system.
In this project there aren't loops.

## DoS with Block Gas Limit

Even though a dynamic array is used in this project, is not necessary to loop over it. Getter will handle the access to the array information.

## Forcibly Sending Ether to a Contract

In this project there is not a fallback function.
The code does not need to make calculations based on the contract's balance.

## Recommendations

### Remember that on-chain data is public

The DApp developed in the project manage information that can be considered sensitive.

Now, you can find what solution has been proposed to make the sending of information more secure despite the public nature of the blockchain.

#### AES Encryption

As commented before, this DApp manage information about the users.

To protect this information, in the client side has been implemented the [node.js Crypto module](https://nodejs.org/api/crypto.html).

Before the user can push his information to the blockchain, is necessary to encrypt the attributes of the Identity using a password.

Some rules have been set for password, based on brute force attacks protection:
- Contain at least one number
- Contain at least one lower case
- Contain at least one upper case
- Contain at least 10 characters

This password is used to cipher and decipher the information. To protect the password is used Keccak256.

The algorithm used is the [AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard). If the algorithm were cracked, the application can use another one. All the process is transparent for the user. To better understand:
```
encryptedValue = AES256(keccak256(password), value)
```

This is not a project related with strong security fundamentals, so I considered AES-256 enough for this purpose.

### Require use

To input validation. In all the code you will find require conditions that use a library created (`Library.sol`) to test the input values.

### Explicitly mark visibility in functions and state variables

To make clear who can call the functions or access to a variable, all the functions and state variables are marked.

### Lock pragmas to specific compiler version

For security, the pragma is locked to the last release of [Solidity version: 0.4.24](https://github.com/ethereum/solidity/releases).

The pragma of the Library float because could be used for other developers.

### Differentiate functions and events

For functions, always start with the action: new, delete, update, get, enable, remove...

For events, always start with the object: Identity or Data.

### Avoid using tx.origin

All functions that requires, use msg.sender. Avoided to use tx.origin.
