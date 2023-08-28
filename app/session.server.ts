import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

type User = {
  id: string
  name: string
  token: string
}

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_SESSION_KEY = "user";

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUser(request: Request): Promise<User | undefined> {
  const session = await getSession(request)
  return session.get(USER_SESSION_KEY)
}

export async function requireUser(request: Request, redirectTo: string = "/") {
  const user = await getUser(request)

  if (!user) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw await logout(request, `/login?${searchParams}`)
  }

  return user
}

export async function createUserSession({
  request,
  user,
  remember,
  defaultRedirectTo,
}: {
  request: Request;
  user: User
  remember: boolean;
  defaultRedirectTo: string;
}) {
  const session = await getSession(request);

  session.set(USER_SESSION_KEY, user)

  const url = new URL(request.url)
  const redirectTo = url.searchParams.get("redirectTo") ?? defaultRedirectTo

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function logout(request: Request, redirectTo: string = "/") {
  const session = await getSession(request);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
