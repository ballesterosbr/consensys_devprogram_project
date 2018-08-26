// Import the CSS.
import "../stylesheets/app.css";

// Import libraries.
import { default as Web3 } from 'web3';
import { keccak_256 } from 'js-sha3';
import { default as contract } from 'truffle-contract';
import ENS from 'ethereum-ens';
import namehash from 'eth-ens-namehash';

// Import our contracts artifacts and turn them into usable abstractions.
import identity_artifacts from '../../build/contracts/Identity.json';
import personalIdentity_artifacts from '../../build/contracts/PersonalIdentity.json';
import contract_build_artifacts from '../../build/contracts/OraclizePrice.json';

// Identity and PersonalIdentity are our usable abstraction, which we'll use through the code below.
var Identity = contract(identity_artifacts);
var PersonalIdentity = contract(personalIdentity_artifacts);
var OraclizeContract = contract(contract_build_artifacts);

// Array of countries
var country_arr = new Array("Afghanistan", "Albania", "Algeria", "American Samoa", "Angola", "Anguilla", "Antartica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Ashmore and Cartier Island", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Clipperton Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czeck Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Europa Island", "Falkland Islands (Islas Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern and Antarctic Lands", "Gabon", "Gambia, The", "Gaza Strip", "Georgia", "Germany", "Ghana", "Gibraltar", "Glorioso Islands", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Holy See (Vatican City)", "Honduras", "Hong Kong", "Howland Island", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Ireland, Northern", "Israel", "Italy", "Jamaica", "Jan Mayen", "Japan", "Jarvis Island", "Jersey", "Johnston Atoll", "Jordan", "Juan de Nova Island", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia, Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Man, Isle of", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Midway Islands", "Moldova", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcaim Islands", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romainia", "Russia", "Rwanda", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Scotland", "Senegal", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and South Sandwich Islands", "Spain", "Spratly Islands", "Sri Lanka", "Sudan", "Suriname", "Svalbard", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Tobago", "Toga", "Tokelau", "Tonga", "Trinidad", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay", "USA", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands", "Wales", "Wallis and Futuna", "West Bank", "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe");

// ABI of the ENS smart contracts
var ensContract = web3.eth.contract([{ "constant": true, "inputs": [{ "name": "node", "type": "bytes32" }], "name": "resolver", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "node", "type": "bytes32" }], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "node", "type": "bytes32" }, { "name": "label", "type": "bytes32" }, { "name": "owner", "type": "address" }], "name": "setSubnodeOwner", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "node", "type": "bytes32" }, { "name": "ttl", "type": "uint64" }], "name": "setTTL", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "node", "type": "bytes32" }], "name": "ttl", "outputs": [{ "name": "", "type": "uint64" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "node", "type": "bytes32" }, { "name": "resolver", "type": "address" }], "name": "setResolver", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "node", "type": "bytes32" }, { "name": "owner", "type": "address" }], "name": "setOwner", "outputs": [], "payable": false, "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "node", "type": "bytes32" }, { "indexed": false, "name": "owner", "type": "address" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "node", "type": "bytes32" }, { "indexed": true, "name": "label", "type": "bytes32" }, { "indexed": false, "name": "owner", "type": "address" }], "name": "NewOwner", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "node", "type": "bytes32" }, { "indexed": false, "name": "resolver", "type": "address" }], "name": "NewResolver", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "node", "type": "bytes32" }, { "indexed": false, "name": "ttl", "type": "uint64" }], "name": "NewTTL", "type": "event" }]);
var FifsRegistrarContract = web3.eth.contract([{ "constant": true, "inputs": [], "name": "ens", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "bytes32" }], "name": "expiryTimes", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "subnode", "type": "bytes32" }, { "name": "owner", "type": "address" }], "name": "register", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "rootNode", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "type": "function" }, { "inputs": [{ "name": "ensAddr", "type": "address" }, { "name": "node", "type": "bytes32" }], "type": "constructor" }]);
var resolverContract = web3.eth.contract([{ "constant": true, "inputs": [{ "name": "interfaceID", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "node", "type": "bytes32" }, { "name": "contentTypes", "type": "uint256" }], "name": "ABI", "outputs": [{ "name": "contentType", "type": "uint256" }, { "name": "data", "type": "bytes" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "node", "type": "bytes32" }, { "name": "x", "type": "bytes32" }, { "name": "y", "type": "bytes32" }], "name": "setPubkey", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "node", "type": "bytes32" }], "name": "content", "outputs": [{ "name": "ret", "type": "bytes32" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "node", "type": "bytes32" }], "name": "addr", "outputs": [{ "name": "ret", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "node", "type": "bytes32" }, { "name": "contentType", "type": "uint256" }, { "name": "data", "type": "bytes" }], "name": "setABI", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "node", "type": "bytes32" }], "name": "name", "outputs": [{ "name": "ret", "type": "string" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "node", "type": "bytes32" }, { "name": "name", "type": "string" }], "name": "setName", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "node", "type": "bytes32" }, { "name": "hash", "type": "bytes32" }], "name": "setContent", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "node", "type": "bytes32" }], "name": "pubkey", "outputs": [{ "name": "x", "type": "bytes32" }, { "name": "y", "type": "bytes32" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "node", "type": "bytes32" }, { "name": "addr", "type": "address" }], "name": "setAddr", "outputs": [], "payable": false, "type": "function" }, { "inputs": [{ "name": "ensAddr", "type": "address" }], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "node", "type": "bytes32" }, { "indexed": false, "name": "a", "type": "address" }], "name": "AddrChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "node", "type": "bytes32" }, { "indexed": false, "name": "hash", "type": "bytes32" }], "name": "ContentChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "node", "type": "bytes32" }, { "indexed": false, "name": "name", "type": "string" }], "name": "NameChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "node", "type": "bytes32" }, { "indexed": true, "name": "contentType", "type": "uint256" }], "name": "ABIChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "node", "type": "bytes32" }, { "indexed": false, "name": "x", "type": "bytes32" }, { "indexed": false, "name": "y", "type": "bytes32" }], "name": "PubkeyChanged", "type": "event" }]);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var personalAddress;
var attNumber;
var passwordSaved;

