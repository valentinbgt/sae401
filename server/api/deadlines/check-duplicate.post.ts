import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const existingDeadline = await prisma.deadline.findFirst({
      where: {
        AND: [
          { module: body.module },
          { timestamp: new Date(body.timestamp) },
          { etendue: body.etendue },
        ],
      },
    });

    return {
      exists: !!existingDeadline,
      deadline: existingDeadline,
    };
  } catch (error) {
    console.error("Erreur lors de la vérification des doublons:", error);
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la vérification des doublons",
    });
  }
});
