// auth.service.ts
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

export const registerUser = async (data: any) => {
  const result = await auth.api.signUpEmail({
    body: {
      name: data.name,
      email: data.email,
      password: data.password,
       role: data.role,
      image: data.image,
    },
  });

  return {
    success: true,
    message: "User registered",
    data: result,
  };
};

export const loginUser = async (data: any) => {
  const result = await auth.api.signInEmail({
    body: {
      email: data.email,
      password: data.password,
    },
  });

  return {
    success: true,
    message: "Login success",
    data: result,
  };
};





// export const getMe = async (headers: any) => {
//   const session = await auth.api.getSession({ headers });

//   return {
//     success: true,
//     data: session?.user,
//   };
// };
export const updateMe = async (
  userId: string,
  data: { name?: string; image?: string }
) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: data.name,
      image: data.image,
    },
  });
};






// auth.service.ts
export const getSessionUser = async (rawHeaders: Record<string, string | string[] | undefined>) => {
  try {
    // Convert Express headers to Web API Headers object
    const headers = new Headers();
    for (const [key, value] of Object.entries(rawHeaders)) {
      if (value) {
        headers.set(key, Array.isArray(value) ? value.join(", ") : value);
      }
    }

    const session = await auth.api.getSession({ headers });

    if (!session || !session.user) {
      return null;
    }

    return session.user;
  } catch (error) {
    console.error("Service Error:", error);
    throw error;
  }
};
