[![CI](https://github.com/thanhvuong/whichrmv-parser/actions/workflows/ci.yml/badge.svg)](https://github.com/thanhvuong/whichrmv-parser/actions/workflows/ci.yml)

# whichrmv-parser

This package parses Massachusetts RMV wait times and will be used on v2 of whichrmv.com

## Install

```
yarn add whichrmv-parser
```

## Usage

```javascript
import { parseWaitTimes } from 'whichrmv-parser';

(async () => {
  const waitTimes = await parseWaitTimes();
  console.log('waitTimes', waitTimes);
})();
```

## Testing

```
yarn test
```
