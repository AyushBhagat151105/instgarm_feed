import { Router } from "express";

import authRoutes from "./auth.routes";
import commentRoutes from "./comment.routes";
import feedRoutes from "./feed.routes";
import likeRoutes from "./like.routes";
import postRoutes from "./post.routes";
import userRoutes from "./user.routes";

const apiRouter: Router = Router();

apiRouter.use(authRoutes);
apiRouter.use(userRoutes);
apiRouter.use(postRoutes);
apiRouter.use(feedRoutes);
apiRouter.use(likeRoutes);
apiRouter.use(commentRoutes);

export default apiRouter;
