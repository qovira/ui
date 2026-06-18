<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import Avatar from "./Avatar.svelte";
  // Public-domain portrait of Ada Lovelace (Alfred Edward Chalon watercolour, c. 1840; artist died 1860).
  // Sourced from Wikimedia Commons / Science Museum Group. Intentionally outside src/lib so it never enters dist/.
  import adaPortrait from "../../stories-assets/ada-lovelace.jpg";

  const { Story } = defineMeta({
    title: "Data/Avatar",
    component: Avatar,
    tags: ["autodocs"],
  });
</script>

<!-- No image: the fallback shows initials derived from the name. The whole
     avatar is one labelled image, so assistive tech announces the name.
     Also asserts the edge uses the divider token — border-divider — not the hairline
     border-border, so the circle is distinguishable on both themes. -->
<Story
  name="Initials"
  play={async ({ canvas }) => {
    const avatar = canvas.getByRole("img", { name: "Ada Lovelace" });
    await expect(avatar).toHaveTextContent("AL");
    // TDD regression: the root must carry border-divider (not border-border)
    // so the avatar edge is visible in Evening as well as Daylight.
    await expect(avatar.classList.contains("border-divider")).toBe(true);
    await expect(avatar.classList.contains("border-border")).toBe(false);
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
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
    const img = canvas.getByRole("img").querySelector("img");
    await expect(img).toBeInTheDocument();
    // Assert the src resolves to the bundled ada-lovelace asset. Vite emits the
    // file as a URL (29KB is well above the 4KB inline threshold) so the URL
    // always contains the original filename.
    await expect(img?.getAttribute("src")).toContain("ada-lovelace");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Avatar name="Ada Lovelace" src={adaPortrait} />
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
    <div class="bg-surface text-fg p-6">
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
    <div class="bg-surface text-fg p-6">
      <Avatar name="?" />
    </div>
  {/snippet}
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg flex items-center gap-4 p-6">
      <Avatar name="Ada Lovelace" size="sm" />
      <Avatar name="Grace Hopper" size="md" />
      <Avatar name="Alan Turing" size="lg" />
      <Avatar name="?" size="lg" />
    </div>
  {/snippet}
</Story>

<!-- Evening: verifies the avatar edge (border-divider) reads against the dark warm-brown
     page/surface — the fix that motivated the divider-token change. No special play needed;
     visual review confirms the circle silhouette is distinguishable. -->
<Story name="Evening" globals={{ theme: "evening" }}>
  {#snippet template()}
    <div class="bg-surface text-fg flex items-center gap-4 p-6">
      <Avatar name="Ada Lovelace" size="sm" />
      <Avatar name="Grace Hopper" size="md" />
      <Avatar name="Alan Turing" size="lg" />
      <Avatar name="?" size="lg" />
    </div>
  {/snippet}
</Story>
