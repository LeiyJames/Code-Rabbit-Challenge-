<template>
  <div class="w-full max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6 text-neutral-900">
      Form Validator Playground
    </h2>

    <div class="bg-white rounded-2xl shadow-lg p-8 space-y-6">
      <!-- Success Message -->
      <div
        v-if="submitSuccess"
        class="bg-green-50 border-2 border-green-500 rounded-xl p-4 flex items-start gap-3 animate-fadeIn"
      >
        <svg
          class="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <h3 class="font-bold text-green-900">Form submitted successfully!</h3>
          <p class="text-sm text-green-700 mt-1">
            All validations passed. Great job!
          </p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Username Field -->
        <div>
          <label
            for="username"
            class="block text-sm font-medium text-neutral-700 mb-2"
          >
            Username <span class="text-red-500">*</span>
          </label>
          <input
            id="username"
            v-model="formData.username"
            @blur="validateField('username')"
            @input="clearFieldError('username')"
            type="text"
            placeholder="Enter username (3-20 characters)"
            :class="[
              'w-full px-4 py-3 rounded-lg border-2 transition-all',
              errors.username
                ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                : touched.username && !errors.username
                  ? 'border-green-500 focus:ring-2 focus:ring-green-200'
                  : 'border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200',
            ]"
          />
          <!-- Error Message -->
          <p
            v-if="errors.username"
            class="mt-2 text-sm text-red-600 flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            {{ errors.username }}
          </p>
          <!-- Success Indicator -->
          <p
            v-else-if="touched.username"
            class="mt-2 text-sm text-green-600 flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            Looks good!
          </p>
        </div>

        <!-- Email Field -->
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-neutral-700 mb-2"
          >
            Email <span class="text-red-500">*</span>
          </label>
          <input
            id="email"
            v-model="formData.email"
            @blur="validateField('email')"
            @input="clearFieldError('email')"
            type="email"
            placeholder="your.email@example.com"
            :class="[
              'w-full px-4 py-3 rounded-lg border-2 transition-all',
              errors.email
                ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                : touched.email && !errors.email
                  ? 'border-green-500 focus:ring-2 focus:ring-green-200'
                  : 'border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200',
            ]"
          />
          <p
            v-if="errors.email"
            class="mt-2 text-sm text-red-600 flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            {{ errors.email }}
          </p>
          <p
            v-else-if="touched.email"
            class="mt-2 text-sm text-green-600 flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            Valid email format
          </p>
        </div>

        <!-- Password Field -->
        <div>
          <label
            for="password"
            class="block text-sm font-medium text-neutral-700 mb-2"
          >
            Password <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="formData.password"
              @blur="validateField('password')"
              @input="clearFieldError('password')"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Min 8 chars, uppercase, number, special char"
              :class="[
                'w-full px-4 py-3 pr-12 rounded-lg border-2 transition-all',
                errors.password
                  ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                  : touched.password && !errors.password
                    ? 'border-green-500 focus:ring-2 focus:ring-green-200'
                    : 'border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200',
              ]"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
            >
              <svg
                v-if="showPassword"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <svg
                v-else
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            </button>
          </div>
          <p
            v-if="errors.password"
            class="mt-2 text-sm text-red-600 flex items-start gap-1"
          >
            <svg
              class="w-4 h-4 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{{ errors.password }}</span>
          </p>
          <div
            v-else-if="touched.password && formData.password"
            class="mt-2 space-y-1"
          >
            <p class="text-xs font-medium text-neutral-600">
              Password Requirements:
            </p>
            <ul class="space-y-1">
              <li
                :class="
                  passwordChecks.length ? 'text-green-600' : 'text-neutral-500'
                "
                class="text-xs flex items-center gap-1"
              >
                <svg
                  class="w-3 h-3"
                  :class="passwordChecks.length ? 'opacity-100' : 'opacity-50'"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                At least 8 characters
              </li>
              <li
                :class="
                  passwordChecks.uppercase
                    ? 'text-green-600'
                    : 'text-neutral-500'
                "
                class="text-xs flex items-center gap-1"
              >
                <svg
                  class="w-3 h-3"
                  :class="
                    passwordChecks.uppercase ? 'opacity-100' : 'opacity-50'
                  "
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                One uppercase letter
              </li>
              <li
                :class="
                  passwordChecks.number ? 'text-green-600' : 'text-neutral-500'
                "
                class="text-xs flex items-center gap-1"
              >
                <svg
                  class="w-3 h-3"
                  :class="passwordChecks.number ? 'opacity-100' : 'opacity-50'"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                One number
              </li>
              <li
                :class="
                  passwordChecks.special ? 'text-green-600' : 'text-neutral-500'
                "
                class="text-xs flex items-center gap-1"
              >
                <svg
                  class="w-3 h-3"
                  :class="passwordChecks.special ? 'opacity-100' : 'opacity-50'"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                One special character (!@#$%^&*)
              </li>
            </ul>
          </div>
        </div>

        <!-- Confirm Password Field -->
        <div>
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-neutral-700 mb-2"
          >
            Confirm Password <span class="text-red-500">*</span>
          </label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            @blur="validateField('confirmPassword')"
            @input="clearFieldError('confirmPassword')"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Re-enter your password"
            :class="[
              'w-full px-4 py-3 rounded-lg border-2 transition-all',
              errors.confirmPassword
                ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                : touched.confirmPassword && !errors.confirmPassword
                  ? 'border-green-500 focus:ring-2 focus:ring-green-200'
                  : 'border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200',
            ]"
          />
          <p
            v-if="errors.confirmPassword"
            class="mt-2 text-sm text-red-600 flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            {{ errors.confirmPassword }}
          </p>
          <p
            v-else-if="touched.confirmPassword"
            class="mt-2 text-sm text-green-600 flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            Passwords match!
          </p>
        </div>

        <!-- Terms Checkbox -->
        <div>
          <label class="flex items-start gap-3 cursor-pointer">
            <input
              v-model="formData.acceptTerms"
              @change="validateField('acceptTerms')"
              type="checkbox"
              class="w-5 h-5 text-primary-500 rounded mt-0.5 focus:ring-2 focus:ring-primary-500"
            />
            <span class="text-sm text-neutral-700">
              I accept the
              <a href="#" class="text-primary-600 hover:underline"
                >terms and conditions</a
              >
              <span class="text-red-500">*</span>
            </span>
          </label>
          <p
            v-if="errors.acceptTerms"
            class="mt-2 ml-8 text-sm text-red-600 flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            {{ errors.acceptTerms }}
          </p>
        </div>

        <!-- Submit Button -->
        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            :disabled="!isFormValid || isSubmitting"
            :class="[
              'flex-1 h-14 rounded-xl font-semibold text-lg transition-all',
              isFormValid && !isSubmitting
                ? 'bg-primary-500 text-white hover:bg-primary-600 hover:scale-105 active:scale-95'
                : 'bg-neutral-300 text-neutral-500 cursor-not-allowed',
            ]"
          >
            <span
              v-if="isSubmitting"
              class="flex items-center justify-center gap-2"
            >
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </span>
            <span v-else>Submit Form</span>
          </button>
          <button
            type="button"
            @click="resetForm"
            class="px-6 h-14 bg-neutral-200 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-300 transition-all"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";

