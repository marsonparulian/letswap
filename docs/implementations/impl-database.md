# Database Implementation

## Overview

Implementation details of the LetSwap database schema and structure.

## Database Tables

Schema definitions are maintained in the `sql/` directory. See individual SQL files for detailed schema definitions and migrations.

### Core Tables

- `users` - User profiles and authentication data
- `producers` - Organizations that create collectible items
- `collections` - Groups of collectible items
- `collection_items` - Individual items within collections
- `user_colls` - User's active collections
- `user_coll_items` - User's wants and offerings within collections

### Indexes

1. Primary Keys

   - All tables use UUID as primary key
   - Generated using `uuid_generate_v4()`

2. Foreign Keys

   - `collections.producer_id` → `producers.id`
   - `collection_items.collection_id` → `collections.id`
   - `user_colls.user_id` → `users.id`
   - `user_colls.collection_id` → `collections.id`
   - `user_coll_items.user_id` → `users.id`
   - `user_coll_items.item_id` → `collection_items.id`

3. Unique Constraints
   - `users.email`
   - `users.slug`
   - `producers.slug`
   - `collections.slug`
   - `user_colls(user_id, collection_id)`
   - `user_coll_items(user_id, item_id, type)`

## Data Access

Database access is implemented using Prisma ORM. See `prisma/schema.prisma` for the corresponding Prisma models.

## Related Files

- SQL schema definitions: `sql/*.sql`
- Prisma schema: `prisma/schema.prisma`
- Database migrations: `prisma/migrations/`
