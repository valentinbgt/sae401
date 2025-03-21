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
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
          },
        }, // Include author information
      },
    });

    if (!deadline) {
      throw createError({
        statusCode: 404,
        message: "Deadline non trouvée",
      });
    }

    // Rename the user field to auteur for consistency with frontend
    const deadlineWithAuteur = {
      ...deadline,
      auteur: deadline.user,
      user: undefined, // Mark user as optional
    };
    delete deadlineWithAuteur.user;

    return {
      status: "success",
      data: deadlineWithAuteur,
    };
  } catch (error: any) {
    console.error("Erreur lors de la récupération de la deadline:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la récupération de la deadline",
    });
  }
});
