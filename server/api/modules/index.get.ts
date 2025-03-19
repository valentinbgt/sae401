import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const modules = await prisma.module.findMany({
      orderBy: {
        code: "asc",
      },
    });

    return {
      status: "success",
      data: modules,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des modules:", error);
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la récupération des modules",
    });
  }
});
