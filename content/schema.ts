import { z } from "zod";

export const yearMonthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);

export const projectSchema = z.strictObject({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  summary: z.string().min(1).max(180),
  status: z.enum(["live", "building", "archived"]),
  tags: z.array(z.string().min(1)).min(1),
  stack: z.array(z.string().min(1)).optional(),
  links: z
    .strictObject({
      live: z.httpUrl().optional(),
      repo: z.httpUrl().optional(),
      x: z.httpUrl().optional(),
    })
    .optional(),
  image: z.string().startsWith("/projects/").optional(),
  featured: z.boolean().optional(),
  startedAt: yearMonthSchema,
  body: z.string().optional(),
});

export const farmSchema = z.strictObject({
  name: z.string().min(1),
  url: z.httpUrl(),
  chains: z.array(z.string().min(1)).min(1),
  status: z.enum(["active", "ended"]),
  logo: z.string().startsWith("/farms/").optional(),
  logoMono: z.boolean().optional(),
  referral: z.httpUrl().optional(),
  note: z.string().max(100).optional(),
  since: yearMonthSchema.optional(),
});

export const siteSchema = z.strictObject({
  handle: z.string().min(1),
  title: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  url: z.httpUrl().refine((u) => !u.endsWith("/"), "Must not end with a slash"),
  links: z.strictObject({
    x: z.httpUrl(),
    telegram: z.httpUrl(),
    telegramDm: z.httpUrl(),
    github: z.httpUrl(),
  }),
  buildsWith: z.array(z.string().min(1)).min(1),
});

export type Site = z.infer<typeof siteSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Farm = z.infer<typeof farmSchema>;

export function parseProjects(raw: unknown): Project[] {
  const projects = z
    .array(projectSchema)
    .superRefine((list, ctx) => {
      const seen = new Set<string>();
      list.forEach((p, index) => {
        if (seen.has(p.slug)) {
          ctx.addIssue({
            code: "custom",
            path: [index, "slug"],
            message: `Duplicate slug "${p.slug}"`,
          });
        }
        seen.add(p.slug);
      });
    })
    .parse(raw);
  return projects;
}

export function parseFarms(raw: unknown): Farm[] {
  return z.array(farmSchema).parse(raw);
}

export function parseSite(raw: unknown): Site {
  return siteSchema.parse(raw);
}
