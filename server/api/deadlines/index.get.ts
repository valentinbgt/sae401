import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event);
    const userId = query.userId ? String(query.userId) : undefined;
    
    // Build the query based on whether userId is provided
    const deadlines = await prisma.deadline.findMany({
      where: userId ? {
        auteur: parseInt(userId)
      } : {},
      orderBy: {
        timestamp: "asc",
      },
      include: {
        moduleRel: true, // Include associated module information
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
