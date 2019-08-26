var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;

var BatteryControler = {
    name: "Simple Battery", //name of accessory
    pincode: "031-45-154",
    username: "2A:3B:4C:6D:E:7F", // MAC like address used by HomeKit to differentiate accessories. 
    manufacturer: "HAP-NodeJS", //manufacturer (optional)
    model: "v1.0", //model (optional)
    serialNumber: "A12S345KGB", //serial number (optional)
  
    batteryLevel: 0, //curent battery level [0% -> 100%]
    chargingState: 1, // Current chargingState [0 : Not charging | 1 : Charging | 2 : Not chargeable]
    statusLowBattery: 1, // Current Status Low Battery [0 : Normal | 1 : Low battery]

    outputLogs: true, //output logs
  
    getBatteryLevel: function(batteryLevel) { //set power of accessory
      if(this.outputLogs) console.log("Battery level of '%s' is %s", this.name, this.batteryLevel);
    //   this.batteryLevel = batteryLevel;
      return this.batteryLevel;
    },

    getchargingState: function(chargingState) { //set power of accessory
        if(this.outputLogs) console.log("charging state of '%s' is %s", this.name, this.chargingState);
        // this.chargingState = chargingState;
        return this.chargingState;
      },

    getStatusLowBattery: function(statusLowBattery) { //set power of accessory
        if(this.outputLogs) console.log("Status low battery of '%s' is %s", this.name, this.statusLowBattery);
        // this.statusLowBattery = statusLowBattery;
        return this.statusLowBattery;
    },


    identify: function() { //identify the accessory
      if(this.outputLogs) console.log("Identify the '%s'", this.name);
    }
  }

  // Generate a consistent UUID for our battery Accessory that will remain the same even when
// restarting our server. We use the `uuid.generate` helper function to create a deterministic
// UUID based on an arbitrary "namespace" and the word "battery".
var batteryUUID = uuid.generate('hap-nodejs:accessories:battery' + BatteryControler.name);

// This is the Accessory that we'll return to HAP-NodeJS that represents our light.
var batteryAccessory = exports.accessory = new Accessory(BatteryControler.name, batteryUUID);

// Add properties for publishing (in case we're using Core.js and not BridgedCore.js)
batteryAccessory.username = BatteryControler.username;
batteryAccessory.pincode = BatteryControler.pincode;

// set some basic properties (these values are arbitrary and setting them is optional)
batteryAccessory
  .getService(Service.AccessoryInformation)
    .setCharacteristic(Characteristic.Manufacturer, BatteryControler.manufacturer)
    .setCharacteristic(Characteristic.Model, BatteryControler.model)
    .setCharacteristic(Characteristic.SerialNumber, BatteryControler.serialNumber);


// listen for the "identify" event for this Accessory
batteryAccessory.on('identify', function(paired, callback) {
    BatteryControler.identify();
    callback();
  });

// Add the actual Lightbulb Service and listen for change events from iOS.
// We can see the complete list of Services and Characteristics in `lib/gen/HomeKitTypes.js`
batteryAccessory
  .addService(Service.BatteryService, BatteryControler.name) // services exposed to the user should have "names" like "Light" for this case
  .getCharacteristic(Characteristic.BatteryLevel)

  // We want to intercept requests for our current power state so we can query the hardware itself instead of
  // allowing HAP-NodeJS to return the cached Characteristic.value.
  .on('get', function(callback) {
    callback(null, BatteryControler.getBatteryLevel());
  });

// also add Characteristic for charging state
batteryAccessory
.getService(Service.BatteryService)
.getCharacteristic(Characteristic.ChargingState)

.on('get', function(callback) {
  callback(null, BatteryControler.getchargingState());
});

// also add Characteristic for status low battery
batteryAccessory
.getService(Service.BatteryService)
.getCharacteristic(Characteristic.StatusLowBattery)

.on('get', function(callback) {
  callback(null, BatteryControler.getStatusLowBattery());
});