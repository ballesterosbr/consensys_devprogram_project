pragma solidity ^0.4.24;

/** 
 * @title Identity Library
 * @author Alberto Ballesteros Rodríguez
 * @dev Set of functions used for comparison and input checks.
 */
library IdentityLib {

    /**
     * @notice Test if the input address is zero, not null.
     * @dev Compare the input address with 0x0 address.
     * @param _address The input address that you know if is zero.
     * @return True if the address is zero, False otherwise.
     */
    function isZero (address _address)
        internal
        pure
        returns (bool)
    {
        return _address == 0x0;
    }
    
     /**
      * @notice Check if the input string is empty.
      * @dev Check if the string has a length of 0. Casting to bytes.
      * @param _string The string to operate on.
      * @return True if the strig is empty, False otherwise.
      */
    function isEmpty(string _string)
        internal
        pure
        returns (bool)
    {
        return bytes(_string).length == 0;
    }
    
     /**
      * @notice Check if two strings contain the same text.
      * @dev Casting to bytes and calculate the hash of both to compare.
      * @param _a The first string to compare.
      * @param _b The second string to compare.
      * @return True if the strings are equal, False otherwise.
      */
    function isEqual (string _a, string _b)
        internal
        pure
        returns (bool)
    {
        return keccak256(bytes(_a)) == keccak256(bytes(_b));
    }
}
