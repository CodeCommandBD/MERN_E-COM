
const mongoose = require('mongoose');

// Connect to MongoDB (Update URI if needed, assuming local or from env)
// Ideally this script is run where it can access the DB.
// Since I cannot run node directly with DB access easily without setup,
// I will simulate the pipeline logic mentally first, then try to fix the code directly.

// However, I can create a small test file in the project to run via `node` if I have the connection string.
// Let's rely on code analysis first.

/*
Logic Analysis:

1. `deleteType` is undefined/null in default view.
2. `baseMatchQuery` becomes `{ $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] }`.
3. `filters` is empty. `globalFilters` is empty.
4. `needsPreMatch` = true (since baseMatchQuery has keys, no global/column filters).
5. `aggregatePipeline` pushes `{$match: baseMatchQuery}`.
6. Then lookups.
7. `needsPostMatch` = false.
8. No post-lookup match.
9. Sort, skip, limit.

This looks correct for the default case.

Issue might be:
- `aggregationMatchQuery` construction logic.
- `needsPreMatch` vs `needsPostMatch` logic.

Wait, look at lines 156-159:
const needsPostMatch =
  globalSearchConditions ||
  Object.keys(columnFilters).length > 0 ||
  (Object.keys(baseMatchQuery).length > 0 && !needsPreMatch);

If `needsPreMatch` is true, `needsPostMatch` is false.
And line 193:
if (needsPostMatch && Object.keys(aggregationMatchQuery).length > 0)

So if `needsPreMatch` is true, we ONLY do the pre-match.
But `aggregationMatchQuery` is constructed from `baseMatchQuery` + others.
If `needsPreMatch` is true, we verify `baseMatchQuery` is indeed in the pipeline.
Line 163: `aggregatePipeline.push({ $match: baseMatchQuery });`

This seems correct.

However, check the `countPipeline` logic (lines 223-231).
It mirrors the fetch logic.
So if `countPipeline` returns 0 but stats return 4 (different endpoint), then the issue is indeed in this pipeline.

The user says "count 4 data show" (in the cards).
Cards come from `/api/review/stats`.
Table comes from `/api/review`.

If `/api/review` returns { data: [], meta: { totalRowCount: 0 } }, then the table is empty.
This means the pipeline is filtering everything out.

Why would `baseMatchQuery` filter everything out?
`{ $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] }`
This is standard for finding non-deleted items.

Could it be the `lookups`?
`$unwind` with `preserveNullAndEmptyArrays: true`.
So even if user/product is missing, it should return the review.

Wait, check lines 123-139 "Update baseMatchQuery with global search".
If `globalFilters` is empty, this block is skipped.

Let's look at `aggregationConditions`.
`baseMatchQuery` is pushed.
`aggregationMatchQuery` becomes `baseMatchQuery` (if no other filters).

If `needsPreMatch` is true, we match `baseMatchQuery`.
If `needsPostMatch` is false, we don't match `aggregationMatchQuery`.
This avoids double matching. This looks correct.

What if `deleteType` is passed strangely?
In the UI `DataTableWrapper` (lines 182-194):
`deleteType="SD"` is passed?
Line 188: `deleteType="SD"`.

Wait, `DataTableWrapper` is a generic component.
In `ShowReviews` component:
`deleteType="SD"` is passed to `DataTableWrapper`.

Does `DataTableWrapper` pass this to the API?
If it appends `?deleteType=SD`, then API line 28:
If `deleteType === "SD"`, `baseMatchQuery` is set to find NON-deleted items.
This is correct.

What if the User Model or Product Model lookups fail in a subtle way?
`localField: "product"` -> `foreignField: "_id"`.
`localField: "user"` -> `foreignField: "_id"`.
Models verify:
Review model: `product: ObjectId`, `user: ObjectId`.
Product model: `_id: ObjectId`.
User model: `_id: ObjectId`.

Wait! The `ReviewModel` definition I saw earlier:
`import mongoose from "mongoose";`
`product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }`
`user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }`

If I am unable to reproduce it by code inspection, I should try to inspect what the server is actually returning.
Since I cannot see the server logs directly, I can add `console.log` in `api/review/route.js` and ask the user to show the terminal. Or I can create a temporary debug endpoint.

But wait, looking at `api/review/route.js` lines 124-139.
If `baseSearchConditions` is null (default case), this block is skipped.

Let's verify line 28 again.
`const deleteType = searchParams.get("deleteType");`
If client sends `deleteType=SD`.
`baseMatchQuery` = `{ $or: [...] }`.

If client sends nothing.
`baseMatchQuery` = `{}`.
Then `needsPreMatch` = false.
Then `needsPostMatch` = false (if no other filters).
Aggregate pipeline:
- Lookups
- Sort
- Skip/Limit
- Project

This would return ALL reviews, including deleted ones?
No, the code initializes `baseMatchQuery = {}`.
If `deleteType` is missing, it matches ALL.

In `ShowReviews` (`admin/reviews/page.jsx`):
`deleteType="SD"` is passed to `DataTableWrapper`.
I need to check `DataTableWrapper` to see if it actually sends this param in the fetch URL.

Let's check `DataTableWrapper`.
