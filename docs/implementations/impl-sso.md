# SSO Implementation Steps

## 1. Initial Setup ✅

### Install required dependencies ✅

    ```bash
    pnpm add next-auth
    ```

### Configure environment variables in `.env.local` ✅

    ```env
    # SSO Provider Credentials
    GOOGLE_ID=
    GOOGLE_SECRET=

    FACEBOOK_ID=
    FACEBOOK_SECRET=

    # NextAuth Configuration
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=  # Generate with: openssl rand -base64 32
    ```

## 2. NextAuth Configuration ✅

### 2.1. Create auth configuration file at `app/api/auth/[...nextauth]/route.ts` ✅

- Configure providers (Google, Facebook) ✅
- Set up JWT strategy ✅
- Define session callbacks ✅
- Configure error handling ✅

### 2.2. Implement session management ✅

- Set JWT token structure ✅
- Configure session timeouts (24 hours) ✅
- Enable token rotation ✅
- Set secure cookie options ✅

## 3. Provider Integration

### 3.1. Google OAuth2 setup ✅

- Create project in Google Cloud Console✅
- Configure OAuth consent screen✅
- Generate credentials (Client ID and Secret)✅
- Set authorized redirect URIs✅

### 3.2. Facebook Login setup✅

- Create app in Facebook Developers Console✅
- Configure OAuth settings✅
- Generate app credentials✅
- Set valid OAuth redirect URIs✅ -- The callback URI currently points to the production URI, because facebook developer console could not save `localhost`.

## 4. Authentication Flow Implementation

### 4.1. Create login page components ✅

- Provider selection buttons with proper branding ✅
- Error message display component ✅
- Loading states and animations ✅

### 4.2. Implement authentication flow ✅

- Provider selection handling ✅

  - Button click handlers
  - Provider-specific redirects

- OAuth redirect management ✅

  - Callback handling
  - Error state management

- Token validation and session creation ✅

  - JWT token setup
  - Session persistence

- Profile completion check ✅

  - Profile completion state in JWT ✅
  - Redirect logic for incomplete profiles ✅

### 4.3. Add profile redirect logic ✅

- Check profile completion status ✅

  ```typescript
  // In auth.ts JWT callback
  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      isProfileComplete: true,
      slug: true,
    },
  });
  token.isProfileComplete = profile?.isProfileComplete ?? false;
  ```

- Store pre-login URL ✅

  ```typescript
  // In middleware.ts
  const profileUrl = new URL("/profile/complete", request.url);
  profileUrl.searchParams.set("callbackUrl", request.url);
  ```

- Handle redirect after profile completion ✅
  ```typescript
  // In profile-form.tsx
  router.push(callbackUrl || "/");
  ```

## 5. Session Management Implementation

### 5.1. Configure session middleware ✅

- Add NextAuth middleware configuration ✅
  <!-- Uses next-auth/middleware withAuth for route protection -->
- Set up protected routes ✅
  <!-- Protected routes configured via matcher in middleware.ts -->
- Implement session validation ✅
  <!-- Session validation via authorized callback in middleware.ts -->

  ### 5.2. Implement session features ✅

- User session persistence ✅
  <!-- User sessions persisted in JWT tokens as configured in auth.ts -->
- Automatic session refresh ✅
  <!-- Implemented in session-manager.tsx using useSession().update() -->
- Logout functionality ✅
  <!-- Created logout-button.tsx component using signOut() from next-auth/react -->
- Session timeout handling ✅
  <!-- Configured in auth.ts with maxAge and managed by session-manager.tsx -->

## 6. Error Handling Implementation

### 6.1. Create error handling system ✅

```typescript
type AuthError = {
  code: string;
  message: string;
  provider?: string;
};
```

### 6.2. Implement error scenarios ✅

- Provider authentication failures ✅ <!-- Implemented in provider-errors.ts -->
- Network connectivity issues ✅ <!-- Handled by handleNetworkError and retry mechanism -->
- Session expiration handling ✅ <!-- Managed through session-errors.ts -->
- Retry mechanisms with backoff ✅ <!-- Implemented in retry-utils.ts -->

## 7. Security Measures

### 7.1. Implement CSRF protection

- Enable NextAuth CSRF tokens
- Configure Double Submit Cookie pattern

### 7.2. Configure secure cookies

```typescript
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/'
}
```

### 7.3. Implement token security

- JWT refresh mechanism
- Automatic token rotation
- Session invalidation on security events

## 8. Testing Implementation

### 8.1. Unit tests

- Provider integration tests
- Session management tests
- Error handling tests

### 8.2. Integration tests

- Authentication flow tests
- Session persistence tests
- Security measure tests

### 8.3. E2E tests

- Complete login flows
- Profile completion redirects
- Error scenario handling

## 9. Documentation

### 9.1. API documentation

- Authentication endpoints
- Session management APIs
- Error codes and messages

### 9.2. Developer documentation

- Setup instructions
- Environment configuration
- Debugging guidelines

## References

- req-sso.md: SSO Requirements
- spec-sso.md: SSO Technical Specification
- req-profile.md: User Profile Requirements
- req-session.md: Session Management Requirements
