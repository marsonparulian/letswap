# LetSwap System Technical Specification

## System Architecture

### Technology Stack

1. Frontend

   - Next.js 14 (App Router)
   - React Server Components
   - Foundation CSS Framework with custom styling
   - TypeScript for type safety

2. Backend

   - Next.js Server Actions for form handling and data mutations
   - Server Components for data fetching
   - PostgreSQL for data persistence
   - Prisma as ORM (recommended)

3. Authentication
   - Single Sign-On (SSO) implementation
   - Multiple provider support
   - See `spec-sso.md` for detailed authentication specifications

## Data Model Overview

The system uses a PostgreSQL database with the following core entities:

1. Users

   - Profile and authentication information
   - Preferences and settings
   - Location data (postcodes)

2. Producers

   - Organizations that create collectibles
   - Basic information and metadata

3. Collections

   - Groups of related collectible items
   - Linked to producers
   - Series and release information

4. Collection Items

   - Individual items within collections
   - Item details and metadata
   - Image references

5. User Collections

   - Links between users and collections
   - Tracks which collections a user is active in
   - Used to calculate user's collection counts

6. User Collection Items
   - Links between users and collection items
   - Tracks wants and offerings
   - Ensures unique user-item relationships

For detailed schema implementation, see `impl-database.md`

## Server Actions

### Authentication

- Handled by NextAuth.js through middleware

### User Actions

```typescript
'use server'
- updateProfile(data: ProfileFormData)
- getUserProfile(slug: string)
```

### Collection Actions

```typescript
'use server'
- createCollection(data: CollectionFormData)
- updateCollection(slug: string, data: CollectionFormData)
- deleteCollection(slug: string)
- manageCollectionItems(collectionId: string, items: CollectionItem[])
```

### User Items Actions

```typescript
'use server'
- toggleWantItem(itemId: string)
- toggleOfferingItem(itemId: string)
- getUserItems(userId: string)
```

### Producer Actions

```typescript
'use server'
- createProducer(data: ProducerFormData)
- updateProducer(slug: string, data: ProducerFormData)
- deleteProducer(slug: string)
```

## Frontend Architecture

### Page Structure

- `/` - Home page
- `/collections` - Browse collections
- `/collections/[slug]` - Collection details
- `/users/[slug]` - User profile
- `/producers` - Producer list
- `/producers/[slug]` - Producer details

### Components

1. Core Components

   - `site-nav` - Navigation component
   - `card-list` - Reusable card grid
   - `ToasterWrapper` - Notification system

2. Form Components

   - `slug-input` - Slug generation/management
   - `coll-form` - Collection form
   - `producer-form` - Producer form

3. Feature Components
   - Collection browsing
   - Item selection
   - Profile management
   - Admin controls

### State Management

- Server components for data fetching
- React Context for global state
- Local state for form handling

## Security

### Authentication

- See `spec-sso.md` for detailed authentication specifications

### Authorization

- Role-based access control
- Admin privileges management
- API route protection

### Data Protection

- Input validation
- SQL injection prevention via Prisma
- XSS protection
- CSRF protection

## Performance Considerations

### Optimizations

1. Database

   - Indexed fields: slugs, user_id, collection_id
   - Efficient queries via Prisma
   - Connection pooling

2. Frontend

   - Image optimization with Next.js
   - Static page generation where possible
   - Dynamic imports for large components
   - Foundation CSS optimization

3. Caching
   - Next.js cache mechanisms
   - Static page caching
   - Database query caching

## Testing Strategy

### Test Types

1. Unit Tests

   - Component testing
   - Utility function testing
   - API route testing

2. Integration Tests

   - Database operations
   - API endpoint integration
   - Component integration

3. E2E Tests
   - User flows
   - Form submissions
   - Authentication flows

## Development Workflow

### Environment Setup

1. Local Development

   ```bash
   # Install dependencies
   pnpm install

   # Set up environment variables
   cp .env.example .env.local

   # Run database migrations
   pnpm prisma migrate dev

   # Start development server
   pnpm dev
   ```

2. Required Environment Variables
   ```env
   DATABASE_URL=postgresql://...
   NEXTAUTH_SECRET=your-secret
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_ID=...
   GOOGLE_SECRET=...
   # Add other SSO provider credentials
   ```

### Deployment

- Vercel for Next.js hosting
- PostgreSQL database hosting
- Environment variable management
- Continuous deployment setup

## Related Documents

- req-overview.md: System overview
- req-sso.md: Authentication details
- req-profile.md: User profile specifications
- req-session.md: Session management details
