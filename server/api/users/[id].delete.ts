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

    const currentUserId = decoded.userId;
    if (!currentUserId) {
      return {
        status: "error",
        message: "Token d'authentification invalide (userId manquant)",
      };
    }

    // Check if the current user is admin
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { admin: true },
    });

    if (!currentUser || !currentUser.admin) {
      return {
        status: "error",
        message: "Accès non autorisé. Vous devez être administrateur.",
      };
    }

    // Get the user ID from the URL parameter
    const userIdStr = event.context.params?.id;
    if (!userIdStr) {
      return {
        status: "error",
        message: "ID utilisateur manquant",
      };
    }

    const userId = parseInt(userIdStr);

    // Prevent deleting yourself
    if (userId === currentUserId) {
      return {
        status: "error",
        message: "Vous ne pouvez pas supprimer votre propre compte",
      };
    }

    // Delete the user
    await prisma.user.delete({
      where: { id: userId },
    });

    return {
      status: "success",
      message: "Utilisateur supprimé avec succès",
    };
  } catch (error: any) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);

    // Check if it's a Prisma error for record not found
    if (error.code === "P2025") {
      return {
        status: "error",
        message: "Utilisateur introuvable",
      };
    }

    return {
      status: "error",
      message: "Erreur lors de la suppression de l'utilisateur",
    };
  }
});
