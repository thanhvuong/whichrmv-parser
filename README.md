[![build status](https://travis-ci.org/thanhvuong/whichrmv-parser.svg?branch=master)](https://travis-ci.org/thanhvuong/whichrmv-parser)

# whichrmv-parser

This package parses Massachusetts RMV wait times and will be used on v2 of whichrmv.com

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