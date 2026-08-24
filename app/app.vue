<script setup lang="ts">
const mode = ref<'login' | 'register'>('login')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const user = ref<{ id: string; email: string; nom: string; prenom: string; role: string } | null>(null)
const simulations = ref<Array<{ id: string; title: string; status: string; currentStep: number; durationSec: number; createdAt: string }>>([])
const activeSimulation = ref<{ id: string; title: string; status: string; currentStep: number; durationSec: number } | null>(null)
const remainingSeconds = ref(120)
const stats = ref<{ total: number; completed: number; averageScore: number | null }>({ total: 0, completed: 0, averageScore: null })
const mentorSimulations = ref<Array<{ id: string; title: string; status: string; user: { nom: string; prenom: string }; evaluation: { score: number | null; comment: string } | null }>>([])
const evaluationForm = reactive({ simulationId: '', score: 15, comment: '' })
const cameraPreview = ref<HTMLVideoElement | null>(null)
const recording = ref(false)
const recordedVideo = ref<Blob | null>(null)
let cameraStream: MediaStream | undefined
let mediaRecorder: MediaRecorder | undefined
let recordedChunks: Blob[] = []
let timer: ReturnType<typeof setInterval> | undefined
const form = reactive({ email: '', password: '', nom: '', prenom: '', role: 'etudiant' })

async function loadSession() {
  const response = await $fetch<{ user: typeof user.value }>('/api/auth/me')
  user.value = response.user
  if (user.value) await loadSimulations()
}

async function loadSimulations() {
  simulations.value = await $fetch<typeof simulations.value>('/api/simulations')
  stats.value = await $fetch<typeof stats.value>('/api/stats')
  if (user.value?.role === 'maitre_memoire') {
    mentorSimulations.value = await $fetch<typeof mentorSimulations.value>('/api/mentor/simulations')
  }
}

async function createSimulation() {
  const simulation = await $fetch<typeof activeSimulation.value>('/api/simulations', { method: 'POST', body: {} })
  if (!simulation) return
  activeSimulation.value = simulation
  remainingSeconds.value = simulation.durationSec
  await loadSimulations()
  startTimer()
}

function startTimer() {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (remainingSeconds.value <= 0) {
      clearInterval(timer)
      timer = undefined
      return
    }
    remainingSeconds.value -= 1
  }, 1000)
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  const remainder = (seconds % 60).toString().padStart(2, '0')
  return `${minutes}:${remainder}`
}

async function updateStep(step: number) {
  if (!activeSimulation.value) return
  await $fetch(`/api/simulations/${activeSimulation.value.id}`, { method: 'PATCH', body: { currentStep: step } })
  activeSimulation.value.currentStep = step
  await loadSimulations()
}

async function completeSimulation() {
  if (!activeSimulation.value) return
  await $fetch(`/api/simulations/${activeSimulation.value.id}`, { method: 'PATCH', body: { status: 'completed', currentStep: 4 } })
  if (timer) clearInterval(timer)
  timer = undefined
  activeSimulation.value = null
  successMessage.value = 'Simulation terminée. Votre progression est enregistrée.'
  await loadSimulations()
}

async function startRecording() {
  if (!activeSimulation.value || !navigator.mediaDevices?.getUserMedia) {
    errorMessage.value = 'La caméra n’est pas disponible sur cet appareil.'
    return
  }
  cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  if (cameraPreview.value) cameraPreview.value.srcObject = cameraStream
  recordedChunks = []
  mediaRecorder = new MediaRecorder(cameraStream, { mimeType: 'video/webm' })
  mediaRecorder.ondataavailable = (event) => { if (event.data.size) recordedChunks.push(event.data) }
  mediaRecorder.onstop = () => { recordedVideo.value = new Blob(recordedChunks, { type: 'video/webm' }) }
  mediaRecorder.start()
  recording.value = true
}

function stopRecording() {
  if (!mediaRecorder || !cameraStream) return
  mediaRecorder.stop()
  cameraStream.getTracks().forEach((track) => track.stop())
  recording.value = false
}

async function uploadRecording() {
  if (!activeSimulation.value || !recordedVideo.value) return
  const formData = new FormData()
  formData.append('video', recordedVideo.value, 'simulation.webm')
  await $fetch(`/api/simulations/${activeSimulation.value.id}/video`, { method: 'POST', body: formData })
  successMessage.value = 'Vidéo envoyée et stockée.'
  recordedVideo.value = null
}

async function saveEvaluation() {
  await $fetch('/api/mentor/evaluations', { method: 'POST', body: evaluationForm })
  evaluationForm.comment = ''
  mentorSimulations.value = await $fetch<typeof mentorSimulations.value>('/api/mentor/simulations')
  successMessage.value = 'Évaluation enregistrée.'
}

