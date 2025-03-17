import { writeFile } from "fs/promises";
import { join } from "path";
import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
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
        auteur: "user123", // TODO: Récupérer l'ID de l'utilisateur connecté
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
