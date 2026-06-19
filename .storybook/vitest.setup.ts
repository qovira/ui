import { beforeAll } from "vitest";
import { setProjectAnnotations } from "@storybook/sveltekit";
import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import * as projectAnnotations from "./preview";

// Make every story-as-test render with the same decorators, parameters, and globals as real Storybook, and wire the
// a11y addon into the test pass. Order matters: addon annotations first, our preview last.
const annotations = setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);

beforeAll(annotations.beforeAll);
