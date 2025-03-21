import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    // Parse the request body
    const body = await readBody(event);

    // Check for required fields
    if (!body) {
      throw createError({
        statusCode: 400,
        message: "Aucune donnée fournie",
      });
    }

    // Get user from database to verify
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        message: "Utilisateur non trouvé",
      });
    }

    // Construct update data based on what was provided
    const updateData: any = {};

    // Only update profilePicture if it's provided
    if (body.profilePicture !== undefined) {
      updateData.profilePicture = body.profilePicture;
    }

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
    });

    // Return success response without sensitive data
    return {
      status: "success",
      user: {
        id: updatedUser.id,
        nom: updatedUser.nom,
        prenom: updatedUser.prenom,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
        admin: updatedUser.admin,
        prof: updatedUser.prof,
        semestre: updatedUser.semestre,
        statut: updatedUser.statut,
      },
    };
  } catch (error: any) {
    console.error("Error updating profile:", error);

    throw createError({
      statusCode: 500,
      message: "Une erreur est survenue lors de la mise à jour du profil",
    });
  }
});
