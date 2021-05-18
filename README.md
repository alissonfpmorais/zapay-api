# zapay-api

### Installation
```bash
npm install --save @alissonfpmorais/zapay-api
```

### Usage
```js
import { Zapay } from '@alissonfpmorais/zapay-api';
// or...
const { Zapay } = require('@alissonfpmorais/zapay');

async function main() {
  const zapay = await Zapay.newInstance(
    'my-username', // username
    'my-password', // password
    'https://api.sandbox.usezapay.com.br', // baseUrl, note: there's urls for production and development
    async (options) => { // httpClient
      const response = await axios({ // example with axios, but it work with any other http client library
        method: options.method,
        url: options.url,
        data: options.data,
        headers: options.headers,
      });
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      }
    }
  )

  const debts = await zapay.debts(
    'MG', // UF
    'AAA0000', // plate
    '00000000000', // renavam
  );
  
  console.log(debts);
  // {
  //   protocol: string;
  //   debts: Array<{
  //     id: string;
  //     amountInCents: number;
  //     title: string;
  //     debtType: string;
  //     description: string;
  //     dueDate: string;
  //     required?: boolean;
  //     dependsOn?: Array<string>;
  //     distinct?: Array<string>;
  //   }>;
  //   vehicle: {
  //     renavam: string;
  //     plate: string;
  //     document?: string;
  //     owner?: string;
  //     model?: string;
  //     color?: string;
  //     fabricationYear?: number;
  //     modelYear?: number;
  //     chassis?: string;
  //     venalValue?: string;
  //   };
  // }
}
```