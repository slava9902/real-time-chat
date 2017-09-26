(function(converter) {
  var kCubicMeterToCubicFoot = 35.3146667;
  return converter.exports = {
    convertWeight: function(value, srcUnits, destUnits) {
      destUnits = destUnits || 'lb';
      if (srcUnits != destUnits) {
        switch (srcUnits) {
          case 'KG':
          case 'kg':
            value *= 2.20462;
            break;
          case 'CWT':
          case 'cwt':
            value *= 100;
        }
        switch (destUnits) {
          case 'KG':
          case 'kg':
            value /= 2.20462;
            break;
          case 'cwt':
          case 'CWT':
            value /= 100;
        }
      }
      return value;
    },
    convertVolume: function(value, srcUnits, destUnits) {
      destUnits = destUnits || 'cft';
      if (srcUnits != destUnits) {
        switch (srcUnits) {
          case 'CBM':
          case 'cbm':
          case 'MT':
          case 'mt':
            value *= kCubicMeterToCubicFoot;
            break;
          case 'kg_acw':
          case 'KG_ACW':
            value *= 2.20462 / 10.4;
        }
        switch (destUnits) {
          case 'CBM':
          case 'cbm':
          case 'MT':
          case 'mt':
            value /= kCubicMeterToCubicFoot;
            break;
          case 'kg_acw':
          case 'KG_ACW':
            value *= 10.4 / 2.20462;

        }
      }
      return value;
    },
    getShipmentType: function(tariffType) {
      var encodedType;
      switch (tariffType) {
        case 'fcl_l':
        case 'FCL_L':
          encodedType = 'fclLoose';
          break;
        case 'fcl_c':
        case 'FCL_C':
          encodedType = 'fclCased';
          break;
        case 'LCL':
        case 'lcl':
          encodedType = 'lcl';
          break;
        case 'Air':
        case 'AIR':
          encodedType = 'air';
          break;
        case 'road':
        case 'Road':
          encodedType = 'road';
          break;
        case 'Road_B':
          encodedType = 'roadBlanket';
          break;
        case 'Road_E':
          encodedType = 'roadExport';
          break;
      }
      return encodedType;
    },
    getDisplayShipmentType: function(shipmentType) {
      var displayType;
      switch (shipmentType) {
        case 'FCL_C':
        case 'fcl_c':
          displayType = 'FCL (Cased)';
          break;
        case 'FCL_L':
        case 'fcl_l':
          displayType = 'FCL (Loose)';
          break;
        case 'Air':
        case 'AIR':
          displayType = 'Air';
        case 'LCL':
        case 'lcl':
          displayType = 'LCL';
        case 'road':
        case 'Road':
          displayType = 'Road';
      }
      return displayType;
    },
    getShipmentTypeValue: function(value) {
      switch (value) {
        case 'fclCased':
        case 'FCL (Cased)':
          return 'FCL_C';
        case 'fclLoose':
        case 'FCL (Loose)':
          return 'FCL_L';
        case 'air':
        case 'AIR':
          return 'Air';
        case 'LCL':
        case 'lcl':
          return 'LCL';
        case 'road':
        case 'Road':
          return 'Road';
        default:
          return 'FCL_L';
      }
    },


    getBasisTypeValue: function(value) {
      switch (value) {

        case 'CUBIC_FOOT':
          return 'cubic feet, per CFT';

        case 'CUBIC_FOOT_FLAT':
          return 'cubic feet, flat';
        case 'CUBIC_METER':
          return 'cubic meters, per CBM';
        case 'CUBIC_METER_FLAT':
          return 'cubic meters, flat';

        case 'LB':
          return 'pounds, per CWT';
        case 'LB_FLAT':
          return 'pounds, flat';
        default:
          return 'cubic feet, per CFT';
      }
    },
    tariffIsVolumnBased : function(value){
        var volumn_basis = ['CUBIC_FOOT', 'CUBIC_FOOT_FLAT', 'CUBIC_METER', 'CUBIC_METER_FLAT']
        if(volumn_basis.indexOf(value)==-1){
            return false
        }else{
            return true
        }
    },

    getVolumnUnitMt : function(value){
        var volumn_unit = ['CUBIC_METER', 'CUBIC_METER_FLAT']
        if(volumn_unit.indexOf(value)==-1){
            return false
        }else{
            return true
        }
    },
    getIsMinDensity : function(value){
        var density_type = ['LB', 'LB_FLAT']
        if(density_type.indexOf(value)==-1){
            return false;
        }else{
            return true;
        }
    }


  };
})(module);
