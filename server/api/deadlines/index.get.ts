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

    let modules;

    //check if argument "my" is passed
    const my = getQuery(event).my;

    // TODO : If "my" is passed, get the modules of the user without filtering by semester

    try {
      const response = await $fetch("/api/modules", {
        method: "GET",
        headers: {
          Authorization: authHeader,
        },
      });
      if (response.status === "success") {
        modules = response.data;
      }
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: "Erreur lors de la récupérarion des modules",
      });
    }

    const deadlines = await prisma.deadline.findMany({
      where: {
        moduleRel: {
          id: {
            in: modules?.map((module) => module.id) || [],
          },
        },
      },
      orderBy: {
        timestamp: "asc",
      },
      include: {
        moduleRel: true,
      },
    });

    // Build the query based on whether userId is provided
    /*     const deadlines = await prisma.deadline.findMany({
      where: userId ? {
        auteur: parseInt(userId)
      } : {},
      orderBy: {
        timestamp: "asc",
      },
      include: {
        moduleRel: true, // Include associated module information
      },
    }); */

    return {
      status: "success",
      data: deadlines,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des deadlines:", error);
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la récupération des deadlines",
    });
  }
});
