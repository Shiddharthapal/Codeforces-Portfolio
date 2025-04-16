# Registration System Fix Plan

## Current Issues

1. Missing API endpoint for user registration
2. Incomplete user data storage in Redux state
3. Potential disconnection between collected data and stored data

## Implementation Plan

### 1. Create API Registration Endpoint

Create a new API route handler at `src/pages/api/register.ts`:

```typescript
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/model/User";
import dbConnect from "@/lib/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = User.build({ name, email, password });
    await user.save();

    // Generate token
    const token = user.generateAuthToken();

    // Return user data and token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error creating user" });
  }
}
```

### 2. Update Redux Auth State

Update the auth slice to include name in the user state:

1. Update auth slice interface in `src/redux/slices/authSlice.ts`:

```typescript
interface AuthState {
  user: {
    _id: string;
    name: string; // Add name field
    email: string;
  } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
```

2. Update loginSuccess action in handleRegister:

```typescript
dispatch(
  loginSuccess({
    _id: result._id,
    name: result.name, // Include name
    email: credentials.email,
    token: result.token,
  })
);
```

### 3. Data Flow Validation

Ensure proper data flow through the system:

1. Registration Form → handleRegister

   - Verify all user data (name, email, password) is collected and sent

2. handleRegister → API Endpoint

   - Confirm all data is properly sent in the request body
   - Validate request format and content type

3. API Endpoint → Database

   - Verify User model correctly saves all fields
   - Ensure proper error handling and validation

4. Database → Redux State
   - Confirm all relevant user data is returned from API
   - Verify Redux state is updated with complete user information

## Testing Plan

1. Registration Flow

   - Test successful registration with all fields
   - Verify user data is saved in database
   - Confirm Redux state contains complete user data

2. Error Handling

   - Test duplicate email registration
   - Verify validation error handling
   - Check error message display in UI

3. Data Consistency
   - Verify name appears in UI after registration
   - Confirm data persistence across page reloads
   - Test token-based authentication with complete user data

## Implementation Steps

1. Create API endpoint
2. Update Redux state management
3. Test registration flow
4. Verify data consistency
5. Implement error handling
6. Document changes
