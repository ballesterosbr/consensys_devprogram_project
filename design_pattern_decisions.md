---
Title:  Decentralized Digital Identity Model
Author: Alberto Ballesteros Rodríguez
Date:   August 2018
Mail:   ballesterosbr@protonmail.com
File:   Desing Patters Decisions
---

Desing Patters Decisions
===

## Index

- [Contract structure](#contract-structure)
	- [Factory contract](#factory-contract)
	- [Restricting Access - Modifiers](#restricting-access---modifiers)
	- [Emergency Stop](#emergency-stop)
	- [Struct](#struct)
	- [Mapping](#mapping)
	- [Library](#library)
	- [Dynamic Array (upgradable pattern)](#dynamic-array-upgradable-pattern)
	- [Lifetime (Mortal) - Only advanced users](#lifetime-mortal---only-advanced-users)
- [Oraclize contract](#oraclize-contract)
- [Other possible implementatios](#other-possible-implementatios)

## Contract structure

In this project there are multiple smart contracts
```
Contracts
|___Identity.sol
|	|___ PersonalIdentity.sol
|___IdentityLib.sol
|___OraclizeTest.sol
```

### Factory contract

Use a Factory contract to create new identities.

The PersonalIdentity created does not depends on Identity.sol. So if tomorrow the emergency stop of Identity is enabled, the user won't lose anything.

### Restricting Access - Modifiers

To restrict some functions of the smart contracts, a modifier has been implemented to check with a require condition that is the owner who execute the function.

To enable the emergency stop, two modifiers have been implemented `noEmergency`and `inEmergency` to check if the emergency is enabled.

*When testing the project in localhost it was necessary to set some state variables to public that were initially marked as private. This is due to Ganache was able to perform a correct deployment of the contract and all its functions.*

### Emergency Stop

Only the owner of the Identity contract can enable the Emergency Stop. From an Admin tab created in the frontend only visible to the owner.

This Identity contract is the critical one because is the one that creates the PersonalIdentity contracts.

When the emergency is enable is not possible to create or delete identities. Is not possible to remove identities because the user of a PersonalIdentity might want to remember the address of his Identity.

Because of the fact that there is no upgradable patterns in this smart contract, it's only possible to enable the emergency.

It's not necessary to implement a Emergency stop in `PersonalIdentity.sol` because only the owner can execute the functions.

### Struct

Identity contract uses a Struct to store the information about the address of the users. Don't store any attributes of the user, only information about who creates the identity, the address of the Identity, who is the owner, and when was created the Identity.

### Mapping

Mapping is used for security purposes, if someone want to loop over the mapping to see Identity information, need to do with bytes32 elements using javascript. Not possible in Solidity because the Gas will reject the transaction.

A mapping is used to easily find User struct informationn using the address of the user.

### Library

A library has been implemented to test the input values of the PersonalIdentity.
- Test if the input value is a zero address.
- Test if the input value is empty (for strings).
- Test if the input value already exist.

### Dynamic Array (upgradable pattern)

A dynamic array is used to store the information about the user like name, lastname, email, phone...

Dynamic because in the future is possible that the frontend developer want to allow the users to introduce more values, like: Services Providers associated with the Identity.

### Lifetime (Mortal) - Only advanced users

`PersonalIdentity.sol` have a `destroyContract()` function but it's not accessible from the UI. This is because it's a critical functionality, so if you are an advanced user and you want to delete the smart contract, you can get the smart contract code (from the Rinkeby Contract Source Code Verified) and using the Remix Ethereum IDE you can execute this function.

## Oraclize contract

Two querys to get offchain information:
- Gas Price of Ethereum mainnet
- ETHUSD price

Used an enum to define the state of the Oracle and a Struct to manage the state.

## Other possible implementatios

- Create a function in `Identity.sol` that can add manually identities created.
    - Not implemented because the require condition is not trivial to test if the input address is a PersonalIdentity address.

- Use auto deprecation.
    - Not implemented because auto deprecation needs timestamp and it could be a security risk.
