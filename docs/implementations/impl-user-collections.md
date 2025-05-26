# User Collections Implementation

## Overview

Implementation details for tracking user interests in collections and their specific items.

## Database Tables

### `user_colls`

Tracks which collections a user is actively participating in.

```sql
CREATE TABLE user_colls (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    collection_id INT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, collection_id)
);
```

### `user_coll_items`

Tracks individual collection items that users want or are offering.

```sql
CREATE TABLE user_coll_items (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id INT NOT NULL REFERENCES collection_items(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('WANT', 'OFFERING')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, item_id, type)
);
```

## Features

### Automatic Collection Tracking

- When a user marks an item as 'WANT' or 'OFFERING', they are automatically added as active in that collection
- Implemented via database trigger `sync_user_colls`
- Ensures `user_colls` stays in sync with user interests

### Data Integrity

- Foreign key constraints ensure referential integrity
- Unique constraints prevent duplicate entries
- CASCADE deletion rules maintain data consistency

### Performance Optimization

- Indexes on frequently queried columns:
  - `user_id` and `collection_id` in `user_colls`
  - `user_id`, `item_id`, and `type` in `user_coll_items`

## File Locations

- Schema definition: `/sql/20250526_user_collections.sql`
- Database migrations: `/prisma/migrations/`
