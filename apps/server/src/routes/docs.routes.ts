import { apiReference } from "@scalar/express-api-reference";
import { Router } from "express";

import { generateOpenApiDocument } from "../lib/openapi";

const router: Router = Router();

router.get("/openapi.json", (_req, res, next) => {
  try {
    const doc = generateOpenApiDocument();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(doc);
  } catch (err) {
    next(err);
  }
});

router.use(
  "/",
  apiReference({
    url: "/api/docs/openapi.json",
    theme: "purple",
    pageTitle: "Instagram Feed & Profile API Reference",
  } as any),
);

export default router;
