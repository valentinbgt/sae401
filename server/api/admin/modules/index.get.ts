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

    // Get all modules without any filtering
    const modules = await prisma.module.findMany({
      orderBy: {
        code: "asc",
      },
    });

    return {
      status: "success",
      data: modules,
    };
  } catch (error: any) {
    console.error("Erreur lors de la récupération des modules admin:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message:
        error.message || "Erreur lors de la récupération des modules admin",
    });
  }
});
