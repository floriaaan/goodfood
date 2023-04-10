/**
 * Tests mocks
 *
 * This file is used to mock the Prisma client in tests.
 *
 */

import prisma from "@delivery/lib/mocks/prisma";
import { vitest } from "vitest";

vitest.mock("@prisma/client", () => prisma);
vitest.mock("@delivery/lib/prisma", () => prisma);

