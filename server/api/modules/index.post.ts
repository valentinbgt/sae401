import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    // Vérification des champs obligatoires
    if (!body.code || !body.titre || !body.semestre) {
      throw createError({
        statusCode: 400,
        message: "Tous les champs sont obligatoires",
      });
    }

    // Conversion du semestre en nombre
    const semestre = parseInt(body.semestre);

    // Validation du semestre
    if (isNaN(semestre) || semestre < 1 || semestre > 6) {
      throw createError({
        statusCode: 400,
        message: "Le semestre doit être un nombre entre 1 et 8",
      });
    }

    // Création du module
    const module = await prisma.module.create({
      data: {
        code: body.code,
        titre: body.titre,
        semestre: semestre,
      },
    });

    return {
      status: "success",
      data: module,
    };
  } catch (error: any) {
    console.error("Erreur lors de la création du module:", error);

    // Si l'erreur est liée à un code dupliqué (unique constraint violation)
    if (error.code === "P2002" && error.meta?.target?.includes("code")) {
      throw createError({
        statusCode: 409,
        message: "Un module avec ce code existe déjà",
      });
    }

    throw createError({
      statusCode: 500,
      message: "Erreur lors de la création du module",
    });
  }
});
