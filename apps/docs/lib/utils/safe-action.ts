/* @proprietary license */

// import { createClient } from "@/lib/supabase/server";
// import { createSafeActionClient } from "next-safe-action";
// import type { Database } from "@/lib/types/database";
// import { SupabaseClient } from "@supabase/supabase-js";

// export const action = createSafeActionClient();

// export const authAction = createSafeActionClient().use(async ({ next }) => {
//   const supabase = await createClient();
//   const {
//     data: { user },
//     error: userError,
//   } = await supabase.auth.getUser();

//   if (userError || !user) {
//     throw new Error("User is not authenticated");
//   }

//   // Ensure the session is valid and refresh it
//   const {
//     data: { session },
//     error: sessionError,
//   } = await supabase.auth.getSession();

//   if (sessionError || !session) {
//     throw new Error("Session is invalid or expired");
//   }

//   return next({
//     ctx: {
//       user,
//       supabase: supabase as SupabaseClient<Database>,
//     },
//   });
// });
