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

    // Get user with their semester information
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { semestre: true, prof: true, admin: true },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        message: "Utilisateur introuvable",
      });
    }

    let superUser = user.prof || user.admin;
    let querySemestre: number[] = [];

    switch (user.semestre) {
      case 1:
      case 2:
        querySemestre = [1, 2];
        break;
      case 3:
      case 4:
        querySemestre = [3, 4];
        break;
      case 5:
      case 6:
        querySemestre = [5, 6];
        break;
      default:
        if(superUser) {
          querySemestre = [1, 2, 3, 4, 5, 6];
        } else {
          throw createError({
            statusCode: 400,
            message: "Semestre de l'utilisateur invalide",
          });
        }
    }


    const modules = await prisma.module.findMany({
      where: {
        semestre: {
          in: querySemestre
        }
      },
      orderBy: {
        code: "asc",
      },
    });

    return {
      status: "success",
      data: modules,
      userSemestre: user.semestre
    };
  } catch (error: any) {
    console.error("Erreur lors de la récupération des modules:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la récupération des modules",
    });
  }
});