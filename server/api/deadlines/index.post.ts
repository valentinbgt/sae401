import { writeFile } from "fs/promises";
import { join } from "path";
import prisma from "~/server/utils/prisma";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  // Vérifier si l'utilisateur est connecté
  const authHeader = getRequestHeader(event, "authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      message: "Vous devez être connecté pour créer une deadline",
    });
  }

  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET non défini");
  }

  // Récupérer l'ID de l'utilisateur depuis le token
  const decoded = jwt.verify(token, jwtSecret) as { userId: number };
  const userId = decoded.userId;

  const body = await readBody(event);

  try {
    const deadline = await prisma.deadline.create({
      data: {
        module: body.module,
        titre: body.titre,
        timestamp: new Date(body.timestamp),
        type: body.type,
        lieu: body.lieu,
        prof: body.prof,
        description: body.description,
        etendue: body.etendue,
        auteur: userId,
        historique: [], // Tableau vide initial pour l'historique
      },
    });

    return {
      status: "success",
      data: deadline,
    };
  } catch (error) {
    console.error("Erreur lors de la création de la deadline:", error);
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la création de la deadline",
    });
  }
});
