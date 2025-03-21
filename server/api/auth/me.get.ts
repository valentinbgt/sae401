import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Récupérer le token depuis les headers
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

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    const userId = decoded.userId;

    // Récupérer les informations de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        statut: true,
        prof: true,
        admin: true,
        profilePicture: true,
        semestre: true,
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        message: "Utilisateur non trouvé",
      });
    }

    return user;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des informations utilisateur:",
      error
    );
    throw createError({
      statusCode: 401,
      message: "Token invalide ou expiré",
    });
  }
});
