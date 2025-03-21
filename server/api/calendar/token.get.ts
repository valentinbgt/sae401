import prisma from "~/server/utils/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    // Get authentication token from header
    const authHeader = getRequestHeader(event, "authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError({
        statusCode: 401,
        message: "Non autorisé",
      });
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET non défini");
    }

    // Verify and decode token
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    const userId = decoded.userId;

    // Get user with ICS token
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        icsToken: true,
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        message: "Utilisateur non trouvé",
      });
    }

    return {
      success: true,
      icsToken: user.icsToken,
    };
  } catch (error) {
    console.error("Error fetching ICS token:", error);
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la récupération du token ICS",
    });
  }
});
