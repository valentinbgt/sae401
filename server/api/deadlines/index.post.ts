import { writeFile } from "fs/promises";
import { join } from "path";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // TODO: Sauvegarder dans la base de données

  // Pour l'instant, on retourne simplement les données
  return {
    status: "success",
    data: {
      ...body,
      id: Date.now(), // À remplacer par l'ID généré par la DB
      createdAt: new Date().toISOString(),
    },
  };
});
