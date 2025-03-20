import prisma from "~/server/utils/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    // Check if user is authenticated using JWT from Authorization header
    const authHeader = getRequestHeader(event, "authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        status: "error",
        message: "Token d'authentification manquant ou invalide",
      };
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return {
        status: "error",
        message: "Token d'authentification manquant",
      };
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET environment variable is not defined");
      return {
        status: "error",
        message: "Erreur de configuration du serveur",
      };
    }

    // Verify and decode the token
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    } catch (tokenError: any) {
      console.error("JWT verification error:", tokenError.message);
      return {
        status: "error",
        message: "Token d'authentification invalide",
      };
    }

    const userId = decoded.userId;
    if (!userId) {
      return {
        status: "error",
        message: "Token d'authentification invalide (userId manquant)",
      };
    }

    // Get user to check if they are an admin
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { admin: true },
    });

    if (!currentUser || !currentUser.admin) {
      return {
        status: "error",
        message: "Accès non autorisé. Vous devez être administrateur.",
      };
    }

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        semestre: true,
        prof: true,
        admin: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return {
      status: "success",
      data: users,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return {
      status: "error",
      message: "Erreur lors de la récupération des utilisateurs",
    };
  }
});
