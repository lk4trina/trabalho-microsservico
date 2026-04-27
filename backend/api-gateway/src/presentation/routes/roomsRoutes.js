module.exports = (controller, authMiddleware, roleMiddleware) => {
  const router = require("express").Router();

  router.get("/rooms", authMiddleware, controller.list);

  router.post(
    "/rooms",
    authMiddleware,
    roleMiddleware("ADMIN"),
    controller.create,
  );

  router.patch(
    "/rooms/:id/toggle",
    authMiddleware,
    roleMiddleware("ADMIN"),
    controller.toggle,
  );

  router.put(
    "/rooms/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    controller.update,
  );

  router.delete(
    "/rooms/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    controller.delete,
  );

  return router;
};
