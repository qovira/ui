<script lang="ts">
  import { Avatar } from "bits-ui";
  import { UserIcon } from "phosphor-svelte";
  import Icon from "../icons/Icon.svelte";
  import { cn } from "../internal/cn.js";
  import type { AvatarSize } from "./avatar-types.js";

  interface Props {
    /** Person/entity name — the accessible label, and the source of the initials. */
    name: string;
    /** Image URL. Omitted or on load failure, the fallback (initials/icon) shows. */
    src?: string;
    /** Diameter. */
    size?: AvatarSize;
    class?: string;
  }

  let { name, src, size = "md", class: klass }: Props = $props();

  // The trimmed name is the accessible label. If it's empty (misuse — name is
  // required), the avatar degrades to a decorative placeholder rather than a
  // role="img" with no accessible name.
  const label = $derived(name.trim());

  // Up to two initials — the first LETTER of the first two words. A name with no
  // letters (an id, a symbol) yields none, and the fallback shows a person icon.
  const initials = $derived(
    name
      .split(/\s+/)
      .map((word) => word.match(/\p{L}/u)?.[0] ?? "")
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase(),
  );

  const SIZE = {
    sm: "size-8 text-small",
    md: "size-10 text-small",
    lg: "size-12 text-body",
  } as const;
</script>

<!-- Bits owns the load/fallback behavior: the image is hidden until it loads and
     the fallback shows while loading or on error. The whole avatar is one
     labelled image (role="img" + aria-label=name), so the name is announced in
     every state; the <img> is decorative (alt="") and the fallback is hidden
     from assistive tech to avoid a second, redundant announcement. -->
<Avatar.Root
  {...label ? { role: "img", "aria-label": label } : { "aria-hidden": true }}
  class={cn(
    "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full border border-border bg-surface-raised font-sans font-medium text-text",
    SIZE[size],
    klass,
  )}
>
  {#if src}
    <Avatar.Image {src} alt="" class="size-full rounded-[inherit] object-cover" />
  {/if}
  <Avatar.Fallback aria-hidden="true" class="inline-flex size-full items-center justify-center">
    {#if initials}
      {initials}
    {:else}
      <Icon icon={UserIcon} decorative />
    {/if}
  </Avatar.Fallback>
</Avatar.Root>