async function submitForm() {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const endpoint = mode.value === 'login' ? '/api/auth/login' : '/api/auth/register'
    const response = await $fetch<{ user: typeof user.value }>(endpoint, { method: 'POST', body: form })
    user.value = response.user
    await loadSimulations()
    successMessage.value = mode.value === 'login' ? 'Connexion réussie.' : 'Compte créé avec succès.'
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || 'Une erreur est survenue. Réessayez.'
  } finally {
    loading.value = false
  }
}

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  user.value = null
  successMessage.value = ''
  simulations.value = []
  activeSimulation.value = null
  if (timer) clearInterval(timer)
}

onMounted(loadSession)
onUnmounted(() => { if (timer) clearInterval(timer); cameraStream?.getTracks().forEach((track) => track.stop()) })
</script>

<template>
  <main class="site-shell">
    <nav class="topbar">
      <a class="brand" href="#accueil" aria-label="Accueil Soutenance New">
        <span class="brand-mark">S+</span>
        <span>Soutenance<span class="brand-accent">New</span></span>
      </a>
      <div class="topbar-links">
        <a href="#methode">La méthode</a>
        <a href="#accompagnement">Accompagnement</a>
        <button v-if="user" class="text-button" type="button" @click="logout">Se déconnecter</button>
      </div>
    </nav>

    <section id="accueil" class="hero-section">
      <div class="hero-copy">
        <p class="eyebrow">Votre mémoire mérite une répétition générale</p>
        <h1>Présentez votre travail avec <em>assurance.</em></h1>
        <p class="hero-text">Un espace calme pour répéter, chronométrer et progresser avant le grand jour.</p>
        <div class="hero-actions">
          <a class="primary-button" href="#espace">Commencer maintenant <span>→</span></a>
          <a class="link-button" href="#methode">Découvrir la méthode <span>↓</span></a>
        </div>
        <div class="proof-row"><span class="proof-dot" /> Pensé pour les étudiants <span class="proof-separator">·</span> Simple, privé, progressif</div>
      </div>
      <div class="hero-visual" aria-label="Illustration d'une préparation de soutenance">
        <div class="visual-ring ring-one" />
        <div class="visual-ring ring-two" />
        <div class="visual-card">
          <div class="visual-card-top"><span>SESSION 01</span><span class="live-dot">● EN DIRECT</span></div>
          <div class="visual-timer">04:32</div>
          <div class="visual-line"><span /> <span /> <span /></div>
          <p>Votre voix porte. Votre idée aussi.</p>
        </div>
      </div>
    </section>

    <section id="methode" class="feature-strip">
      <div><span class="feature-number">01</span><h2>Répétez sans pression</h2><p>Un cadre réaliste pour trouver votre rythme.</p></div>
      <div><span class="feature-number">02</span><h2>Mesurez vos progrès</h2><p>Des sessions structurées et un historique clair.</p></div>
      <div><span class="feature-number">03</span><h2>Arrivez prêt</h2><p>Transformez le trac en confiance, étape par étape.</p></div>
    </section>

    <section id="espace" class="workspace-section">
      <div class="workspace-heading">
        <p class="eyebrow">Votre espace de préparation</p>
        <h2>{{ user ? `Bonjour ${user.prenom}.` : 'Commencez votre préparation.' }}</h2>
        <p>{{ user ? 'Votre espace est prêt. La prochaine répétition vous attend.' : 'Créez un compte étudiant ou connectez-vous pour retrouver vos sessions.' }}</p>
      </div>
      <div v-if="user && user.role === 'maitre_memoire'" class="dashboard-panel">
        <div class="dashboard-top"><div><span class="panel-kicker">ESPACE MAÎTRE DE MÉMOIRE</span><h3>Suivi des soutenances</h3></div><span class="status-label">{{ mentorSimulations.length }} simulations</span></div>
        <div class="history-list mentor-list"><div v-for="simulation in mentorSimulations" :key="simulation.id" class="mentor-item"><div><strong>{{ simulation.user.prenom }} {{ simulation.user.nom }}</strong><span>{{ simulation.title }}</span></div><button class="link-button" type="button" @click="evaluationForm.simulationId = simulation.id">Évaluer →</button></div><p v-if="!mentorSimulations.length" class="empty-state">Aucune simulation étudiante à évaluer.</p></div>
        <form v-if="evaluationForm.simulationId" class="evaluation-form" @submit.prevent="saveEvaluation"><label>Note sur 20<input v-model.number="evaluationForm.score" type="number" min="0" max="20" required /></label><label>Commentaire<textarea v-model="evaluationForm.comment" required rows="3" /></label><button class="primary-button" type="submit">Enregistrer l’évaluation <span>✓</span></button></form>
      </div>
      <div v-else-if="user && !activeSimulation" class="dashboard-panel">
        <div class="dashboard-top"><div><span class="panel-kicker">ESPACE {{ user.role === 'etudiant' ? 'ÉTUDIANT' : 'MAÎTRE DE MÉMOIRE' }}</span><h3>Votre progression</h3></div><button class="primary-button" type="button" @click="createSimulation">Nouvelle simulation <span>→</span></button></div>
        <div class="stats-row"><div><strong>{{ stats.total }}</strong><span>sessions enregistrées</span></div><div><strong>{{ stats.completed }}</strong><span>sessions terminées</span></div><div><strong>{{ stats.averageScore ?? '—' }}</strong><span>moyenne sur 20</span></div></div>
        <div class="history-list"><div v-for="simulation in simulations.slice(0, 4)" :key="simulation.id" class="history-item"><span>{{ simulation.title }}</span><span :class="['status-label', simulation.status]">{{ simulation.status === 'completed' ? 'Terminée' : 'En cours' }}</span></div><p v-if="!simulations.length" class="empty-state">Aucune session pour le moment. Votre première répétition peut commencer.</p></div>
      </div>
      <div v-else-if="user && activeSimulation" class="simulation-panel">
        <div class="simulation-top"><div><span class="panel-kicker">SESSION EN COURS</span><h3>{{ activeSimulation.title }}</h3></div><div class="big-timer">{{ formatTime(remainingSeconds) }}</div></div>
        <div class="camera-box"><video ref="cameraPreview" autoplay muted playsinline /><p v-if="!recording">Activez la caméra pour enregistrer votre répétition.</p><span v-else class="recording-label">● ENREGISTREMENT EN COURS</span><button v-if="!recording" class="link-button" type="button" @click="startRecording">Démarrer la caméra</button><button v-else class="link-button" type="button" @click="stopRecording">Arrêter l’enregistrement</button><button v-if="recordedVideo" class="primary-button" type="button" @click="uploadRecording">Envoyer la vidéo <span>↑</span></button></div>
        <div class="steps-row"><button v-for="step in 4" :key="step" :class="{ current: activeSimulation.currentStep === step, done: activeSimulation.currentStep > step }" type="button" @click="updateStep(step)"><span>{{ String(step).padStart(2, '0') }}</span>{{ ['Introduction', 'Contexte', 'Résultats', 'Conclusion'][step - 1] }}</button></div>
        <div class="simulation-body"><p class="eyebrow">Étape {{ activeSimulation.currentStep }} sur 4</p><h3>{{ ['Présentez votre sujet', 'Posez votre contexte', 'Partagez vos résultats', 'Ouvrez la discussion'][activeSimulation.currentStep - 1] }}</h3><p>Prenez votre temps, regardez votre caméra et faites passer votre idée avec vos propres mots.</p><div class="simulation-actions"><button class="link-button" type="button" :disabled="activeSimulation.currentStep === 1" @click="updateStep(activeSimulation.currentStep - 1)">← Étape précédente</button><button v-if="activeSimulation.currentStep < 4" class="primary-button" type="button" @click="updateStep(activeSimulation.currentStep + 1)">Étape suivante <span>→</span></button><button v-else class="primary-button" type="button" @click="completeSimulation">Terminer la session <span>✓</span></button></div></div>
      </div>
      <form v-else class="auth-panel" @submit.prevent="submitForm">
        <div class="auth-tabs"><button :class="{ active: mode === 'login' }" type="button" @click="mode = 'login'">Connexion</button><button :class="{ active: mode === 'register' }" type="button" @click="mode = 'register'">Créer un compte</button></div>
        <div v-if="mode === 'register'" class="field-row"><label>Prénom<input v-model="form.prenom" required autocomplete="given-name" /></label><label>Nom<input v-model="form.nom" required autocomplete="family-name" /></label></div>
        <label>Email professionnel<input v-model="form.email" type="email" required autocomplete="email" /></label>
        <label>Mot de passe<input v-model="form.password" type="password" minlength="8" required autocomplete="current-password" /></label>
        <label v-if="mode === 'register'">Je suis<select v-model="form.role"><option value="etudiant">Étudiant</option><option value="maitre_memoire">Maître de mémoire</option></select></label>
        <p v-if="errorMessage" class="form-message error">{{ errorMessage }}</p><p v-if="successMessage" class="form-message success">{{ successMessage }}</p>
        <button class="primary-button form-submit" type="submit" :disabled="loading">{{ loading ? 'Chargement...' : mode === 'login' ? 'Ouvrir mon espace' : 'Créer mon espace' }} <span>→</span></button>
      </form>
    </section>

    <footer id="accompagnement"><span>Soutenance New</span><span>Un meilleur oral commence par une bonne répétition.</span></footer>
  </main>
</template>