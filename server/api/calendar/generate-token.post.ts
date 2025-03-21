import prisma from "~/server/utils/prisma";
import { randomBytes } from "crypto";
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

    // Generate a new token
    const icsToken = randomBytes(32).toString("hex");

    // Update user with new ICS token
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { icsToken },
      select: {
        id: true,
        icsToken: true,
      },
    });

    return {
      success: true,
      icsToken: updatedUser.icsToken,
    };
  } catch (error) {
    console.error("Error generating ICS token:", error);
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la génération du token ICS",
    });
  }
});
