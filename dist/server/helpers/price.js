(function(price) {
  var getPriceFromPricePoints = function(pricepoints, weight, volume, minimumDensity, basis) {
      return pricepoints.map(function(pricepoint) {
        return pricepoint.getPrice(weight, volume, minimumDensity, basis);
      }).reduce(function(prices, price) {

        if (prices.length) {
          prices[prices.length - 1].maximumVolume = price.minimumVolume;
        }
        prices.push(price);
        return prices;
      }, []).filter(function(price) {
        //return price
        return price.chargeableVolume < price.maximumVolume;
      }).reduce(function(minPrice, currentPrice) {
        if (minPrice.rate > currentPrice.rate && currentPrice.rate !=0) {
          minPrice = currentPrice;
        }
        return minPrice;
      }, {
        rate: Infinity
      });
    },

    getLCLPriceFromPricePoints = function(pricepoints, weight, volume, minimumDensity, basis) {
      var oldPrice = null;
      return pricepoints.map(function(pricepoint) {
        return pricepoint.getPrice(weight, volume, minimumDensity, basis);
      }).reduce(function(prices, price) {

        if (prices.length) {
          prices[prices.length - 1].maximumVolume = price.minimumVolume;
        }
        prices.push(price);
        return prices;
      }, []).filter(function(price) {
        //return price
        return price.chargeableVolume < price.maximumVolume;
      }).reduce(function(minPrice, currentPrice, indexPrice) {
        if (minPrice.rate > currentPrice.rate && currentPrice.rate !=0) {
          minPrice = currentPrice;
          if (oldPrice == null) {
            //oldPrice = minPrice;
            oldPrice = currentPrice;
          }
          if (oldPrice.rate > currentPrice.rate && indexPrice == 1) {
            oldPrice = currentPrice;
          }
          if (oldPrice.rate > minPrice.rate) {
            minPrice = oldPrice;
          }
        }
        return minPrice;
      }, {
        rate: Infinity
      });
    },

    getPriceFromTariffRoad = function(tariffroads, weight, volume, minimumDensity, basis, isBlanket, tariffRoadParams) {
      var temp_volume = 0,temp_price_index = 0, total_length = 0,max_volumn=0;
      return tariffroads.map(function(tariffroad) {
        return tariffroad.getRoadPrice(weight, volume, minimumDensity, basis, isBlanket, tariffRoadParams);
      }).reduce(function(prices, price) {
        if (prices.length) {
          prices[prices.length - 1].maximumVolume = price.minimumVolume;
        }
        //total_length = prices.length;
        prices.push(price);
        //if(price.basis == 'LB_FLAT') {
        //  prices.sort(function (first, second) {
        //    return first.min_unit_pound - second.min_unit_pound;
        //  });
        //}
        return prices;
      }, []).filter(function(price) {

        //if(basis_type.toString().toUpperCase() == 'FLAT'){
        //    if ((price.price_exist > 0 && temp_volume < price.chargeableVolume) || temp_price_index == total_length ){
        //      temp_volume = price.chargeableVolume;
        //      return price;
        //    }
        //} else{
        //    if(volume > price.minimumVolume){
        //      return price;
        //    }
        //}
        //temp_price_index++;

        if(price.basis == 'LB_FLAT'){
          if(price.original_volumn <= price.chargeableVolume &&  price.chargeableVolume <= price.maximumVolume){
            return price
          }

          //return price.min_unit_pound <= price.chargeableVolume;
        }else{
          //return price
          return price.chargeableVolume < price.maximumVolume;
        }
        //return price
        //  return price.chargeableVolume < price.maximumVolume;
      }).reduce(function(minPrice, currentPrice) {
        if (minPrice.rate > currentPrice.rate && currentPrice.rate !=0) {
          minPrice = currentPrice;
        }
        //if(minPrice.rate > 0 && minPrice.original_volumn <= currentPrice.chargeableVolume && minPrice.chargeableVolume <= currentPrice.maximumVolume){
        //    minPrice = currentPrice;
        //  }
        return minPrice;
      }, {
        rate: Infinity
      });
    },

    getRoadFreightPriceFromPricePoints = function(roadfreighttariffpricepoints, weight, volume, minimumDensity, basis) {
      return roadfreighttariffpricepoints.map(function(roadfreighttariffpricepoint) {
        return roadfreighttariffpricepoint.getRoadFreightPrice(weight, volume, minimumDensity, basis);
      }).reduce(function(prices, price) {

        if (prices.length) {
          prices[prices.length - 1].maximumVolume = price.minimumVolume;
        }
        prices.push(price);
        return prices;
      }, []).filter(function(price) {

        return price
        //return price.chargeableVolume < price.maximumVolume;
      }).reduce(function(minPrice, currentPrice) {

        if (minPrice.rate > currentPrice.rate && currentPrice.rate !=0) {
          minPrice = currentPrice;
        }
        return minPrice;
      }, {
        rate: Infinity
      });
    },

    getFreightTariffPriceProperties = function(tariff, weight, volume, price) {
      price = price || {
        minimumVolume: volume,
        chargeableVolume: volume,
        chargeableWeight: weight,
        maximumVolume: volume,
        rate: Infinity
      };
      price.currencyId = tariff.currency_id;
      price.tariffId = tariff.id;
      price.laneId = tariff.lane_id;
      price.dthc = tariff.dthc;
      price.addon = tariff.addon;
      price.comment = tariff.comment;
      price.expiry = tariff.expiry;
      return price;
    };

  return price.exports = {

    getFreightTariffPriceProperties: getFreightTariffPriceProperties,
    getPriceFromFreightTariff: function(weight, volume, containerSize) {
      var tariff = this,
        basis = tariff.basis;
      return this.getTariffPricePoints().then(function(pricepoints) {
        var price = getPriceFromPricePoints(pricepoints, weight, volume, null, basis);
        price = getFreightTariffPriceProperties(tariff, weight, volume, price);
        return price;
      });
    },
    getPriceFromOADATariff: function(weight, volume, isOrigin, containerSize) {
      var tariff = this;
      isOrigin = this.type == 'PS' ? !isOrigin : isOrigin;
      return this.getTariffPricePoints({
        order: "minimumUnits",
        where: {
          isOrigin: isOrigin
        }
      }).then(function(pricepoints) {
        var basis = tariff.getBasis(isOrigin),
          minimumDensity = tariff.getMinimumDensity(isOrigin);
          if(tariff.type == "LCL" || tariff.type == "AIR") {
            price = getLCLPriceFromPricePoints(pricepoints, weight, volume, minimumDensity, basis);
          } else {
              price = getPriceFromPricePoints(pricepoints, weight, volume, minimumDensity, basis);
          }
        price.thc = tariff.getTHC(weight, volume, containerSize);
        price.currencyId = tariff.currency_id;
        price.tariffId = tariff.id;
        return price;
      });
    },
    getRoadPriceFromOADATariff: function(weight, volume, isOrigin, containerSize, tariffType){
      var tariff = this,
        tariffRoadParams = { customClearance: tariff.TariffRoadParam.customClearance, wareHouse: tariff.TariffRoadParam.warehouse },
      isBlanket = tariffType == 'Road_B' ? !0 : !1;
      isOrigin = this.type == 'PS' ? !isOrigin : isOrigin;
      //{order: '-minUnits'}, //This is filter model instance using order as asc or desc
      return this.getTariffRoads({
        order: 'minUnits',
        where: {
          isExport: isOrigin
        }
      }).then(function(tariffroads) {
        var basis = tariff.getBasis(isOrigin),
          minimumDensity = tariff.getMinimumDensity(isOrigin),
          price = getPriceFromTariffRoad(tariffroads, weight, volume, minimumDensity, basis, isBlanket, tariffRoadParams);
        price.thc = tariff.getTHC(weight, volume, containerSize);
        price.currencyId = tariff.currency_id;
        price.tariffId = tariff.id;
        return price;
      });

    },
    getRoadPriceFromFreightTariff: function(weight, volume, isOrigin, containerSize, tariffType) {
      var tariff = this,
        basis = tariff.basis;

        switch(basis) {
          case "CWT":
            basis = "LB";
            break;
          case "CFT":
            basis = "CUBIC_FOOT";
            break;
          case "CBM":
            basis = "CUBIC_METER";
            break;
          default:
            basis = "LB";
        }
      return this.getTariffPricePoints().then(function(roadfreighttariffpricepoints) {
          //console.log("pricepoint length : "+roadfreighttariffpricepoints.length, tariff.id);
        var price = getRoadFreightPriceFromPricePoints(roadfreighttariffpricepoints, weight, volume, null, basis);
        //  var price = getPriceFromPricePoints(pricepoints, weight, volume, null, basis);
        //  var price = getLCLPriceFromPricePoints(roadfreighttariffpricepoints, weight, volume, null, basis)
        price = getFreightTariffPriceProperties(tariff, weight, volume, price);
          //console.log("pricepoint rate : "+price.rate);
        return price;
      });
    },

    getPriceFromPricePoint: function(weight, volume, minimumDensity, basis) {
      var pricepoint = this,
        density = Math.max(weight / volume, minimumDensity),
        chargeableVolume,
        chargeableWeight,
        minimumVolume,
        minimumWeight,
        kCubicMeterToCubicFoot = 35.3146667,
        kKGACWToCubicFoot = 2.20462 / 10.4,
        rate,
        unit_price;

      basis = basis || 'CUBIC_FOOT';
      minimumDensity = minimumDensity || 6.0;
      switch (basis) {
        case 'CUBIC_FOOT_FLAT':
          minimumVolume = pricepoint.minimumUnits;
          chargeableVolume = Math.max(volume, minimumVolume);
          minimumWeight = minimumDensity * chargeableVolume;
          chargeableWeight = Math.max(weight, minimumWeight);
          rate = pricepoint.unitPrice;
          unit_price = pricepoint.unitPrice;
          break;
        case 'CUBIC_FOOT':
          minimumVolume = pricepoint.minimumUnits;
          chargeableVolume = Math.max(volume, minimumVolume);
          minimumWeight = minimumDensity * chargeableVolume;
          chargeableWeight = Math.max(weight, minimumWeight);
          rate = chargeableVolume * pricepoint.unitPrice;
          unit_price = pricepoint.unitPrice;
          break;
        case 'LB':
          minimumVolume = pricepoint.minimumUnits / density;
          chargeableVolume = Math.max(volume, minimumVolume);
          minimumWeight = minimumDensity * chargeableVolume;
          chargeableWeight = Math.max(weight, minimumWeight, pricepoint.minimumUnits);
          rate = chargeableVolume * density * pricepoint.unitPrice / 100;
          unit_price = pricepoint.unitPrice;
          break;
        case 'LB_FLAT':
          minimumVolume = pricepoint.minimumUnits / density;
          chargeableVolume = Math.max(volume, minimumVolume);
          minimumWeight = minimumDensity * chargeableVolume;
          chargeableWeight = Math.max(weight, minimumWeight);
          rate = pricepoint.unitPrice;
          unit_price = pricepoint.unitPrice;
          break;
        case 'CUBIC_METER':
          minimumVolume = pricepoint.minimumUnits * kCubicMeterToCubicFoot;
          chargeableVolume = Math.max(volume, minimumVolume);
          minimumWeight = minimumDensity * chargeableVolume;
          chargeableWeight = Math.max(weight, minimumWeight, pricepoint.minimumUnits);
          rate = chargeableVolume * pricepoint.unitPrice / kCubicMeterToCubicFoot;
          unit_price = pricepoint.unitPrice;
          break;
        case 'CUBIC_METER_FLAT':
          minimumVolume = pricepoint.minimumUnits * kCubicMeterToCubicFoot;
          chargeableVolume = Math.max(volume, minimumVolume);
          minimumWeight = minimumDensity * chargeableVolume;
          chargeableWeight = Math.max(weight, minimumWeight);
          rate = pricepoint.unitPrice;
          unit_price = pricepoint.unitPrice;
          break;
        case 'PER_KG_ACW':
          minimumVolume = pricepoint.minimumUnits * kKGACWToCubicFoot;
          chargeableVolume = Math.max(volume, minimumVolume);
          minimumWeight = minimumDensity * chargeableVolume;
          chargeableWeight = Math.max(weight, minimumWeight, pricepoint.minimumUnits);
          rate = chargeableVolume * pricepoint.unitPrice / kKGACWToCubicFoot;
          unit_price = pricepoint.unitPrice;
          break;
        case 'KG_ACW': //This is for freight type = 'Air'
            minimumVolume = pricepoint.minimumUnits * kKGACWToCubicFoot;
            chargeableVolume = Math.max(volume, minimumVolume);
            minimumWeight = minimumDensity * chargeableVolume;
            chargeableWeight = Math.max(weight, minimumWeight, pricepoint.minimumUnits);
            rate = chargeableVolume * pricepoint.unitPrice / kKGACWToCubicFoot;
            unit_price = pricepoint.unitPrice
            min_unit_price = pricepoint.min_unit_price
            cal_unit : pricepoint.call_unit
            break;
      }

      return {
        'rate': rate,
        'chargeableWeight': chargeableWeight,
        'chargeableVolume': chargeableVolume,
        'minimumVolume': minimumVolume,
        'maximumVolume': Infinity,
        'unit_price' : unit_price,
        'basis' : basis,
        'original_volumn': volume,
        'original_weight':weight
      };
    },

    getPriceFromRoadPricePoint: function(weight, volume, minimumDensity, basis, isBlanket, tariffRoadParams) {

      var roadpricepoint = this,
        density = Math.max(weight / volume, minimumDensity),
        chargeableVolume,
        chargeableWeight,
        minimumVolume,
        minimumWeight,
        kCubicMeterToCubicFoot = 35.3146667,
        kKGACWToCubicFoot = 2.20462 / 10.4,
        rate,
        unit_price,min_unit_pound;

      basis = basis || 'CUBIC_FOOT';

      var price_exist = 1;
      minimumDensity = minimumDensity || 6.0;
      switch (basis) {
        case 'CUBIC_FOOT_FLAT':
          minimumVolume = roadpricepoint.minUnits;
          chargeableVolume = Math.max(volume, minimumVolume);
          minimumWeight = minimumDensity * chargeableVolume;
          chargeableWeight = Math.max(weight, minimumWeight);
          if(isBlanket) {
            rate = roadpricepoint.unitPriceBlanket;
            unit_price = roadpricepoint.unitPriceBlanket;
          } else {
            rate = roadpricepoint.unitPriceexport;
            unit_price = roadpricepoint.unitPriceexport;
          }
          break;
        case 'CUBIC_FOOT':
          minimumVolume = roadpricepoint.minUnits;
          chargeableVolume = Math.max(volume, minimumVolume);
          minimumWeight = minimumDensity * chargeableVolume;
          chargeableWeight = Math.max(weight, minimumWeight);
          if(isBlanket) {
              rate = chargeableVolume * roadpricepoint.unitPriceBlanket;
              unit_price = roadpricepoint.unitPriceBlanket;
          } else {
              rate = chargeableVolume * roadpricepoint.unitPriceexport;
              unit_price = roadpricepoint.unitPriceexport;
          }
          //price_exsit = unitPrice;
          if (volume < (roadpricepoint.minUnits / density)){
            price_exist =  -1
          }
          break;
        case 'LB':
          minimumVolume = roadpricepoint.minUnits / density;
          chargeableVolume = Math.max(volume, minimumVolume);
          minimumWeight = minimumDensity * chargeableVolume;
          chargeableWeight = Math.max(weight, minimumWeight, roadpricepoint.minUnits);
          if(isBlanket) {
              rate = chargeableVolume * density * roadpricepoint.unitPriceBlanket / 100;
              unit_price = roadpricepoint.unitPriceBlanket;
          } else {
              rate = chargeableVolume * density * roadpricepoint.unitPriceexport / 100;
              unit_price = roadpricepoint.unitPriceexport;
          }
          break;
        case 'LB_FLAT':

          minimumVolume = roadpricepoint.minUnits / density;
          chargeableVolume = Math.max(volume, minimumVolume);
          minimumWeight = minimumDensity * chargeableVolume;
          chargeableWeight = Math.max(weight, minimumWeight);

          if(isBlanket) {
            rate = roadpricepoint.unitPriceBlanket + tariffRoadParams.customClearance;
            unit_price = roadpricepoint.unitPriceBlanket + tariffRoadParams.customClearance;
            price_exist = roadpricepoint.unitPriceBlanket;
          } else {
            rate = roadpricepoint.unitPriceexport + tariffRoadParams.customClearance;
            unit_price = roadpricepoint.unitPriceexport + tariffRoadParams.customClearance;
            price_exist = roadpricepoint.unitPriceexport;
            min_unit_pound=roadpricepoint.minUnits
          }
          if (volume < (roadpricepoint.minUnits / density)){
            price_exist =  -1
          }
          break;
        case 'CUBIC_METER':
          minimumVolume = roadpricepoint.minUnits * kCubicMeterToCubicFoot;
          chargeableVolume = Math.max(volume, minimumVolume);
          minimumWeight = minimumDensity * chargeableVolume;
          chargeableWeight = Math.max(weight, minimumWeight, roadpricepoint.minUnits);
          if (isBlanket) {
              rate = chargeableVolume * roadpricepoint.unitPriceBlanket / kCubicMeterToCubicFoot;
              unit_price = roadpricepoint.unitPriceBlanket;
          } else {
              rate = chargeableVolume * roadpricepoint.unitPriceexport / kCubicMeterToCubicFoot;
              unit_price = roadpricepoint.unitPriceexport;
          }
          break;
        case 'CUBIC_METER_FLAT':
          minimumVolume = roadpricepoint.minUnits * kCubicMeterToCubicFoot;
          chargeableVolume = Math.max(volume, minimumVolume);
          minimumWeight = minimumDensity * chargeableVolume;
          chargeableWeight = Math.max(weight, minimumWeight);
          if (isBlanket) {
            rate = roadpricepoint.unitPriceBlanket;
            unit_price = roadpricepoint.unitPriceBlanket;
          } else {
            rate = roadpricepoint.unitPriceexport;
            unit_price = roadpricepoint.unitPriceexport;
          }
          break;
      }

      return {
        'rate': rate,
        'chargeableWeight': chargeableWeight,
        'chargeableVolume': chargeableVolume,
        'minimumVolume': minimumVolume,
        'maximumVolume': Infinity,
        'unit_price' : unit_price,
        'basis' : basis,
        'original_volumn': volume,
        'original_weight':weight,
        'min_unit_pound':min_unit_pound,
        'price_exist': price_exist
      };
    },

    getPriceFromRoadFreightPricePoint: function(weight, volume, minimumDensity, basis) {

      var roadfreightpricepoints = this,
        density = Math.max(weight / volume, minimumDensity),
        chargeableVolume,
        chargeableWeight,
        minimumVolume,
        minimumWeight,
        kCubicMeterToCubicFoot = 35.3146667,
        kKGACWToCubicFoot = 2.20462 / 10.4,
        rate,
        unit_price;

      basis = basis || 'CUBIC_FOOT';
      var price_exist = 1;
      minimumDensity = minimumDensity || 6.0;
      switch (basis) {
          case 'CUBIC_FOOT_FLAT':

              minimumVolume = roadfreightpricepoints.minimumUnits;
              chargeableVolume = Math.max(volume, minimumVolume);
              minimumWeight = minimumDensity * chargeableVolume;
              chargeableWeight = Math.max(weight, minimumWeight);
              rate = roadfreightpricepoints.unitPrice;
              unit_price = roadfreightpricepoints.unitPrice;
              break;

          //case 'CUBIC_FOOT':
          //minimumVolume = roadpricepoint.minUnits;
          //chargeableVolume = Math.max(volume, minimumVolume);
          //minimumWeight = minimumDensity * chargeableVolume;
          //chargeableWeight = Math.max(weight, minimumWeight);
          //if(isBlanket) {
          //    rate = chargeableVolume * roadpricepoint.unitPriceBlanket;
          //    unit_price = roadpricepoint.unitPriceBlanket;
          //} else {
          //    rate = chargeableVolume * roadpricepoint.unitPriceexport;
          //    unit_price = roadpricepoint.unitPriceexport;
          //}
          ////price_exsit = unitPrice;
          //if (volume < (roadpricepoint.minUnits / density)){
          //  price_exist =  -1
          //}
          //break;
          case 'CUBIC_FOOT':

              minimumVolume = roadfreightpricepoints.minimumUnits;
              chargeableVolume = Math.max(volume, minimumVolume);
              minimumWeight = minimumDensity * chargeableVolume;
              chargeableWeight = Math.max(weight, minimumWeight);
              rate = chargeableVolume * roadfreightpricepoints.unitPrice;
              unit_price = roadfreightpricepoints.unitPrice;
              //if (volume < (roadfreightpricepoints.minimumUnits / density)){
              //  price_exist =  -1
              //}
              break;
          case 'LB':

              minimumVolume = roadfreightpricepoints.minimumUnits / density;
              chargeableVolume = Math.max(volume, minimumVolume);
              minimumWeight = minimumDensity * chargeableVolume;
              chargeableWeight = Math.max(weight, minimumWeight, roadfreightpricepoints.minimumUnits);
              rate = chargeableVolume * density * roadfreightpricepoints.unitPrice / 100;
              unit_price = roadfreightpricepoints.unitPrice;
              break;
          case 'LB_FLAT':

              minimumVolume = roadfreightpricepoints.minimumUnits / density;
              chargeableVolume = Math.max(volume, minimumVolume);
              minimumWeight = minimumDensity * chargeableVolume;
              chargeableWeight = Math.max(weight, minimumWeight);
              rate = roadfreightpricepoints.unitPrice
              unit_price = roadfreightpricepoints.unitPrice
              price_exist = roadfreightpricepoints.unitPrice;
              if (volume < (roadfreightpricepoints.minimumUnits / density)) {
                  price_exist = -1
              }
              break;
          case 'CUBIC_METER':

              minimumVolume = roadfreightpricepoints.minimumUnits * kCubicMeterToCubicFoot;
              chargeableVolume = Math.max(volume, minimumVolume);
              minimumWeight = minimumDensity * chargeableVolume;
              chargeableWeight = Math.max(weight, minimumWeight, roadfreightpricepoints.minimumUnits);
              rate = chargeableVolume * roadfreightpricepoints.unitPrice / kCubicMeterToCubicFoot;
              unit_price = roadfreightpricepoints.unitPrice;
              break;
          case 'CUBIC_METER_FLAT':
              minimumVolume = roadfreightpricepoints.minimumUnits * kCubicMeterToCubicFoot;
              chargeableVolume = Math.max(volume, minimumVolume);
              minimumWeight = minimumDensity * chargeableVolume;
              chargeableWeight = Math.max(weight, minimumWeight);
              rate = roadfreightpricepoints.unitPrice;
              unit_price = roadfreightpricepoints.unitPrice;
              break;
      }

      var frght_val =  {
        'rate': rate,
        'chargeableWeight': chargeableWeight,
        'chargeableVolume': chargeableVolume,
        'minimumVolume': minimumVolume,
        'maximumVolume': Infinity,
        'unit_price' : unit_price,
        'basis' : basis,
        'original_volumn': volume,
        'original_weight': weight,
        'price_exist': price_exist
      };

      return frght_val;
    }
  };
})(module);
