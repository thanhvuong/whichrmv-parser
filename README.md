# whichrmv-parser

This package gets Massachusetts RMV wait times and used by whichrmv.com

## Install

```
yarn add whichrmv-parser
```

## Usage

```javascript
import { parseWaitTimes } from 'whichrmv-parser';

const waitTimes = async() => {
  return await parseWaitTimes();
};
```

## Testing
```
yarn test
```