window.App = {
  ethGasPrice: 0,
  ethPrice: 0,

  start: function () {
    var self = this;

    Identity.setProvider(web3.currentProvider);
    PersonalIdentity.setProvider(web3.currentProvider);
    OraclizeContract.setProvider(web3.currentProvider);

    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        document.getElementById('password').disabled = true;
        document.getElementById('verifypassword').disabled = true;
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      var address = document.getElementById("address");
      address.innerHTML = "Your address is: " + web3.eth.coinbase;

      accounts = accs;
      account = accounts[0];
      self.refresh();
      self.checkIdentity();
      self.refreshDivsTigger();
      self.isOwner();
      self.getNetwork();
    });
  },

  oracleFunction: function () {

    OraclizeContract.deployed().then(function (contractInstance) {
      var LogGasUpdate = contractInstance.LogGasUpdate({}, { fromBlock: 0, toBlock: 'latest' });
      var LogPriceUpdate = contractInstance.LogPriceUpdate({}, { fromBlock: 0, toBlock: 'latest' });
      var LogInfo = contractInstance.LogInfo({}, { fromBlock: 0, toBlock: 'latest' });

      LogPriceUpdate.watch(function (err, result) {

        if (!err) {
          if (result.args.price == 0) {
            App.ethPrice = App.ethPrice;
            App.setStatus('oraclizePrice', 'ETH Price: ' + App.ethPrice + ' USD - ');
            console.log(App.ethPrice);
          } else {
            App.ethPrice = result.args.price;
            App.setStatus('oraclizePrice', 'ETH Price: ' + App.ethPrice + ' USD - ');
            console.log(App.ethPrice);
          }
        } else {
          console.log(err);
        }
      });

      LogGasUpdate.watch(function (err, result) {

        if (!err) {
          if (result.args.price == 0) {
            App.ethGasPrice = App.ethGasPrice;
            App.setStatus('oraclizeGas', 'ETH Gas Price: ' + App.ethGasPrice + ' Ether <br>');
            console.log(App.ethGasPrice);
          } else {
            App.ethGasPrice = web3.fromWei((result.args.price * 100000000).valueOf(), 'ether');
            App.setStatus('oraclizeGas', 'ETH Gas Price: ' + App.ethGasPrice + ' Ether <br>');
            console.log(App.ethGasPrice);
          }
        } else {
          console.log(err);
        }
      });

      LogInfo.watch(function (err, result) {
        if (!err) {
          console.info(result.args);
        } else {
          console.error(err);
        }
      })
    });
  },

  feeCalculator: function (gasUsed) {
    var self = this;
    if (web3.version.network == "4") {
      self.setStatus('oraclizeStatus', 'Sorry. This functionality is only available for localhost testing. <br>');
    } else {
      console.log(gasUsed + ' gas used');
      console.log(App.ethPrice + ' price');
      console.log(App.ethGasPrice + ' price gas');
      var fee = Number(gasUsed.toString()) * Number(App.ethGasPrice) * Number(App.ethPrice);
      self.setStatus('oraclizeStatus', 'The Cost/Fee of your last transaction in the Ethereum mainnet would be: ' + fee.toFixed(5) + " USD <br>");
    }
  },

  getNetwork: function () {
    var self = this;

    if (web3.version.network == "4") {
      document.getElementById('ensButton_1').disabled = false;
      document.getElementById('ensButton_2').disabled = false;
      document.getElementById('ensButton_3').disabled = false;
      document.getElementById('GetENS').disabled = false;
      self.setStatus('oraclizeStatus', 'Sorry. This functionality is only available for localhost testing. <br>');
      self.setStatus('ENSStatus', 'Please follow the steps! Check the gas before sending the transaction if MetaMask set the limit to maximum.');
    } else {
      self.oracleFunction();
      self.setStatus('ENSStatus', 'Sorry. This functionality is only available in Rinkeby test network.');
      self.setStatus('oraclizeStatus', '');
      document.getElementById('ensButton_1').disabled = true;
      document.getElementById('ensButton_2').disabled = true;
      document.getElementById('ensButton_3').disabled = true;
      document.getElementById('GetENS').disabled = true;
    }
  },

  checkENS: function (inputField) {
    var self = this;

    var ensvalue = document.getElementById(inputField).value;

    var testRegistrar = FifsRegistrarContract.at('0x21397c1A1F4aCD9132fE36Df011610564b87E24b');

    testRegistrar.expiryTimes(web3.sha3(ensvalue), function (err, result) {
      if (!err) {
        if (result.toNumber() == 0) {
          self.setStatus('ENSStatus', 'This domain is available!');
          document.getElementById('ensButton_1').disabled = false;
          document.getElementById('ensButton_2').disabled = false;
          document.getElementById('ensButton_3').disabled = false;
        } else {
          self.setStatus('ENSStatus', 'Domain registered until: ' + self.timestampToDate(result.toNumber()));
          document.getElementById('ensButton_1').disabled = true;
          document.getElementById('ensButton_2').disabled = true;
          document.getElementById('ensButton_3').disabled = true;
        }
      }
      else
        self.setStatus('ENSStatus', 'ERROR: Transaction failed or rejected.');
    });
  },

  registerENS: function () {
    var self = this;

    var testRegistrar = FifsRegistrarContract.at('0x21397c1A1F4aCD9132fE36Df011610564b87E24b');

    var ensvalue = document.getElementById('ENSinput_1').value;

    testRegistrar.register(web3.sha3(ensvalue), account, { from: web3.eth.accounts[0] }, function (err, result) {
      //self.setStatus('ENSStatus', 'Registering your domain... Please wait, this might take a few seconds.');
      if (!err) {
        var url = "https://rinkeby.etherscan.io/tx/" + result;
        self.setStatus('ENSStatus', 'Check the status here: ' + url);
      }
      else
        self.setStatus('ENSStatus', "ERROR: Transaction failed or rejected. Domain not registered.");
    });
  },

  saveENS: function () {
    var self = this;

    var ens = ensContract.at('0xe7410170f87102DF0055eB195163A03B7F2Bff4A');
    var publicResolver = resolverContract.at('0x5d20cf83CB385e06D2F2A892F9322cd4933eAcDc');

    var ensvalue = document.getElementById('ENSinput_2').value;

    ens.setResolver(namehash.hash(ensvalue), publicResolver.address, { from: web3.eth.accounts[0] }, function (err, result) {
      //self.setStatus('ENSStatus', 'Saving your domain in the ENS Public Registry... Please wait, this might take a few seconds.');
      if (!err) {
        var url = "https://rinkeby.etherscan.io/tx/" + result;
        self.setStatus('ENSStatus', 'Check the status here: ' + url);
      }
      else
        self.setStatus('ENSStatus', "ERROR: Transaction failed or rejected. Domain not saved.");
    });
  },

  linkENS: function () {
    var self = this;

    var publicResolver = resolverContract.at('0x5d20cf83CB385e06D2F2A892F9322cd4933eAcDc');

    var ensvalue = document.getElementById('ENSinput_3').value;

    publicResolver.setAddr(namehash.hash(ensvalue), account, { from: web3.eth.accounts[0] }, function (err, result) {
      //self.setStatus('ENSStatus', 'Linking your domain with your account... Please wait, this might take a few seconds.');
      if (!err) {
        var url = "https://rinkeby.etherscan.io/tx/" + result;
        self.setStatus('ENSStatus', 'Check the status here: ' + url);
      }
      else
        self.setStatus('ENSStatus', "ERROR: Transaction failed or rejected. Domain not linked.");
    });
  },

  testENS: function () {
    var self = this;
    var ens = new ENS(web3.currentProvider);
    var ensValue = document.getElementById('ENSinput').value;

    ens.resolver(ensValue.toString()).addr().then(function (addr) {
      if (addr == web3.eth.accounts[0]) {
        document.getElementById("address").innerHTML = 'Your address is: ' + ensValue;
        document.getElementById('ensButton_1').disabled = true;
        document.getElementById('ensButton_2').disabled = true;
        document.getElementById('ensButton_3').disabled = true;
      } else {
        document.getElementById("address").innerHTML = 'Your address is: ' + account;
        self.setStatus('ENSStatus', 'This domain is not associated with this account!');
        document.getElementById('ensButton_1').disabled = false;
        document.getElementById('ensButton_2').disabled = false;
        document.getElementById('ensButton_3').disabled = false;
      }
    }).catch(function () {
      document.getElementById("address").innerHTML = 'Your address is: ' + account;
      self.setStatus('ENSStatus', 'This domain is not associated with this account!');
      document.getElementById('ensButton_1').disabled = false;
      document.getElementById('ensButton_2').disabled = false;
      document.getElementById('ensButton_3').disabled = false;
    });
  },

  generateENS: function () {
    var ens = new ENS(web3.currentProvider);

    var ensvalue = document.getElementById('ENSinput').value;
    ens.regis
    ens.setResolver(ensvalue, resolverAddress, { from: account }).then(function (v) {
    })
  },

  openTab: function (evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

  },

  selectCountries: function (countryElementId) {

    var countryElement = document.getElementById(countryElementId);
    countryElement.length = 0;
    countryElement.selectedIndex = 0;
    for (var i = 0; i < country_arr.length; i++) {
      countryElement.options[countryElement.length] = new Option(country_arr[i], country_arr[i]);
    }
  },

  cifrador: function (message, text) {
    var crypto = require('crypto'),
      algorithm = 'aes-256-ctr',
      password = message;

    var cipher = crypto.createCipher(algorithm, password);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  },

  descifrador: function (message, text) {
    var crypto = require('crypto'),
      algorithm = 'aes-256-ctr',
      password = message;

    var decipher = crypto.createDecipher(algorithm, password);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  },

  verifyPassword: function (password, verifypassword) {
    var self = this;
    this.timerPassword();

    if (keccak_256(document.getElementById(password).value) === keccak_256(document.getElementById(verifypassword).value)) {
      document.getElementById(password).disabled = true;

      document.getElementById(verifypassword).disabled = true;
      document.getElementById('passwordButton').disabled = true;
      passwordSaved = keccak_256(document.getElementById(password).value);
      self.setStatus('passwordStatus', 'Your password will expire in 10 minutes for your secure. Please, save it in a secure place!');
      //self.enableAddButtons();
      self.refreshDivs();
    } else {
    }
  },

  timerPassword: function () {
    var self = this;
    var countDownDate = new Date().getTime() + 600000;

    // Update the count down every 1 second
    var x = setInterval(function () {
      // Get todays date and time
      var now = new Date().getTime();
      // Find the distance between now an the count down date
      var distance = countDownDate - now;
      // Time calculations for days, hours, minutes and seconds
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      // Display the result in the element with id="demo"
      document.getElementsByClassName("tab")[0].getElementsByClassName("tablinks")[4].innerHTML = "Password: " + minutes + "m " + seconds + "s ";

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        self.passwordExpired();
        self.setStatus('passwordStatus', 'Your password has expired.');
      }
    }, 500)

    document.getElementById('stopPassword').addEventListener('click', function () {
      clearInterval(x);
      self.passwordExpired();
      self.setStatus('passwordStatus', 'Your password has expired.');
    });
  },

  passwordExpired: function () {
    var self = this;
    passwordSaved = undefined;
    document.getElementsByClassName("tab")[0].getElementsByClassName("tablinks")[4].innerHTML = "Password: Expired";
    document.getElementById('password').disabled = false;
    document.getElementById('password').value = "";
    document.getElementById('verifypassword').disabled = false;
    document.getElementById('verifypassword').value = "";
    self.setStatus('addAttributeStatus', 'Your password has expired.');
    self.refreshDivsTigger();
    self.disableInputForm();
    self.showClean();
  },

  enableAddButtons: function () {
    document.getElementById('addAttribute').disabled = false;
  },

  disableInputForm: function () {
    document.getElementById('input1').disabled = true;
    document.getElementById('input2').disabled = true;
    document.getElementById('input3').disabled = true;
    document.getElementById('input4').disabled = true;
    document.getElementById('input5').disabled = true;
    document.getElementById('input6').disabled = true;
    document.getElementById('input7').disabled = true;
    document.getElementById('addAttribute').disabled = true;
  },

  checkPassword: function (message) {
    var self = this;
    var input = document.getElementById(message).value;
    var patron = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{10,}$/;


    if (!patron.test(input)) {
      document.getElementById('passwordButton').disabled = true;

    } else if (keccak_256(document.getElementById('password').value) !== keccak_256(document.getElementById('verifypassword').value)) {
      document.getElementById('passwordButton').disabled = true;
      self.setStatus('passwordStatus', 'Sorry. Your passwords do not match. Please check and try again.');
    } else {
      document.getElementById('passwordButton').disabled = false;
      self.setStatus('passwordStatus', '');
    }
  },

  checkEmail: function (message, status) {

    var self = this;
    var input = document.getElementById(message).value;
    var patron = /^([a-z]+[a-z1-9._-]*)@{1}([a-z1-9\.]{2,})\.([a-z]{2,3})$/;

    if (!patron.test(input)) {
      document.getElementById('addAttribute').disabled = true;
      document.getElementById('updateAttribute').disabled = true;
      self.setStatus(status, "Please enter a valid email.");
    } else {
      document.getElementById('addAttribute').disabled = false;
      document.getElementById('updateAttribute').disabled = false;
      self.setStatus(status, "");
    }
  },

  checkPhone: function (message, status) {

    var self = this;
    var input = document.getElementById(message).value;
    var patron = /^[0-9\-\+]{6,15}$/;

    if (!patron.test(input)) {
      document.getElementById('addAttribute').disabled = true;
      document.getElementById('updateAttribute').disabled = true;
      self.setStatus(status, "Please enter a valid mobile phone.");
    } else {
      document.getElementById('addAttribute').disabled = false;
      document.getElementById('updateAttribute').disabled = false;
      self.setStatus(status, "");
    }
  },

  checkKey: function (input, status) {
    var self = this;
    var receiver = document.getElementById(input).value;

    if (receiver.length == 0) {
      document.getElementById('addAttribute').disabled = true;
      document.getElementById('updateAttribute').disabled = true;
      self.setStatus(status, "Please enter a valid name or lastname.");
    } else if (receiver.length > 1) {
      document.getElementById('addAttribute').disabled = false;
      document.getElementById('updateAttribute').disabled = false;
      self.setStatus(status, "");
    } else {
      document.getElementById('addAttribute').disabled = true;
      document.getElementById('updateAttribute').disabled = true;
      self.setStatus(status, "Please enter a valid name or lastname.");
    }
  },

  checkDate: function (input, status) {

    var self = this;
    var receiver = document.getElementById(input).value;
    var patron = /^\d{2}[/]\d{2}[/]\d{4}$/;
    var array = receiver.split("/");
    var dt = new Date();
    var year = array[array.length - 1];
    var month = array[array.length - 2];
    var day = array[array.length - 3];

    if (!patron.test(receiver) || parseInt(year) < 1900 || parseInt(year) > dt.getFullYear() - 18 || parseInt(day) < 1 || parseInt(day) > 31 || parseInt(month) < 1 || parseInt(month) > 12) {
      self.setStatus(status, "Please enter a valid date.");
      document.getElementById('addAttribute').disabled = true;
      document.getElementById('updateAttribute').disabled = true;
    } else {
      self.setStatus(status, "");
      document.getElementById('addAttribute').disabled = false;
      document.getElementById('updateAttribute').disabled = false;

    }
  },

  showClean: function () {
    for (var i = 1; i <= 5; i++) {
      document.getElementById('input' + i).value = "";
    }

    for (var i = 1; i <= 7; i++) {
      document.getElementById('show' + i).value = "";
      document.getElementById('show' + i).disabled = true;
      document.getElementById('checkbox' + i).checked = false;
    }
  },

  refresh: function () {
    var self = this;
    var account = web3.eth.accounts[0];

    var accountInterval = setInterval(function () {
      if (web3.eth.accounts[0] !== account) {
        account = web3.eth.accounts[0];
        var address = document.getElementById("address");
        address.innerHTML = "Your address is: " + account;
        personalAddress = undefined;
        self.resetDivs();
        self.showClean();
        self.checkIdentity();
        self.getNewIdentity();
        self.getNetwork();
        //self.isOwner();
      }
    }, 500);
  },

  checkIdentity: function () {
    var self = this;

    Identity.deployed().then(function (contractInstance) {
      contractInstance.getUser({ from: web3.eth.accounts[0] }).then(function (v) {
        if (v[1] === '0x0000000000000000000000000000000000000000') {
          document.getElementById("manageStatus").innerHTML = "You don't have an identity, create one right now!";
          document.getElementById("addStatus").innerHTML = "You don't have an identity, create one right now!";
          document.getElementById('createIdentity').disabled = false;
          self.setStatus('homeStatus', '');
          personalAddress = undefined;
          self.refreshDivsTigger();
          self.isOwner();
        } else {
          document.getElementById("manageStatus").innerHTML = "Your contract address is: " + v[1];
          document.getElementById("addStatus").innerHTML = "Your contract address is: " + v[1];
          document.getElementById('createIdentity').disabled = true;
          self.setStatus('homeStatus', 'You already own an Identity. Please, select "My Identity" tab to see your Identity information.');
          personalAddress = v[1];
          self.refreshDivsTigger();
          self.isOwner();
        }
      });
    });
  },

  setStatus: function (stat, message) {
    var status = document.getElementById(stat);
    status.innerHTML = message;
  },

  refreshDivsTigger: function () {
    if (personalAddress) {
      document.getElementById('removeAttribute').disabled = false;
      PersonalIdentity.at(personalAddress.toString()).then(function (contractInstance) {
        contractInstance.attributesCounter({ from: web3.eth.accounts[0] }).then(function (v) {
          attNumber = v.toString();
          App.setStatus('homeStatus', 'You already own an Identity. Please, select "My Identity" tab to see your Identity information.');
          App.refreshDivs();
        });
      });
    } else {
      App.resetDivs();
      App.setStatus('homeStatus', '');
      document.getElementById('removeAttribute').disabled = true;
    }
  },

  refreshDivs: function () {
    var self = this;

    if (passwordSaved) {
      if (attNumber > 0 && attNumber < 7) {
        self.setStatus('addAttributeStatus', 'Continue adding attributes to your Identity');
        for (var i = 1; i <= attNumber; i++) {
          document.getElementById('attribute' + (i + 1)).style.display = 'inline';
          document.getElementById('showAttribute' + i).style.display = 'inline';
          document.getElementById('input' + i).disabled = true;
          document.getElementById('checkbox' + i).disabled = false;
        }
        var index = parseInt(attNumber) + 1;
        document.getElementById('input' + index).disabled = false;
        document.getElementById('addAttribute').disabled = false;
        document.getElementById('removeAttribute').disabled = false;
      } else if (attNumber == 7) {
        self.setStatus('addAttributeStatus', 'Identity complete.');
        for (var i = 1; i <= attNumber; i++) {
          document.getElementById('input' + i).disabled = true;
          document.getElementById('attribute' + i).style.display = 'inline';
          document.getElementById('showAttribute' + i).style.display = 'inline';
          document.getElementById('checkbox' + i).disabled = false;
        }
        document.getElementById('removeAttribute').disabled = false;
        document.getElementById('addAttribute').disabled = true;
      } else if (attNumber == 0) {
        document.getElementById('removeAttribute').disabled = true;
        self.setStatus('addAttributeStatus', 'Start adding attributes to your Identity.');
        document.getElementById('addAttribute').disabled = false;
        document.getElementById('input1').disabled = false;
      } else {
        self.resetDivs();
      }
    } else {
      if (attNumber > 0 && attNumber < 7) {
        self.setStatus('addAttributeStatus', 'Introduce your password to continue adding attributes to your Identity');
        for (var i = 1; i <= attNumber; i++) {
          document.getElementById('attribute' + (i + 1)).style.display = 'inline';
          document.getElementById('showAttribute' + i).style.display = 'inline';
          document.getElementById('input' + i).disabled = true;
          document.getElementById('checkbox' + i).disabled = true;
        }
        var index = parseInt(attNumber) + 1;
        document.getElementById('input' + index).disabled = true;
        document.getElementById('addAttribute').disabled = true;
        document.getElementById('removeAttribute').disabled = false;
      } else if (attNumber == 7) {
        self.setStatus('addAttributeStatus', 'Identity complete.');
        for (var i = 1; i <= attNumber; i++) {
          document.getElementById('input' + i).disabled = true;
          document.getElementById('attribute' + i).style.display = 'inline';
          document.getElementById('showAttribute' + i).style.display = 'inline';
          document.getElementById('checkbox' + i).disabled = true;
        }
        document.getElementById('addAttribute').disabled = true;
        document.getElementById('removeAttribute').disabled = false;
      } else if (attNumber == 0) {
        document.getElementById('removeAttribute').disabled = true;
        self.setStatus('addAttributeStatus', 'Introduce your password to start adding attributes to your Identity.');
        document.getElementById('showAttribute' + i).style.display = 'inline';
        document.getElementById('addAttribute').disabled = true;
        document.getElementById('input1').disabled = true;
      } else {
        self.resetDivs();
      }
    }
  },

  resetDivs: function () {
    var self = this;

    for (var i = 1; i <= 6; i++) {
      document.getElementById('attribute' + (i + 1)).style.display = 'none';
    }

    for (var i = 1; i <= 7; i++) {
      document.getElementById('showAttribute' + i).style.display = 'none';
      document.getElementById('checkbox' + i).checked = false;
    }
  },

  newIdentity: function () {
    var self = this;

    self.setStatus('homeStatus', "Creating Identity... Please wait.");

    Identity.deployed().then(function (contractInstance) {
      contractInstance.newIdentity({ from: web3.eth.accounts[0] }).then(function (v) {
        for (var i = 0; i < v.logs.length; i++) {
          var log = v.logs[i];
          if (log.event == "IdentityCreated") {
            self.setStatus('identityStatus', "Identity has been created successfully!");
            document.getElementsByClassName('tablinks')[1].click();
            document.getElementById("id_info").rows[0].cells[1].innerHTML = log.args._issuer;
            document.getElementById("id_info").rows[1].cells[1].innerHTML = log.args._contract;
            document.getElementById("id_info").rows[2].cells[1].innerHTML = log.args._owner;
            document.getElementById("id_info").rows[3].cells[1].innerHTML = self.timestampToDate(log.args._timestamp);
            personalAddress = log.args._contract;
            self.feeCalculator(v.receipt.gasUsed);
            break;
          }
        }
      }).catch(function () {
        self.setStatus('identityStatus', "ERROR: Transaction failed or rejected. Identity not created.");
      });
    });
  },

  isOwner: function () {
    Identity.deployed().then(function (contractInstance) {
      contractInstance.owner({ from: web3.eth.accounts[0] }).then(function (v) {
        if (v == web3.eth.accounts[0]) {
          document.getElementsByClassName("tab")[0].getElementsByClassName("tablinks")[5].style.display = 'block';
          document.getElementById('emergency').style.display = 'block';
          document.getElementById('emergencyStatus').style.display = 'block';
        } else {
          document.getElementsByClassName("tab")[0].getElementsByClassName("tablinks")[5].style.display = 'none';
          document.getElementById('emergency').style.display = 'none';
          document.getElementById('emergencyStatus').style.display = 'none';
        }
      })
    })

  },
  enableEmergency: function () {
    var self = this;
    Identity.deployed().then(function (contractInstance) {
      contractInstance.enableEmergency({ from: web3.eth.accounts[0] }).then(function (v) {
        self.setStatus('emergencyStatus', "Contract stopped by the owner.");
      }).catch(function () {
        self.setStatus('emergencyStatus', "ERROR: Transaction failed or rejected. Emergency not enabled.");
      });
    });
  },

  timestampToDate: function (timestamp) {
    var ts = new Date(timestamp * 1000);
    return ts.toGMTString();
  },

  getNewIdentity: function () {
    var self = this;

    self.setStatus('identityStatus', "Checking your Identity information...");

    Identity.deployed().then(function (contractInstance) {
      contractInstance.getUser({ from: web3.eth.accounts[0] }).then(function (v) {
        if (v[1] === '0x0000000000000000000000000000000000000000') {
          self.setStatus('identityStatus', "You don't have an identity, create one right now!");
          document.getElementById("id_info").rows[0].cells[1].innerHTML = "Issuer not found.";
          document.getElementById("id_info").rows[1].cells[1].innerHTML = "Contract not found."
          document.getElementById("id_info").rows[2].cells[1].innerHTML = "Owner not found."
          document.getElementById("id_info").rows[3].cells[1].innerHTML = "Creation date nof found."
        } else {
          self.setStatus('identityStatus', "Showing Identity information.");
          document.getElementById("id_info").rows[0].cells[1].innerHTML = v[0];
          document.getElementById("id_info").rows[1].cells[1].innerHTML = v[1];
          document.getElementById("id_info").rows[2].cells[1].innerHTML = v[2];
          document.getElementById("id_info").rows[3].cells[1].innerHTML = self.timestampToDate(v[3].c[0]);
          personalAddress = v[1];
        }
      });
    });
  },

  confirmForget: function () {
    var self = this;
    self.setStatus('destroyStatus', "Forgetting Identity, this will delete all your Identity information...");

    Identity.deployed().then(function (contractInstance) {
      contractInstance.deleteIdentity({ gas: 140000, from: web3.eth.accounts[0] }).then(function (v) {
        for (var i = 0; i < v.logs.length; i++) {
          var log = v.logs[i];
          if (log.event == "IdentityDeleted") {
            self.setStatus('identityStatus', "Identity has been forgotten successfully!");
            self.setStatus('destroyStatus', "Identity contract '" + log.args._contract + "' forgot by " + log.args._from + " at: " + self.timestampToDate(log.args._timestamp));
            self.checkIdentity();
            self.getNewIdentity();
            self.feeCalculator(v.receipt.gasUsed);
          }
        }
      }).catch(function () {
        self.setStatus('destroyStatus', "ERROR: Transaction failed or rejected. Identity not deleted.");
      });
    });
  },

  forgetIdentity: function () {
    var self = this;
    var confirmation;
    PersonalIdentity.at(personalAddress.toString()).then(function (contractInstance) {
      contractInstance.attributesCounter({ from: web3.eth.accounts[0] }).then(function (v) {
        if (v.toNumber() !== 0) {
          self.setStatus('destroyStatus', "For security purposes a non-empty Identity can't be deleted.");
          return;
        } else {
          self.setStatus('destroyStatus', "");
          confirmation = confirm("You are going to forget your Identity. Are you sure?");
          if (confirmation) {
            App.confirmForget();
          }
        }
      });
    });
  },

  addAttribute: function () {
    var self = this;
    document.getElementById('addAttribute').disabled = true;

    self.setStatus('addedAttribute', "Adding attribute... Please wait, this might take a few seconds.");

    var inputValue = 'input' + (parseInt(attNumber) + 1);
    document.getElementById(inputValue).disabled = true;
    var receiver = document.getElementById(inputValue).value;
    var valencrypted = self.cifrador(keccak_256(document.getElementById('password').value), receiver);

    PersonalIdentity.at(personalAddress.toString()).then(function (contractInstance) {
      contractInstance.newData(valencrypted, { from: web3.eth.accounts[0] }).then(function (v) {
        for (var i = 0; i < v.logs.length; i++) {
          var log = v.logs[i];
          if (log.event == "DataCreated") {
            self.setStatus('addedAttribute', "Attribute '" + log.args._value + "' created by " + log.args._from + " at: " + self.timestampToDate(log.args._timestamp));
            attNumber = parseInt(attNumber) + 1;;
            document.getElementById('addAttribute').disabled = false;
            document.getElementById(inputValue).disabled = false;
            self.refreshDivs();
            self.feeCalculator(v.receipt.gasUsed);
          }
        }
      }).catch(function () {
        self.setStatus('addedAttribute', "ERROR: Transaction failed or rejected. Check that your attribute is not empty.");
      });
    });
  },

  checkboxUpdate: function () {
    var self = this;

    for (var i = 1; i <= 7; i++) {
      if (document.getElementById('checkbox' + i).checked == true) {
        document.getElementById('show' + i).disabled = false;
        document.getElementById('show' + i).value = "";
        document.getElementById('show' + i).placeholder = "Introduce the new attribute"
        self.setStatus('updateStatus', "Attribute can't be empty and must be different from the actual. Otherwise the transaction will fail");
      }
    }
  },

  getUpdateAttribute: function () {
    var self = this;

    for (var i = 1; i <= 7; i++) {
      if (document.getElementById('show' + i).disabled == false) {
        self.updateAttribute(i - 1, document.getElementById('show' + i).value);
      }
    }
  },

  updateAttribute: function (index, value) {
    var self = this;

    document.getElementById('show' + (index + 1)).disabled = true;

    self.setStatus('updateStatus', 'Updating attribute... Please wait, this might take a few seconds.');

    var valencrypted = self.cifrador(keccak_256(document.getElementById('password').value), value);
    PersonalIdentity.at(personalAddress.toString()).then(function (contractInstance) {
      contractInstance.updateData(index, valencrypted, { from: web3.eth.accounts[0] }).then(function (v) {
        for (var i = 0; i < v.logs.length; i++) {
          var log = v.logs[i];
          if (log.event == "DataUpdated") {
            self.setStatus('updateStatus', "Attribute '" + log.args._value + "' updated by " + log.args._from + " at: " + self.timestampToDate(log.args._timestamp));
            self.feeCalculator(v.receipt.gasUsed);
          }
        }
      }).catch(function () {
        self.setStatus('updateStatus', "ERROR: Transaction failed or rejected. Check that your attribute is not empty and different from the actual.");
      });
    });
  },

  checkboxSelection: function () {
    var self = this;
    for (var i = 1; i <= 7; i++) {
      if (document.getElementById('checkbox' + i).checked == true) {
        self.getAttributes(i - 1);
        self.setStatus('updateStatus', 'Loading... Please wait, this might take a few seconds.');
      }
    }
  },

  getAttributes: function (index) {
    PersonalIdentity.at(personalAddress.toString()).then(function (contractInstance) {
      contractInstance.getData(index, { from: web3.eth.accounts[0] }).then(function (v) {
        document.getElementById('show' + (index + 1)).value = App.descifrador(keccak_256(document.getElementById('password').value), v);
        App.setStatus('updateStatus', 'Attributes loaded.');
      }).catch(function () {
        self.setStatus('updateStatus', "ERROR: Can't load the attribute(s).");
      });
    });
  },

  removeAllAttributes: function () {
    var self = this;

    self.setStatus('removeStatus', 'Removing attribute... Please wait, this might take a few seconds.');

    PersonalIdentity.at(personalAddress.toString()).then(function (contractInstance) {
      contractInstance.removeAllData({ gas: 140000, from: web3.eth.accounts[0] }).then(function (v) {
        for (var i = 0; i < v.logs.length; i++) {
          var log = v.logs[i];
          if (log.event == "DataDeleted") {
            self.setStatus('removeStatus', "All data removed by: " + log.args._from + " at: " + self.timestampToDate(log.args._timestamp));
            attNumber = 0;
            self.resetDivs();
            self.showClean();
            self.feeCalculator(v.receipt.gasUsed);
            break;
          }
        }
      }).catch(function () {
        self.setStatus('removeStatus', "ERROR: Transaction failed or rejected. Data not removed.");
      });
    });
  }
};

window.addEventListener('load', function () {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  }
  App.start();
});