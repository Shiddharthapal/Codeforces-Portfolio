import type { APIRoute } from 'astro';
import connect from '@/lib/connection';
import User from '@/model/user';
import jwt from 'jsonwebtoken';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Connect to database
    await connect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          message: 'Email already registered',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    // Create new user
    console.log('🚀 ~ constPOST:APIRoute= ~ email:', email);
    const username = String(email).split('@')[0];
    console.log('🚀 ~ constPOST:APIRoute= ~ username:', username);
    const user = new User({
      email,
      password, // Password will be hashed by mongoose pre-save hook
      name: username,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      import.meta.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' },
    );

    return new Response(
      JSON.stringify({
        token,
        message: 'Registration successful',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({
        message: 'Internal server error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
};