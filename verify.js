const db = require('.');

const noDuplicates = Object.keys(db)
  .filter(key => key !== 'schemas')
  .map(list => {
    let numberOfItems;
    let numberOfUniques;
    if (list === 'companies') {
      let companyCodes = db[list].map(company => company.code);
      numberOfItems = companyCodes.length;
      numberOfUniques = (new Set(companyCodes)).size;  
    } else {
      // Service(s), Characteristic(s) and Descriptor(s)
      let uuids = db[list].map(gatt => gatt.uuid);
      numberOfItems = uuids.length;
      numberOfUniques = (new Set(uuids)).size;
    }

    if (numberOfItems !== numberOfUniques) {            
      console.error(`Failed to verify '${list}': '${numberOfItems - numberOfUniques}' duplicate UUID(s) found.`);
      return false;
    }
    return true;
  })
  .every(v => v); // true if all are true

process.exit(noDuplicates ? 0 : 1);