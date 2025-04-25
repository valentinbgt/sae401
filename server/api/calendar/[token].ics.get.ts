import prisma from "~/server/utils/prisma";
import ical from "ical-generator";

export default defineEventHandler(async (event) => {
  try {
    // Extract token directly from the URL path
    const url = getRequestURL(event);
    const pathParts = url.pathname.split("/");
    const tokenWithExtension = pathParts[pathParts.length - 1];
    const token = tokenWithExtension.replace(".ics", "");

    if (!token) {
      throw createError({
        statusCode: 400,
        message: "Token manquant",
      });
    }

    // Find user by ICS token
    const user = await prisma.user.findFirst({
      where: { icsToken: token },
      select: {
        id: true,
        nom: true,
        prenom: true,
        semestre: true, // Added semestre to select
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        message: "Calendrier non trouvé",
      });
    }

    // Calculate semester group for filtering
    const userSemester = user.semestre || 1;
    const semesterGroup = Math.ceil(userSemester / 2);
    const relevantSemesters = [semesterGroup * 2 - 1, semesterGroup * 2];

    // Get deadlines for this user with semester scoping
    const deadlines = await prisma.deadline.findMany({
      where: {
        AND: [
          { moduleRel: { semestre: { in: relevantSemesters } } },
          {
            OR: [{ auteur: user.id }, { etendue: "ALL" }],
          },
        ],
      },
      include: {
        moduleRel: true,
      },
    });

    // Create iCal calendar
    const calendar = ical({
      name: `Deadlines de ${user.prenom} ${user.nom}`,
      timezone: "Europe/Paris",
    });

    // Add deadlines to calendar
    deadlines.forEach((deadline) => {
      calendar.createEvent({
        start: deadline.timestamp,
        end: new Date(deadline.timestamp.getTime() + 60 * 60 * 1000), // Add 1 hour
        summary: `${deadline.moduleRel.code} - ${deadline.titre}`,
        description: deadline.description || "",
        location:
          deadline.lieu +
          (deadline.lieuDetails ? ` (${deadline.lieuDetails})` : ""),
      });
    });

    // Set response headers for iCal file
    setResponseHeaders(event, {
      "Content-Type": "text/calendar",
      "Content-Disposition": `attachment; filename="deadlines-${user.prenom.toLowerCase()}-${user.nom.toLowerCase()}.ics"`,
      // Prevent caching to ensure fresh calendar data
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    // Return the iCal content
    return calendar.toString();
  } catch (error) {
    console.error("Error generating iCal file:", error);
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la génération du calendrier",
    });
  }
});
