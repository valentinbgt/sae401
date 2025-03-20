import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        message: "ID de deadline invalide",
      });
    }

    const deadline = await prisma.deadline.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        moduleRel: true, // Include related module information
      },
    });

    if (!deadline) {
      throw createError({
        statusCode: 404,
        message: "Deadline non trouvée",
      });
    }

    return {
      status: "success",
      data: deadline,
    };
  } catch (error: any) {
    console.error("Erreur lors de la récupération de la deadline:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la récupération de la deadline",
    });
  }
});
