var Identity = artifacts.require('./Identity.sol')
var IdentityLib = artifacts.require('./IdentityLib.sol')
var PersonalIdentity = artifacts.require('./PersonalIdentity.sol')

/**
 * @author Alberto Ballesteros Rodríguez
 * @ Test for Identity.sol
 * Declaration of variables that will be useful to test the functions and attributes values.
 * In each of the test, the function or attribute is called and it's verified that the value is the expected one.
 */
contract('Identity', function (accounts) {
    const zeroAddress = "0x0000000000000000000000000000000000000000";
    const zero = 0;
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    const data = "stringData";
    let err = null;

    beforeEach('setup contract for each test', async function () {
        identity = await Identity.deployed();
    });

    /**
     * Test that if you don't have an Identity, the mapping is empty.
     * Create a new Identity and compare the values of the struct with the expected ones.
     */
    it("Compare struct properties and mapping with the created identity properties.", async () => {

        const checkMapping = await identity.identityUser(owner, { fromm: owner });

        assert.equal(checkMapping[0], zeroAddress);
        assert.equal(checkMapping[1], zeroAddress);
        assert.equal(checkMapping[2], zeroAddress);
        assert.equal(checkMapping[3], zero);

        await identity.newIdentity({ from: user1 });

        const checkIdentity = await identity.identityUser(user1);
        const personalIdentity = PersonalIdentity.at(checkIdentity[1]);
        const ownerIdentity = await personalIdentity.owner();

        assert.equal(checkIdentity[0], identity.address, 'This address is not the issuer of the identity.');
        assert.equal(checkIdentity[1], personalIdentity.address, 'This address is not the contract address of the identity.');
        assert.equal(checkIdentity[2], user1, 'This address is not the owner of the identity.');
        assert.equal(ownerIdentity, user1, 'This address is not the owner of the contract address of the identity ');
    });

    /**
     * If you have an Identity created, you can't create a new one. Used try/catch to get the revert error from the require.
     */
    it("Test that it's not possible to create new identities if exist one.", async () => {

        await identity.newIdentity({ from: user2 });

        try {
            await identity.newIdentity({ from: user2 });
        } catch (error) {
            err = error;
        }
        assert.ok(err instanceof Error);
    });

    /**
     * If you have an empty Identity, it's possible to delete it. 
     */
    it("Test that it's possible to remove the identity if it hasn't any attributes.", async () => {

        await identity.deleteIdentity({ from: user2 });

        const checkIdentityAfter = await identity.identityUser(user2);
        assert.equal(checkIdentityAfter[1], zeroAddress);

    });

    /**
     * If your Identity is not empty you can't delete it and unlink your account with this Identity address.
     * Used try/catch to get the revert error from the require.
     */
    it("Test that it's not possible to remove the identity if it has attributes.", async () => {

        const checkIdentityBefore = await identity.identityUser(user1);
        const personalIdentity = PersonalIdentity.at(checkIdentityBefore[1]);

        await personalIdentity.newData(data, { from: user1 });

        try {
            await identity.deleteIdentity({ from: user1 });
        } catch (error) {
            err = error;
        }
        assert.ok(err instanceof Error);

    });

    /**
     * Test only the owner can activate the emergency stop and it works disabling the rest of the functions, except the getters.
     */
    it("Testing Emergency Stop", async () => {

        try {
            await identity.enableEmergency({ from: user1 });
        } catch (error) {
            err = error;
        }
        assert.ok(err instanceof Error);

        await identity.enableEmergency({ from: owner });

        try {
            await identity.newIdentity({ from: user1 });
        } catch (error) {
            err = error;
        }
        assert.ok(err instanceof Error);
    });
});

/**
 * @author Alberto Ballesteros Rodríguez
 * @ Test for PersonalIdentity.sol
 * Although the owner activates the emergency stop, getters can be used, but is not possible to create or delete an Identity.
 * Declaration of variables that will be useful to test the functions and attributes values.
 * In each of the test, the function or attribute is called and it's verified that the value is the expected one.
 */