const formData = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
});

const errors = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: "",
});

const touched = reactive({
  username: false,
  email: false,
  password: false,
  confirmPassword: false,
  acceptTerms: false,
});

const showPassword = ref(false);
const isSubmitting = ref(false);
const submitSuccess = ref(false);

const passwordChecks = computed(() => ({
  length: formData.password.length >= 8,
  uppercase: /[A-Z]/.test(formData.password),
  number: /[0-9]/.test(formData.password),
  special: /[!@#$%^&*]/.test(formData.password),
}));

const isFormValid = computed(() => {
  return (
    formData.username &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.acceptTerms &&
    !errors.username &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword &&
    !errors.acceptTerms
  );
});

function validateField(field: keyof typeof formData) {
  touched[field] = true;

  switch (field) {
    case "username":
      if (!formData.username) {
        errors.username = "Username is required";
      } else if (formData.username.length < 3) {
        errors.username = "Username must be at least 3 characters";
      } else if (formData.username.length > 20) {
        errors.username = "Username must be less than 20 characters";
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        errors.username =
          "Username can only contain letters, numbers, and underscores";
      } else {
        errors.username = "";
      }
      break;

    case "email":
      if (!formData.email) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      } else {
        errors.email = "";
      }
      break;

    case "password":
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (!passwordChecks.value.length) {
        errors.password = "Password must be at least 8 characters";
      } else if (!passwordChecks.value.uppercase) {
        errors.password = "Password must contain at least one uppercase letter";
      } else if (!passwordChecks.value.number) {
        errors.password = "Password must contain at least one number";
      } else if (!passwordChecks.value.special) {
        errors.password =
          "Password must contain at least one special character (!@#$%^&*)";
      } else {
        errors.password = "";
      }
      // Re-validate confirm password if it's been touched
      if (touched.confirmPassword) {
        validateField("confirmPassword");
      }
      break;

    case "confirmPassword":
      if (!formData.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      } else {
        errors.confirmPassword = "";
      }
      break;

    case "acceptTerms":
      if (!formData.acceptTerms) {
        errors.acceptTerms = "You must accept the terms and conditions";
      } else {
        errors.acceptTerms = "";
      }
      break;
  }
}

function clearFieldError(field: keyof typeof errors) {
  if (errors[field]) {
    errors[field] = "";
  }
}

async function handleSubmit() {
  // Validate all fields
  Object.keys(formData).forEach((field) => {
    validateField(field as keyof typeof formData);
  });

  if (!isFormValid.value) {
    return;
  }

  isSubmitting.value = true;
  submitSuccess.value = false;

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  isSubmitting.value = false;
  submitSuccess.value = true;

  // Hide success message after 5 seconds
  setTimeout(() => {
    submitSuccess.value = false;
  }, 5000);
}

function resetForm() {
  formData.username = "";
  formData.email = "";
  formData.password = "";
  formData.confirmPassword = "";
  formData.acceptTerms = false;

  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });

  Object.keys(touched).forEach((key) => {
    touched[key as keyof typeof touched] = false;
  });

  submitSuccess.value = false;
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
