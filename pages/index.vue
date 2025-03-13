<template>
  <TopNav :notif="true">Dashboard</TopNav>
  <div
    class="max-w-6xl h-96 border rounded-4xl py-6 flex items-center flex-col"
  >
    <h2 class="font-bold text-2xl">Prochains rendus</h2>
    <Separator>Lundi 24 mars</Separator>
    <TimeSlot
      time="12h30"
      title="WR412 - Rendre les travaux sur le VPS"
      sub-title="R. Delon | Rendu sur VPS"
    />
  </div>
</template>