contract('PersonalIdentity', function (accounts) {
    const zeroAddress = "0x0000000000000000000000000000000000000000";
    const user1 = accounts[1];
    const user2 = accounts[2];
    const data = "stringData";
    const newData = "stringNewData";
    const emptyData = "";
    let err = null;

    /**
     * Test adding data with value and without it.
     * Try to add data with a user that is not the owner of the Identity. Used try/catch to get the revert errors from the require.
     */
    it("Test add function (data and empty data) with different users and testing require conditions.", async () => {

        const identity = await Identity.deployed();
        await identity.newIdentity({ from: user1 });

        const checkIdentity = await identity.identityUser(user1);
        const personalIdentity = PersonalIdentity.at(checkIdentity[1]);

        await personalIdentity.newData(data, { from: user1 });
        const checkDataAdded = await personalIdentity.getData(0, { from: user1 });
        assert.equal(data, checkDataAdded);

        try {
            await personalIdentity.newData(emptyData, { from: user1 });
        } catch (error) {
            err = error;
        }
        assert.ok(err instanceof Error);

        try {
            await personalIdentity.add(data, { from: user2 });
        } catch (error) {
            err = error;
        }
        assert.ok(err instanceof Error);
    });

    /**
     * Please, don't forget that the previous test create a new Identity and data. Now a seupt is done for each contract.
     * Will work with the Identity created before.
     */
    beforeEach('setup contract for each test', async function () {
        identity = await Identity.deployed();
        checkIdentity = await identity.identityUser(user1);
        personalIdentity = PersonalIdentity.at(checkIdentity[1]);
    });

    /**
     * Test updating the data previosly created with newData and empty data.
     * Try to update data with a user that is not the owner of the Identity. Used try/catch to get the revert errors from the require.
     */
    it("Test update function (data and empty data) with different users and test require conditions.", async () => {

        try {
            await personalIdentity.updateData(0, data, { from: user1 });
        } catch (error) {
            err = error;
        }
        assert.ok(err instanceof Error);

        try {
            await personalIdentity.updateData(0, emptyData, { from: user1 });
        } catch (error) {
            err = error;
        }
        assert.ok(err instanceof Error);

        try {
            await personalIdentity.updateData(0, newData, { from: user2 });
        } catch (error) {
            err = error;
        }
        assert.ok(err instanceof Error);

        try {
            await personalIdentity.updateData(1, newData, { from: user1 });
            await personalIdentity.updateData(2, newData, { from: user1 });
        } catch (error) {
            err = error;
        }
        assert.ok(err instanceof Error);

        await personalIdentity.updateData(0, newData, { from: user1 });
        const checkDataAdded = await personalIdentity.getData(0);
        assert.equal(newData, checkDataAdded);
    });

    /**
     * Test anyone can get the Data.
     * Test that an array index without data cause exception. Used try/catch to get the revert error from the require.
     */
    it("Test getData function with different users and test require conditions.", async () => {

        const getData = await personalIdentity.getData(0);
        assert.equal(newData, getData);

        const user2GetData = await personalIdentity.getData(0, { from: user2 });
        assert.equal(newData, user2GetData);

        try {
            await personalIdentity.getData(1);
        } catch (error) {
            err = error;
        }
        assert.ok(err instanceof Error);
    });

    /**
     * Test only the owner can remove his data. Not possible if the Identity is empty.
     * Different users can't remove data from another one. Used try/catch to get the revert error from the require.
     */
    it("Test removeAllData function with different users and test require conditions.", async () => {

        const checkNewData = await personalIdentity.getData(0);
        assert.equal(newData, checkNewData);

        await personalIdentity.removeAllData({ from: user1 });

        try {
            await personalIdentity.getData(0);
        } catch (error) {
            err = error;
        }
        assert.ok(err instanceof Error);

        await personalIdentity.newData(data, { from: user1 });

        const checkData = await personalIdentity.getData(0);
        assert.equal(data, checkData);

        await identity.newIdentity({ from: user2 });
        const checkIdentity_2 = await identity.identityUser(user2);
        const personalIdentity_2 = PersonalIdentity.at(checkIdentity_2[1]);
        try {
            await personalIdentity_2.removeAllData({ from: user2 });
        } catch (error) {
            err = error;
        }
        assert.ok(err instanceof Error);

        await personalIdentity_2.newData(data, { from: user2 });

        try {
            await personalIdentity_2.removeAllData({ from: user1 });
        } catch (error) {
            err = error;
        }
        assert.ok(err instanceof Error);
    });

    /**
     * Test destroy function. To test the contract is destroyed, try to run any function and it will fail.
     * Not possible to destroy if the PersonalIdentity is not empty. Used try/catch to catch de error.
     */
    it("Test selfdestruct (Owner only, non-emtpy PersonalIdentity).", async () => {

        try {
            await personalIdentity.destroyContract({ from: user1 });
        } catch (error) {
            err = error;
        }

        assert.ok(err instanceof Error);

        await personalIdentity.removeAllData({ from: user1 });

        try {
            await personalIdentity.destroyContract({ from: user2 });
        } catch (error) {
            err = error;
        }

        assert.ok(err instanceof Error);

        await personalIdentity.destroyContract({ from: user1 });

        try {
            await personalIdentity.newData(data, { from: user1 });
        } catch (error) {
            err = error;
        }

        assert.ok(err instanceof Error);
    });
});
