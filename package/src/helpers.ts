import type Pocketbase from "pocketbase";
import { fullListOptionsFrom, optionsFrom } from "./options.js";
import type { AnyZodRecord, RecordFullListOpts, RecordIdRef, RecordRef, RecordSlugRef } from "./types.ts";
//@ts-expect-error
import { AssetCache } from "@11ty/eleventy-fetch";
import { AnyRecordsList, type RecordsList } from "./schemas.ts";

export function helpersFrom({ cache, pocketbase }: HelpersFromOpts) {
  async function get<R>(id: string, method: () => Promise<R>): Promise<R> {
    if (!cache) return method();
    const asset = new AssetCache(id);
    if (asset.isCacheValid(cache)) return asset.getCachedValue();
    const result = await method();
    await asset.save(result, "json");
    return result;
  }

  async function getRecord<C extends string, S extends AnyZodRecord>(ref: RecordSlugRef<C>, opts: GetRecordOpts<S>): Promise<S["_output"]>;
  async function getRecord<C extends string, S extends AnyZodRecord>(ref: RecordIdRef<C>, opts: GetRecordOpts<S>): Promise<S["_output"]>;
  async function getRecord<C extends string, S extends AnyZodRecord>(ref: RecordRef<C>, opts: GetRecordOpts<S>) {
    const { schema } = opts;
    const sdkOpts = optionsFrom(schema);
    const unsafeRecord = await get(JSON.stringify({ ...ref, ...sdkOpts }), async () =>
      "id" in ref
        ? pocketbase.collection(ref.collection).getOne(ref.id, sdkOpts)
        : pocketbase.collection(ref.collection).getFirstListItem(`slug = "${ref.slug}"`, sdkOpts),
    );
    return schema.parseAsync(unsafeRecord);
  }

  async function getRecords<C extends string, S extends AnyZodRecord>(collection: C, opts: GetRecordsOpts<S>): Promise<RecordsList<S>> {
    const { schema, ...otherOpts } = opts;
    const sdkOpts = fullListOptionsFrom(schema, otherOpts);
    const recordsList = await get(JSON.stringify({ collection, ...sdkOpts }), async () =>
      pocketbase.collection(collection).getList(sdkOpts.page, sdkOpts.perPage, sdkOpts),
    );
    return AnyRecordsList.extend({ items: schema.array() }).parseAsync(recordsList);
  }

  return { getRecord, getRecords };
}
export type GetRecordOpts<S extends AnyZodRecord> = { schema: S };
export type GetRecordsOpts<S extends AnyZodRecord> = RecordFullListOpts<S> & { schema: S };
export type HelpersFromOpts = { cache?: string; pocketbase: Pocketbase };
