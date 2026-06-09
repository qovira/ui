<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import Avatar from "./Avatar.svelte";

  const { Story } = defineMeta({
    title: "Data/Avatar",
    component: Avatar,
    tags: ["autodocs"],
  });

  // A 1×1 transparent GIF — a src that loads, for the photo case.
  const PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
</script>

<!-- No image: the fallback shows initials derived from the name. The whole
     avatar is one labelled image, so assistive tech announces the name. -->
<Story
  name="Initials"
  play={async ({ canvas }) => {
    const avatar = canvas.getByRole("img", { name: "Ada Lovelace" });
    await expect(avatar).toHaveTextContent("AL");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-text p-6">
      <Avatar name="Ada Lovelace" />
    </div>
  {/snippet}
</Story>

<!-- A loading image. The <img> is decorative (the root carries the name). -->
<Story
  name="Photo"
  play={async ({ canvas }) => {
    await expect(canvas.getByRole("img", { name: "Ada Lovelace" })).toBeInTheDocument();
    // The real <img> renders (it's aria-hidden via alt=""), distinct from the
    // role="img" wrapper that carries the name.
    await expect(canvas.getByRole("img").querySelector("img")).toBeInTheDocument();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-text p-6">
      <Avatar name="Ada Lovelace" src={PIXEL} />
    </div>
  {/snippet}
</Story>

<!-- AC: when the image fails to load, Bits flips to the fallback and the
     initials appear. -->
<Story
  name="Image fails"
  play={async ({ canvas }) => {
    await expect(await canvas.findByText("GH")).toBeVisible();
    await expect(canvas.getByRole("img", { name: "Grace Hopper" })).toBeInTheDocument();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-text p-6">
      <!-- A malformed data URI: the browser fails to decode it and fires the
           image's error event in-page, with no server round-trip. -->
      <Avatar name="Grace Hopper" src="data:image/png;base64,this-is-not-valid-image-data" />
    </div>
  {/snippet}
</Story>

<!-- A name with no letters yields no initials, so the fallback shows the person
     icon instead — still labelled with the name. -->
<Story
  name="Icon fallback"
  play={async ({ canvas }) => {
    const avatar = canvas.getByRole("img", { name: "?" });
    await expect(avatar.querySelector("svg")).toBeInTheDocument();
    await expect(avatar).not.toHaveTextContent(/[A-Z]/);
  }}
>
  {#snippet template()}
    <div class="bg-surface text-text p-6">
      <Avatar name="?" />
    </div>
  {/snippet}
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-text flex items-center gap-4 p-6">
      <Avatar name="Ada Lovelace" size="sm" />
      <Avatar name="Grace Hopper" size="md" />
      <Avatar name="Alan Turing" size="lg" />
      <Avatar name="?" size="lg" />
    </div>
  {/snippet}
</Story>
