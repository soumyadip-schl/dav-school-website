import { Router, Request, Response } from "express";

const router = Router();

router.get("/ping", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Ping successful",
    timestamp: new Date().toISOString(),
  });
});

export default router;
