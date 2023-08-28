import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useSearchParams } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import { performMutation } from "remix-forms";
import { z } from "zod";
import { Form } from "~/components/common/form/form";

import { createUserSession, getUser } from "~/session.server";
import { safeRedirect } from "~/utils";

export const meta: V2_MetaFunction = () => [{ title: "Login" }];

const schema = z.object({
  password: z.string().min(1),
  email: z.string().min(1).email(),
  redirectTo: z.string().nullable(),
  remember: z.enum(["on"]).nullable()
})

const mutation = makeDomainFunction(schema)(async (values) => {
  console.log(values)

  return {
    redirectTo: safeRedirect(values.redirectTo),
    remember: "on" ? true : false,
    user: {id: "", name: "", token: ""}
  }
})

export async function action({ request }: ActionArgs) {
  const result = await performMutation({request, mutation, schema})

  if (!result.success){ 
    return json(result, 400)
  }

  return createUserSession({
    defaultRedirectTo: result.data.redirectTo,
    remember: result.data.remember,
    request,
    user: result.data.user
  });
};

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request)
  if (user) {
    return redirect("/")
  }
  return json({})
};

export default function SignInPage() {
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/"

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form
          schema={schema}
          method="post"
          className="space-y-6"
        >
          {({ Field, Errors, register }) => (
            <>
              <Field name="email">
                {({ Errors, errors }) => (
                  <>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        {...register('email')}
                        id="email"
                        required
                        autoFocus={true}
                        type="email"
                        autoComplete="email"
                        aria-invalid={errors ? true : undefined}
                        aria-describedby="email-error"
                        className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                      />
                      <Errors className="pt-1 text-red-700" id="email-error"/>
                    </div>
                  </>
                )}
              </Field>

              <Field name="password">
                {({ Errors, errors }) => (
                  <>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        {...register('password')}
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        aria-invalid={errors ? true : undefined}
                        aria-describedby="password-error"
                        className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                      />
                      <Errors className="pt-1 text-red-700" id="email-error"/>
                    </div>
                  </>
                )}
               </Field>

              <input type="hidden" name="redirectTo" value={redirectTo} />

              <Errors />

              <button
                type="submit"
                className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
              >
                Log in
              </button>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    {...register('remember')}
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-center text-sm text-gray-500">
                  Don't have an account?{" "}
                  <Link
                    className="text-blue-500 underline"
                    to={{
                      pathname: "/sign-up",
                      search: searchParams.toString(),
                    }}
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  );
}