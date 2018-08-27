pragma solidity 0.4.24;

/**
 * Import Identity Library
 */
import "./IdentityLib.sol";

/** 
* @title Identity Provider for Digital Identity
* @author Alberto Ballesteros Rodríguez
* @notice You can use this contract to generate digital identities based on smart contracts. All information stored must be encrypted.
* @dev For more implementation details read the "design_pattern_decisions.md" document. 
*/
contract Identity {

    mapping (address => User) public identityUser;
    bool public emergencyStop;
    address public owner;
    PersonalIdentity public id_contract;
    
    event IdentityCreated (address _issuer, address _contract, address _owner, uint256 _timestamp);
    event IdentityDeleted (address _from, address _contract, uint256 _timestamp);
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier noEmergency 
    { 
        if (!emergencyStop) 
        _;
    }
    
    modifier inEmergency 
    {
        if (emergencyStop) 
        _;
    }

    struct User {
        address issuer;
        address identityContract;
        address identityOwner;
        uint256 timestampCreation;
    }
    
    constructor() public{
        owner = msg.sender;
    }

    /**
     * @notice Generate a new smart contract as a new digital identity.
     * @dev The smart contract created work as an IDCard template. Will see in 'PersonalIdentity' smart contract.
     * You can't create a new Identity if you have one.
     */
    function newIdentity()
        public
        noEmergency
    {
        require(IdentityLib.isZero(identityUser[msg.sender].issuer));
        identityUser[msg.sender].issuer = this;
        PersonalIdentity c = new PersonalIdentity(msg.sender);
        identityUser[msg.sender] = User(this, c, msg.sender, now);
        emit IdentityCreated(this, c, msg.sender, now);
    }

   /** @notice Get user info inside the User struct.
     * @dev 'msg.sender' as parameter. If there is no Identity, return will be the '0x0' address.
     * Necessary if you test the contract with local blockchain like Ganache, not necessary with principal nets (Main, Ropsten, Rinkeby). 
     * @return address Issuer of the identity, in this case this smart contract (Identity.sol).
     * @return address Smart contract address of your Personal Identity.
     * @return address Owner of the Personal Identity. Do not confuse with the Issuer, this is the final user.
     * @return address Date of the Personal Identity creation.
     */
    function getUser()
        public
        view
        returns (address, address, address, uint256)
    {
        return (
            identityUser[msg.sender].issuer,
            identityUser[msg.sender].identityContract,
            identityUser[msg.sender].identityOwner,
            identityUser[msg.sender].timestampCreation);
    }
   
    /**
     * @notice Destroy the Identity and all the attributes.
     * @dev 'msg.sender' as parameter. Remove all data of the identity, the smart contract and then unlink mapping association between owner 
     * of the identity and the smart contract address. After that you can create a new Identity. 
     * Not possible to delete if you don't have an Identity.
     * Not possible to dolete if your Identity is not empty.
     */
    function deleteIdentity()
        public
        noEmergency
    {
        require(!IdentityLib.isZero(identityUser[msg.sender].issuer));
        require(PersonalIdentity(identityUser[msg.sender].identityContract).attributesCounter() == 0);
        emit IdentityDeleted(msg.sender, identityUser[msg.sender].identityContract, now);
        delete identityUser[msg.sender];
    }
    
    /**
    * @notice Enable the emergency stop.
    * @dev Owner of the smart contract activate the emergency stop. This will produce that no identities can be created or deleted.
    */
    function enableEmergency() 
        public 
        onlyOwner
    {
        emergencyStop = !emergencyStop;        
    }
}

/** 
 * @title Personal Identity IDCard based on an smart contract. 
 * @author Alberto Ballesteros Rodríguez
 * @notice You can store your info (previously encrypted), update it or remove.
 * @dev Factory Contract. Use a dynamic array to store identity attributes of the user. 
 * For more implementation details read the "design_pattern_desecions.md" document. 
 */
contract PersonalIdentity {
    
    address public owner;
    string[] public attributes;

    event DataCreated (address _from, string _value, uint256 _timestamp);
    event DataUpdated (address _from, uint _index, string _value, uint256 _timestamp);
    event DataDeleted (address _from, uint256 _timestamp);
    event IdentityDestroyed (address _from, address _contract, uint256 _timestamp);
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    constructor(address _newOwner) public{
        owner = _newOwner;
    }

    /**
     * @notice Upload new information about your identity.
     * @dev Dynamic array, so the frontend control the order of pushing information inside the array attributes[].
     * @param _value Encrypted information about your identity. Can't be empty information.
     */
    function newData (string _value)
        public
        onlyOwner
    {   
        require(!IdentityLib.isEmpty(_value));
        attributes.push(_value);
        emit DataCreated(msg.sender, _value, now);
    }
    
    /** 
     * @notice Update existing information. 
     * @dev Dynamic array, so the frontend control the order of updating information inside the array attributes[].
     * @param _index Index of the array attributes[] where the info is located.
     * @param _value Encrypted information about your identity. Can't be empty or exiting information.
     */
    function updateData (uint _index, string _value)
        public
        onlyOwner
    {   
        require(!IdentityLib.isEmpty(_value) && !IdentityLib.isEqual(_value, attributes[_index]));
        attributes[_index] = _value;
        emit DataUpdated (msg.sender, _index, _value, now);
    }
    
    /** 
     * @notice Get the number of attributes stored in attributes[] array. 
     * @dev Function used in frontend to display the information. 
     * @return uint Number of elements of the attributes[] array.
    */
    function attributesCounter ()
        public
        view
        returns(uint)
    {
        return attributes.length;
    }
    
    /**
     * @notice Get existing information about the identity.
     * @dev Dynamic array, so the frontend control the order of updating information inside the array attributes[].
     * @param _index Index of the array attributes[] where the info is located. Index lower than attributes.length.
     * @return string Encrypted value of the attribute located. 
    */
    function getData (uint _index)
        public
        view
        returns (string)
    {
        require(_index < attributes.length);
        return attributes[_index];
    }
    
    /** 
     * @notice Remove all your identity attributes stored in the smart contract.
     * @dev Remove all the elements in attributes[] array. Can be called directly or from the 'Identity' contract.
     * Array can't be empty.
     */
    function removeAllData ()
        public
        onlyOwner
    {
        require(attributes.length != 0);
        delete attributes;
        emit DataDeleted (msg.sender, now);
    }
    
    /** 
     * @notice Destroy the Identity and all data stored.
     * @dev Can be called directly or from the 'Identity' contract. Remove all the elements of the attributes array.
     * Smart contract kill function. 
     */
    function destroyContract ()
        public
        onlyOwner
    {
        require(attributes.length == 0);
        emit IdentityDestroyed(msg.sender, this, now);
        selfdestruct(owner);
    }
}