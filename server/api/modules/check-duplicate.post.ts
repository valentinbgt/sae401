import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const existingModule = await prisma.module.findUnique({
      where: {
        code: body.code,
      },
    });

    return {
      exists: !!existingModule,
      module: existingModule,
    };
  } catch (error) {
    console.error("Erreur lors de la vérification des doublons:", error);
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la vérification des doublons",
    });
  }
});
