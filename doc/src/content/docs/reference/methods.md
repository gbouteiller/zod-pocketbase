---
title: Methods
description: A reference for the methods.
---

## helpersFrom

```ts
import { helpersFrom } from "zod-pocketbase";

const helpers = helpersFrom({ cache, pocketbase });
```

The `helpersFrom` method returns an object with two methods: `getRecord` and `getRecords` described below.

### cache

- **Type:** `string`
- **Default:** `0s`

After this amount of time has passed, getRecord and getRecords will fetch new data from your PocketBase instance.

The `cache` parameter supports the following values:

- `s` is seconds (e.g. `cache: "43s"`)
- `m` is minutes (e.g. `cache: "2m"`)
- `h` is hours (e.g. `cache: "99h"`)
- `d` is days (The default is `cache: "1d"`)
- `w` is weeks, or shorthand for 7 days (e.g. `cache: 2w` is 14 days)
- `y` is years, or shorthand for 365 days (not exactly one year) (e.g. `cache: 2y` is 730 days)

Here are a few more values you can use:

- `cache: "*"` will never fetch new data (after the first success).
- `cache: "0s"` will always fetch new data.

### pocketbase

- **Required**
- **Type:** `TypedPocketbase`

The `pocketbase` parameter is a mandatory parameter that specifies a PocketBase instance.

## getRecord

```ts
const { getRecord } = helpersFrom({ pocketbase });
const record = await getRecord(reference, { schema });
```

The `getRecord` method returns a single record from your PocketBase instance.

### reference

- **Required**
- **Type:** [`RecordRef`](/reference/types#recordref)

### schema

- **Required**
- **Type:** [`AnyZodRecord`](/reference/types#anyzodrecord)

## getRecords

```ts
const { getRecords } = helpersFrom({ pocketbase });
const recordsList = await getRecords(collection, { filter, page, perPage, schema, skipTotal, sort });
```

The `getRecords` method returns a records list from your PocketBase instance.

### collection

- **Required**
- **Type:** `string`

### filter

- **Type:** `string`

### page

- **Type:** `number`
- **Default:** `1`
  
### perPage

- **Type:** `number`
- **Default:** `200`

### schema

- **Required**
- **Type:** [`AnyZodRecord`](/reference/types#anyzodrecord)
  
### skipTotal

- **Type:** `boolean`
- **Default:** `true`
  
### sort

- **Type:** [`ZodRecordSort`](/reference/types#zodrecordsort)
