import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const deadlines = await prisma.deadline.findMany({
      orderBy: {
        timestamp: "asc",
      },
      include: {
        moduleRel: true, // Inclure les informations du module associé
      },
    });

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
