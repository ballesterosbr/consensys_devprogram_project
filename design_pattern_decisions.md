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

- `Identity.sol`
- `PersonalIdentity.sol`
- `IdentityLib.sol`
- `OraclizeTest.sol`

### Factory contract

Use a Factory contract to create new identities.

The PersonalIdentity created does not depends on Identity.sol. So if tomorrow the emergency stop of Identity is enabled, the user won't lose anything.

### Restricting Access - Modifiers

To restrict some functions of the smart contracts, a modifier has been implemented to check with a require condition that is the owner who execute the function.

To enable the emergency stop, two modifiers have been implemented `noEmergency`and `inEmergency` to check if the emergency is enabled.

*When testing the project in localhost it was necessary to set to public some state variables that were initially marked as private. This is due to Ganache was able to perform a correct deployment of the contract and all its functions.*

### Emergency Stop

Only the owner of the Identity contract can enable the Emergency Stop.

This Identity contract is the critical one because is the one that creates the PersonalIdentity contracts.

When the emergency is enable is not possible to create or delete identities. Is not possible to remove identities because the user of a PersonalIdentity might want to remember the address of his Idenetity.

Because of the fact that there is no upgradable patterns in the smart contract, it's only possible to enable the emergency.

It's not necessary to implement a Emergency stop in PersonalIdentity.sol because only the owner can execute the functions.

### Struct

Identity contract uses Struct to store the information about the address of a user. Not store any attributes of the user, only information about who create the identity, who is the owner, and when.

### Mapping

For security purposes, if someone want to loop over the array, need to do with bytes32 elements using javascript.

A mapping is used to easily find User struct informationn using the address of the user.

### Library

A library has been implemented to test the input values of the PersonalIdentity.
- Test if the input value is a zero address.
- Test if the input value is empty (for strings).
- Test if the input value already exist.

### Dynamic Array (upgradable pattern)

A dynamic array is used to store the information of the user like name, lastname, email...

Dynamic because in the future is possible that the frontend developer want to allow the users to introduce more values, for example: services associated with the Identity.

### Lifetime (Mortal) - Only advanced users

PersonalIdentity.sol have a destroyContract() function but this is not accessible by the UI. This is because it is not a critical functionality so if you are an advanced user you can get the contract code and using the Remix Ethereum IDE you can activate this function.

## Oraclize contract

Two querys to get offchain information:
- Gas Price of Ethereum mainnet
- ETHUSD price

## Other possible implementatios

- Create a function in `Identity.sol`that can add manually identities created.
    - Not implemented because the require condition is not trivial to test if the input address is a PersonalIdentity address.

- Use auto deprecation
    - Not implemented because auto deprecation needs timestamp and it could be a security risk.
