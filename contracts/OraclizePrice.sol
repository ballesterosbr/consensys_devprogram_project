pragma solidity ^0.4.21;

/**
 * Import usingOraclize.sol
*/
import "installed_contracts/oraclize-api/contracts/usingOraclize.sol";

/** 
* @author Alberto Ballesteros Rodríguez
* @notice You can use this contract to get ETHUSD price and Gas price.
* @dev Two querys using different IDs to the callback function. 
*/
contract OraclizePrice is usingOraclize {

    string public ETHGAS;
    string public ETHprice;

    event LogInfo(string description);
    event LogPriceUpdate(string price);
    event LogGasUpdate(string price);
    
    enum oraclizeState 
    { 
        ForPrice, 
        ForGas
    }
    
    struct oraclizeCallback 
    {
        oraclizeState oState;
    }
    
    mapping (bytes32 => oraclizeCallback) public oraclizeCallbacks;

    constructor()
        public 
        payable
    {
        // Replace the next line with your version:
        OAR = OraclizeAddrResolverI(0x1d05bADcBD3F4657d478dEbB471534156523b3D3);
        getPriceDetails();
        getGasDetails();
    }
    
    /**
    * @notice Callback function to emit the events with the information we want.
    * @dev Get the querys using the parameter myid and differ with oState
    * @param myid The id of the query
    * @param result The result of the query
    */
    function __callback(bytes32 myid, string result)
        public
    {
        require (msg.sender == oraclize_cbAddress());
        oraclizeCallback memory o = oraclizeCallbacks[myid];
        if (o.oState == oraclizeState.ForPrice) {
            ETHprice = result;
            emit LogPriceUpdate(ETHprice);
            getPriceDetails();

        } else if (o.oState == oraclizeState.ForGas) {
            ETHGAS = result;
            emit LogGasUpdate(ETHGAS);
            getGasDetails();
        }
    }

    /**
    * @notice Function to get the ETHUSD price from etherscan.io
    * @dev Oraclize query callin the callback function
    */
    function getPriceDetails() 
        public
        payable
    {
        emit LogInfo("Oraclize query was sent, standing by for the answer..");
        bytes32 queryId = oraclize_query("URL", "json(https://api.etherscan.io/api?module=stats&action=ethprice).result.ethusd");
        oraclizeCallbacks[queryId] = oraclizeCallback(oraclizeState.ForPrice);
    }

    /**
    * @notice Function to get the Gas price from ETHGasStation
    * @dev Oraclize query callin the callback function
    */
    function getGasDetails()
        public
        payable
    {
        emit LogInfo("Oraclize query was sent, standing by for the answer..");
        bytes32 queryId = oraclize_query("URL", "json(https://ethgasstation.info/json/ethgasAPI.json).average");
        oraclizeCallbacks[queryId] = oraclizeCallback(oraclizeState.ForGas);
    }
}