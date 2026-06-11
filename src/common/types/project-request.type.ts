import type { Request } from 'express';
import type { Project } from '@prisma/generated/prisma/client';

export type ProjectRequest = Request & { resolvedProject: Project };
