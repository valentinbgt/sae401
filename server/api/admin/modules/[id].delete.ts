import prisma from "~/server/utils/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    // Check if user is authenticated using JWT from Authorization header
    const authHeader = getRequestHeader(event, "authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError({
        statusCode: 401,
        message: "Token d'authentification manquant ou invalide",
      });
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET non défini");
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    const userId = decoded.userId;

    // Get user to verify admin status
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { admin: true },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        message: "Utilisateur introuvable",
      });
    }

    // Verify user is admin
    if (!user.admin) {
      throw createError({
        statusCode: 403,
        message: "Accès non autorisé",
      });
    }

    // Get the module ID from the URL
    const moduleId = Number(event.context.params?.id);
    if (isNaN(moduleId)) {
      throw createError({
        statusCode: 400,
        message: "ID de module invalide",
      });
    }

    // Check if the module exists
    const existingModule = await prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        deadlines: true,
      },
    });

    if (!existingModule) {
      throw createError({
        statusCode: 404,
        message: "Module introuvable",
      });
    }

    // Check if module has associated deadlines and prevent deletion if it does
    if (existingModule.deadlines && existingModule.deadlines.length > 0) {
      throw createError({
        statusCode: 400,
        message:
          "Impossible de supprimer un module avec des deadlines associées",
      });
    }

    // Delete the module
    await prisma.module.delete({
      where: { id: moduleId },
    });

    return {
      status: "success",
      message: "Module supprimé avec succès",
    };
  } catch (error: any) {
    console.error("Erreur lors de la suppression du module:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la suppression du module",
    });
  }
});
