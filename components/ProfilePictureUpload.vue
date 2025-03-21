<template>
  <div class="profile-picture-upload">
    <div class="picture-container relative">
      <img
        :src="displayImage"
        class="w-60 aspect-square rounded-full border object-cover overflow-hidden"
        alt="Photo de profil"
      />
      <div
        @click="triggerFileInput"
        class="change-overlay absolute inset-0 rounded-full flex items-center justify-center bg-indigo-500/80 opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-xl font-semibold"
      >
        <span class="text-white text-center">Changer la photo</span>
      </div>
    </div>
    <input
      type="file"
      ref="fileInput"
      accept="image/*"
      class="hidden"
      @change="onFileSelected"
    />
    <div v-if="isUploading" class="mt-2 text-sm text-indigo-600">
      Téléchargement en cours...
    </div>
    <div v-else-if="errorMessage" class="mt-2 text-sm text-red-600">
      {{ errorMessage }}
    </div>
    <button
      v-if="hasChanges"
      @click="saveProfilePicture"
      class="mt-4 cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium px-4 py-2 rounded-xl"
      :disabled="isUploading"
    >
      Enregistrer
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import defaultProfilePic from "/icons/account.svg";

const props = defineProps({
  currentImage: {
    type: String,
    default: null,
  },
  defaultImage: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["update:image"]);
const fileInput = ref(null);
const previewImage = ref(props.currentImage);
const newImageData = ref(null);
const isUploading = ref(false);
const errorMessage = ref("");

// Compute the display image with proper fallbacks
const displayImage = computed(() => {
  if (previewImage.value) {
    return previewImage.value;
  }
  if (props.defaultImage) {
    return props.defaultImage;
  }
  return defaultProfilePic;
});

const hasChanges = computed(() => {
  return newImageData.value !== null;
});

const triggerFileInput = () => {
  fileInput.value.click();
};

const onFileSelected = (event) => {
  const file = event.target.files[0];

  if (!file) return;

  // Check file type
  if (!file.type.match("image.*")) {
    errorMessage.value = "Veuillez sélectionner une image";
    return;
  }

  // Check file size (limit to 2MB)
  if (file.size > 2 * 1024 * 1024) {
    errorMessage.value = "L'image doit être moins de 2MB";
    return;
  }

  errorMessage.value = "";

  // Create a preview
  const reader = new FileReader();

  reader.onload = (e) => {
    previewImage.value = e.target.result;
    newImageData.value = e.target.result;
  };

  reader.readAsDataURL(file);
};

const saveProfilePicture = async () => {
  if (!newImageData.value) return;

  isUploading.value = true;
  errorMessage.value = "";

  try {
    // Emit the base64 image data up to the parent component
    emit("update:image", newImageData.value);
    newImageData.value = null; // Reset changes after successful upload
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    errorMessage.value = "Une erreur est survenue lors du téléchargement";
  } finally {
    isUploading.value = false;
  }
};
</script>

<style scoped>
.profile-picture-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
