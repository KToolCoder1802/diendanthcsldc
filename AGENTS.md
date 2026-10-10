<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Forum UI code is written with relaxed TS flags (noImplicitReturns, exactOptionalPropertyTypes, noPropertyAccessFromIndexSignature, noUncheckedIndexedAccess off) — keeps Supabase/React handler code concise.
- Permissions (tick, sections, admin) are enforced in the database (RLS + security-definer RPCs); UI checks are cosmetic only.
- Login uses synthetic emails <username>@diendan.local; profiles are created via the complete_signup RPC, not auth triggers.
