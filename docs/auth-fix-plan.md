# Authentication Flow Fix Plan

## Current Issues

1. Authentication state inconsistency:

- `checkAuth()` function returns incorrect value after registration
- `isAuthenticated` is null for registered users
- Auth state not properly persisting

## Root Causes

1. **Token Validation**

- Need to verify if token validation is happening properly
- Check if token is being stored correctly after registration
- Ensure token expiration is handled

2. **State Management**

- Redux auth slice may not be updating properly
- Initial state loading might be incomplete
- State persistence between refreshes may be broken

3. **Auth Flow Timing**

- Registration success may not properly sync with auth state
- Race conditions between state updates
- Async operations not properly chained

## Proposed Solution

### 1. Improve Auth State Management

```typescript
// Redux auth slice improvements
interface AuthState {
  _id: string;
  token: string;
  isAuthenticated: boolean;
  loading: boolean; // Add loading state
}

const initialState: AuthState = {
  _id: "",
  token: "",
  isAuthenticated: false,
  loading: true,
};

// Add proper state transitions
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
    },
    authSuccess: (state, action) => {
      state.isAuthenticated = true;
      state._id = action.payload._id;
      state.token = action.payload.token;
      state.loading = false;
    },
    authFail: (state) => {
      state.isAuthenticated = false;
      state._id = "";
      state.token = "";
      state.loading = false;
    },
  },
});
```

### 2. Enhanced Token Management

```typescript
// lib/auth.ts improvements
export const checkAuth = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;

    // Add token validation
    const decodedToken = decodeToken(token);
    if (!decodedToken || isTokenExpired(decodedToken)) {
      localStorage.removeItem("token");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Auth check failed:", error);
    return false;
  }
};

// Add proper token storage
export const storeAuthToken = (token: string) => {
  localStorage.setItem("token", token);
};
```

### 3. Registration Flow Updates

```typescript
// Registration success handler
const handleRegistrationSuccess = async (data) => {
  try {
    // Store token
    storeAuthToken(data.token);

    // Update Redux state
    dispatch(
      authSuccess({
        _id: data._id,
        token: data.token,
      })
    );

    // Redirect only after state is updated
    navigate("/home");
  } catch (error) {
    console.error("Registration state update failed:", error);
    dispatch(authFail());
  }
};
```

## Implementation Steps

1. Update Redux Store:

   - Add loading state
   - Improve action creators
   - Add proper error handling

2. Enhance Token Management:

   - Add token validation
   - Improve storage mechanism
   - Handle token expiration

3. Fix Registration Flow:

   - Ensure proper state updates
   - Add error handling
   - Fix navigation timing

4. Add Error Recovery:
   - Handle failed auth checks
   - Clear invalid tokens
   - Redirect to login when needed

## Testing Plan

1. User Registration Flow:

   - Register new user
   - Verify token storage
   - Check auth state
   - Verify navigation

2. Session Persistence:

   - Refresh page
   - Close/reopen browser
   - Multiple tabs

3. Error Cases:
   - Invalid tokens
   - Network errors
   - Token expiration

## Migration Strategy

1. Implement changes in following order:

   - Redux store updates
   - Token management
   - Registration flow
   - Error handling

2. Add logging for debugging
3. Test thoroughly in development
4. Deploy with rollback plan
